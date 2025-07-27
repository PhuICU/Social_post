import { USER_SCHEMA } from "~/models/schemas/User.schema";
import { ObjectId } from "mongodb";
import { USER_REQUEST } from "~/models/requests/User.request";
import databaseService from "./database.service";
import {
  LoginRequest,
  ResgisterRequest,
} from "~/models/requests/Common.request";
import hashPassword from "~/utils/crypto";
import JwtModule from "~/utils/jwt";
import { ErrorWithMessage } from "~/utils/error";
import { omit } from "lodash";
import { ROLE_TYPE, USER_VERIFY_STATUS } from "~/enum/utiils.enum";
import { TokenPayload } from "~/type.d";
import refreshTokenService from "./refreshToken.service";
import { sendEmailResetPassword } from "~/utils/mail";

class UserService {
  async createAccount(payload: ResgisterRequest) {
    return databaseService.users.insertOne(
      new USER_SCHEMA({
        ...payload,
        password: hashPassword(payload.password),
      })
    );
  }

  async findExistedEmail(email: string) {
    return databaseService.users.findOne({ email });
  }
  async getUserById(id: string) {
    return databaseService.users.findOne({ _id: new ObjectId(id) });
  }
  async updateEmailVerifyToken(id: string, token: string) {
    return databaseService.users.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: { email_verify_token: token, updated_at: new Date() } },
      { returnDocument: "after" }
    );
  }
  async login(payload: LoginRequest) {
    const user = (await this.findExistedEmail(payload.email)) as USER_SCHEMA;
    if (!user)
      throw new ErrorWithMessage({
        message: "Không tìm thấy email",
        status: 401,
      });
    if (user.verify === USER_VERIFY_STATUS.BLOCKED) {
      throw new ErrorWithMessage({
        message: "Tài khoản đã bị khóa",
        status: 403,
      });
    }
    if (user.verify === USER_VERIFY_STATUS.UNVERIFIED) {
      return {
        user: omit(user, ["password"]),
        access_token: null,
        refresh_token: null,
      };
    }
    const result = await Promise.all([
      JwtModule.signAcessToken({
        user_id: user._id.toString(),

        role: user.role,
        verify: user.verify,
      }),
      JwtModule.signRefreshToken({
        user_id: user._id.toString(),

        role: user.role,
        verify: user.verify,
      }),
    ]);
    return {
      user: omit(user, ["password"]),
      access_token: result[0],
      refresh_token: result[1],
    };
  }
  async refreshAccessToken(
    refresh_token: string,
    decoded_refresh_token: TokenPayload
  ) {
    const user = await this.getUserById(decoded_refresh_token.user_id);
    if (!user)
      throw new ErrorWithMessage({
        message: "Không tìm thấy user",
        status: 404,
      });
    const [n_at, n_rt, _] = await Promise.all([
      JwtModule.signAcessToken({
        user_id: user._id.toString(),

        role: user.role,
        verify: user.verify,
      }),
      JwtModule.signRefreshToken({
        user_id: user._id.toString(),

        role: user.role,
        verify: user.verify,
        exp: decoded_refresh_token.exp,
      }),
      refreshTokenService.deleteToken(refresh_token),
    ]);
    await refreshTokenService.createRefreshToken(user._id.toString(), n_rt);
    return {
      user: omit(user, ["password"]),
      access_token: n_at,
      refresh_token: n_rt,
    };
  }
  async updateEmailVerified(id: string) {
    return databaseService.users.findOneAndUpdate(
      {
        _id: new ObjectId(id),
      },
      {
        $set: {
          verify: USER_VERIFY_STATUS.VERIFIED,
          email_verify_token: "",
          updated_at: new Date(),
        },
      },
      {
        returnDocument: "after",
      }
    );
  }
  async verifiedEmail(token: TokenPayload) {
    const user = await this.getUserById(token.user_id);
    if (!user)
      throw new ErrorWithMessage({
        message: "Không tìm thấy user",
        status: 404,
      });
    if (user.verify === USER_VERIFY_STATUS.VERIFIED) {
      throw new ErrorWithMessage({
        message: "Email đã được xác thực",
        status: 400,
      });
    }
    return await this.updateEmailVerified(user._id.toString());
  }
  async resendEmailVerification(id: string) {
    const user = await this.getUserById(id);
    if (!user)
      throw new ErrorWithMessage({
        message: "Không tìm thấy user",
        status: 404,
      });
    if (user.verify === USER_VERIFY_STATUS.VERIFIED) return null;
    const token = await JwtModule.signEmailVerifyToken({
      user_id: user._id.toString(),
      verify: user.verify,
      role: user.role,
    });
    return await this.updateEmailVerifyToken(user._id.toString(), token);
  }
  // public async forgotPassword(user: USER_SCHEMA) {
  //   const token = await JwtModule.signForgotPasswordToken({
  //     account_type: user.account_type,
  //     role: user.role,
  //     user_id: user._id.toString(),
  //     verify: user.verify
  //   })
  //   const result = await sendEmailResetPassword({
  //     email: user.email,
  //     token,
  //     account_type: user.account_type,
  //     role: user.role,
  //     subject: 'Đặt lại mật khẩu'
  //   })
  //   return await databaseService.users.findOneAndUpdate(
  //     { _id: new ObjectId(user._id) },
  //     { $set: { forgot_password_token: token, updated_at: new Date() } },
  //     { returnDocument: 'after' }
  //   )
  // }

  //send otp to email for reset password, otp random 6 number
  public async forgotPassword(user: USER_SCHEMA) {
    const otp = Math.floor(100000 + Math.random() * 900000);
    const result = await sendEmailResetPassword({
      email: user.email,
      otp,
      role: user.role,
      subject: "Đặt lại mật khẩu",
    });
    return await databaseService.users.findOneAndUpdate(
      { _id: new ObjectId(user._id) },
      {
        $set: { forgot_password_token: otp.toString(), updated_at: new Date() },
      },
      { returnDocument: "after" }
    );
  }

  public async checkOtp(otp: string, _id: string) {
    const user = await this.getUserById(_id);
    if (!user)
      throw new ErrorWithMessage({
        message: "Không tìm thấy user",
        status: 404,
      });
    if (user.forgot_password_token !== otp)
      throw new ErrorWithMessage({
        message: "Mã OTP không chính xác",
        status: 400,
      });
    return await databaseService.users.findOneAndUpdate(
      { _id: new ObjectId(_id) },
      { $set: { updated_at: new Date() } },
      { returnDocument: "after" }
    );
  }

  //get user by email
  public async getUserByEmail(email: string) {
    return databaseService.users.findOne({ email });
  }

  async resetPassword(id: string, n_password: string) {
    return databaseService.users.findOneAndUpdate(
      { _id: new ObjectId(id) },
      {
        $set: {
          password: hashPassword(n_password),
          forgot_password_token: "",
          updated_at: new Date(),
        },
      },
      { returnDocument: "after" }
    );
  }
  async changePassword(id: string, n_password: string) {
    const user = await this.getUserById(id);
    if (!user)
      throw new ErrorWithMessage({
        message: "Không tìm thấy user",
        status: 404,
      });
    return databaseService.users.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: { password: hashPassword(n_password), updated_at: new Date() } },
      { returnDocument: "after" }
    );
  }
  public async findUserById(id: string) {
    return databaseService.users.findOne({ _id: new ObjectId(id) });
  }
  async updateProfile(id: string, payload: USER_REQUEST) {
    return databaseService.users.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: { ...payload, updated_at: new Date() } },
      { returnDocument: "after" }
    );
  }
  async blockPost(id: string, post_id: string) {
    return databaseService.users.findOneAndUpdate(
      { _id: new ObjectId(id) },
      {
        $push: { locked_posts: new ObjectId(post_id) },
        $set: { updated_at: new Date() },
      },
      { returnDocument: "after" }
    );
  }
  async unblockPost(id: string, post_id: string) {
    return databaseService.users.findOneAndUpdate(
      { _id: new ObjectId(id) },
      {
        $pull: { blocked_posts: new ObjectId(post_id) },
        $set: { updated_at: new Date() },
      },
      { returnDocument: "after" }
    );
  }
  async getLockPosts(user_id: string) {
    const user = await this.getUserById(user_id);
    if (!user)
      throw new ErrorWithMessage({
        message: "Không tìm thấy user",
        status: 404,
      });
    const { locked_posts } = user;
    return await databaseService.posts
      .find({ _id: { $in: locked_posts } })
      .toArray();
  }
  public async requestLockAccount(user_id: string) {
    return databaseService.users.findOneAndUpdate(
      { _id: new ObjectId(user_id) },
      {
        $set: {
          verify: USER_VERIFY_STATUS.REQUEST_LOCK,
          updated_at: new Date(),
        },
      },
      { returnDocument: "after" }
    );
  }
  public async requestUnlockAccount(user_id: string) {
    return databaseService.users.findOneAndUpdate(
      { _id: new ObjectId(user_id) },
      {
        $set: {
          verify: USER_VERIFY_STATUS.REQUEST_UNLOCK,
          updated_at: new Date(),
        },
      },
      { returnDocument: "after" }
    );
  }
  public async lockAccount(user_id: string) {
    return databaseService.users.findOneAndUpdate(
      { _id: new ObjectId(user_id) },
      { $set: { verify: USER_VERIFY_STATUS.BLOCKED, updated_at: new Date() } },
      { returnDocument: "after" }
    );
  }
  public async unlockAccount(user_id: string) {
    return databaseService.users.findOneAndUpdate(
      { _id: new ObjectId(user_id) },
      { $set: { verify: USER_VERIFY_STATUS.VERIFIED, updated_at: new Date() } },
      { returnDocument: "after" }
    );
  }
  public async getAllUsers() {
    return databaseService.users.find({ role: ROLE_TYPE.USER }).toArray();
  }
}

const userService = new UserService();
export default userService;
