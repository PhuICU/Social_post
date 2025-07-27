import { Request, Response } from "express";
import { ParamsDictionary } from "express-serve-static-core";
import httpStatusCode from "~/constants/httpStatusCode";
import {
  LoginRequest,
  ResgisterRequest,
} from "~/models/requests/Common.request";
import { USER_SCHEMA } from "~/models/schemas/User.schema";
import refreshTokenService from "~/services/refreshToken.service";
import userService from "~/services/user.service";
import { TokenPayload } from "~/type";
import { sendEmailVerification } from "~/utils/mail";
import { ErrorWithMessage } from "~/utils/error";
import JwtModule from "~/utils/jwt";
import { responseSuccess } from "~/utils/response";

const register = async (
  req: Request<ParamsDictionary, any, ResgisterRequest, any>,
  res: Response
) => {
  const payload = req.body;
  const result = await userService.createAccount(payload);
  const user = await userService.getUserById(result.insertedId.toString());
  if (user) {
    const token = await JwtModule.signEmailVerifyToken({
      user_id: user._id.toString(),
      verify: user.verify,
      role: user.role,
    });
    const updateUser = await userService.updateEmailVerifyToken(
      user._id.toString(),
      token
    );
    await sendEmailVerification(user.email, token, "Xác thực email", user.role);
  }
  return responseSuccess(res, {
    message: "Tạo tài khoản thành công",
    data: result,
  });
};
const login = async (
  req: Request<ParamsDictionary, any, LoginRequest, any>,
  res: Response
) => {
  const payload = req.body;
  const result = await userService.login(payload);
  if (!result.access_token && !result.refresh_token) {
    return responseSuccess(res, {
      message: "Tài khoản chưa được xác thực",
      data: { user: result.user, access_token: null, refresh_token: null },
    });
  }
  await refreshTokenService.createRefreshToken(
    result.user._id.toString(),
    result.refresh_token
  );
  return responseSuccess(res, {
    message: "Đăng nhập thành công",
    data: {
      user: result.user,
      access_token: result.access_token,
      refresh_token: result.refresh_token,
    },
  });
};
const logout = async (
  req: Request<ParamsDictionary, any, { refresh_token: string }, any>,
  res: Response
) => {
  const { refresh_token } = req.body;
  const result = await refreshTokenService.deleteToken(refresh_token);
  return responseSuccess(res, {
    message: "Đăng xuất thành công",
    data: result,
  });
};
const refreshAccessToken = async (
  req: Request<ParamsDictionary, any, { refresh_token: string }, any>,
  res: Response
) => {
  // Get refresh token from request
  const { refresh_token } = req.body;
  const decoded_refresh_token = req.decoded_refresh_token as TokenPayload;
  const result = await userService.refreshAccessToken(
    refresh_token,
    decoded_refresh_token
  );
  return responseSuccess(res, {
    message: "Lấy access token mới thành công",
    data: result,
  });
};
const verifyEmail = async (
  req: Request<ParamsDictionary, any, any, any>,
  res: Response
) => {
  const decoded_email = req.decoded_email_verify_token as TokenPayload;
  const result = await userService.verifiedEmail(decoded_email);
  return responseSuccess(res, {
    message: "Xác thực email thành công",
    data: result,
  });
};
const resendEmailVerification = async (
  req: Request<ParamsDictionary, any, any, any>,
  res: Response
) => {
  const { user_id } = req.query;
  if (!user_id) {
    throw new ErrorWithMessage({
      message: "Thiếu thông tin user_id",
      status: httpStatusCode.BAD_REQUEST,
    });
  }
  const result = await userService.resendEmailVerification(user_id);
  if (!result) {
    return responseSuccess(res, {
      message: "Tài khoản đã được xác thực",
      data: null,
    });
  }
  const send_message_result = await sendEmailVerification(
    result.email,
    result.email_verify_token,
    "Xác thực email",
    result.role
  );
  return responseSuccess(res, {
    message: "Gửi lại email xác thực thành công",
    data: send_message_result,
  });
};
const forgotPassword = async (
  req: Request<ParamsDictionary, any, any, any>,
  res: Response
) => {
  console.log("user", req);
  const user = req.user as USER_SCHEMA;

  const result = await userService.forgotPassword(user);
  return responseSuccess(res, {
    message: "Gửi email đổi mật khẩu thành công",
    data: {
      token: result?.forgot_password_token,
    },
  });
};

const resetPassword = async (
  req: Request<ParamsDictionary, any, { email: string; password: string }, any>,
  res: Response
) => {
  console.log("user", req.body);
  const user = await userService.getUserByEmail(req.body.email);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  const result = await userService.resetPassword(
    user._id.toString(),
    req.body.password
  );
  return responseSuccess(res, {
    message: "Reset mật khẩu thành công",
    data: result,
  });
};
const changePassword = async (
  req: Request<
    ParamsDictionary,
    any,
    { old_password: string; new_password: string },
    any
  >,
  res: Response
) => {
  const { user_id } = req.decoded_access_token as TokenPayload;
  const result = await userService.changePassword(
    user_id,
    req.body.new_password
  );
  return responseSuccess(res, {
    message: "Đổi mật khẩu thành công",
    data: result,
  });
};

const checkOtp = async (
  req: Request<ParamsDictionary, any, any, any>,
  res: Response
) => {
  const { otp } = req.body;

  // Use optional chaining to avoid errors if 'decoded_forgot_password_token' is undefined
  const user_id = (req.decoded_forgot_password_token as TokenPayload)?.user_id;

  if (!user_id) {
    return res
      .status(400)
      .json({ message: "Invalid token or user ID not found" });
  }

  const result = await userService.checkOtp(otp, user_id);
  return responseSuccess(res, {
    message: "Check OTP thành công",
    data: result,
  });
};
const commonControllers = {
  register,
  login,
  logout,
  refreshAccessToken,
  verifyEmail,
  resendEmailVerification,
  forgotPassword,
  resetPassword,
  changePassword,
  checkOtp,
};
export default commonControllers;
