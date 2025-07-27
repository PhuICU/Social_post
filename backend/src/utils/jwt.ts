import { Request } from "express";
import jwt, { JsonWebTokenError, TokenExpiredError } from "jsonwebtoken";
import env_config from "~/configs/env.config";
import httpStatusCode from "~/constants/httpStatusCode";
import message from "~/constants/message";
import { USER_VERIFY_STATUS } from "~/enum/utiils.enum";
import { TOKEN_TYPE, ROLE_TYPE } from "~/enum/utiils.enum";
import refreshTokenService from "~/services/refreshToken.service";
import { TokenPayload } from "~/type";
import { ErrorWithMessage, UnauthorizedError } from "./error";

const signToken = ({
  payload,
  secretKey,
  option = {
    algorithm: "HS256",
  },
}: {
  payload: string | object | Buffer;
  secretKey: string;
  option?: jwt.SignOptions;
}) =>
  new Promise<string>((resolve, reject) => {
    jwt.sign(payload, secretKey, option, (err, token) => {
      if (err) {
        reject(err);
      }
      resolve(token as string);
    });
  });
const verifyToken = ({
  token,
  secretKey,
}: {
  token: string;
  secretKey: string;
}) =>
  new Promise<TokenPayload>((resolve, reject) => {
    jwt.verify(token, secretKey, (err, decoded) => {
      if (err) {
        return reject(err);
      }
      return resolve(decoded as TokenPayload);
    });
  });
const signAcessToken = ({
  user_id,
  verify,
  role,
}: {
  user_id: string;
  verify: USER_VERIFY_STATUS;
  role: ROLE_TYPE;
}) =>
  signToken({
    payload: {
      user_id,
      verify,
      role,
      token_type: TOKEN_TYPE.ACCESS_TOKEN,
    },
    secretKey: env_config.ACCESS_TOKEN_SECRET_KEY as string,
    option: {
      expiresIn: env_config.ACCESS_TOKEN_EXPIRES_IN as string | number,
    },
  });
const signRefreshToken = ({
  user_id,
  verify,
  role,
  exp,
}: {
  user_id: string;
  verify: USER_VERIFY_STATUS;
  role: ROLE_TYPE;
  exp?: string | number;
}) =>
  exp
    ? signToken({
        payload: {
          user_id,
          verify,
          role,
          token_type: TOKEN_TYPE.REFRESH_TOKEN,
        },
        secretKey: env_config.REFRESH_TOKEN_SECRET_KEY as string,
        option: {
          expiresIn: exp,
        },
      })
    : signToken({
        payload: {
          user_id,
          verify,
          role,
          token_type: TOKEN_TYPE.REFRESH_TOKEN,
        },
        secretKey: env_config.REFRESH_TOKEN_SECRET_KEY as string,
        option: {
          expiresIn: env_config.REFRESH_TOKEN_EXPIRES_IN as string | number,
        },
      });
const signEmailVerifyToken = ({
  user_id,
  verify,
  role,
}: {
  user_id: string;
  verify: USER_VERIFY_STATUS;
  role: ROLE_TYPE;
}) =>
  signToken({
    payload: {
      user_id,
      verify,
      role,
      token_type: TOKEN_TYPE.EMAIL_VERIFY_TOKEN,
    },
    secretKey: env_config.EMAIL_VERIFICATION_SECRET_KEY as string,
    option: {
      expiresIn: env_config.EMAIL_VERIFY_TOKEN_EXPIRES_IN as string | number,
    },
  });

const signForgotPasswordToken = ({
  user_id,
  verify,
  role,
}: {
  user_id: string;
  verify: USER_VERIFY_STATUS;
  role: ROLE_TYPE;
}) =>
  signToken({
    payload: {
      user_id,
      verify,
      role,
      token_type: TOKEN_TYPE.FORGOT_PASSWORD_TOKEN,
    },
    secretKey: env_config.FORGOT_PASSWORD_SECRET_KEY as string,
    option: {
      expiresIn: env_config.FORGOT_PASSWORD_TOKEN_EXPIRES_IN as string | number,
    },
  });
const decodedToken = ({
  token,
  tokenType,
}: {
  token: string;
  tokenType: TOKEN_TYPE;
}) => {
  const secretKey =
    tokenType === TOKEN_TYPE.ACCESS_TOKEN
      ? env_config.ACCESS_TOKEN_SECRET_KEY
      : tokenType === TOKEN_TYPE.REFRESH_TOKEN
        ? env_config.REFRESH_TOKEN_SECRET_KEY
        : tokenType === TOKEN_TYPE.EMAIL_VERIFY_TOKEN
          ? env_config.EMAIL_VERIFICATION_SECRET_KEY
          : env_config.FORGOT_PASSWORD_SECRET_KEY;
  return verifyToken({ token, secretKey: secretKey as string });
};
const verifyAccessToken = async (access_token: string, req?: Request) => {
  if (!access_token)
    throw new ErrorWithMessage({
      message: message.errors.unauthorized.at_required,
      status: httpStatusCode.UNAUTHORIZED,
    });
  try {
    const decoded_at = await decodedToken({
      token: access_token,
      tokenType: TOKEN_TYPE.ACCESS_TOKEN,
    });
    if (req) req.decoded_access_token = decoded_at;
    return decoded_at;
  } catch (error) {
    // check if token is expired
    console.log("error", typeof error);
    if (error instanceof TokenExpiredError) {
      throw new ErrorWithMessage({
        message: message.errors.unauthorized.at_expired,
        status: httpStatusCode.UNAUTHORIZED,
      });
    } else
      throw new ErrorWithMessage({
        message: (error as JsonWebTokenError).message,
        status: httpStatusCode.UNAUTHORIZED,
      });
  }
};
const verifyRefreshToken = async (refresh_token: string, req?: Request) => {
  if (!refresh_token)
    throw new ErrorWithMessage({
      message: message.errors.unauthorized.rt_required,
      status: httpStatusCode.UNAUTHORIZED,
    });
  try {
    const [decoded_authorization, refresh_token_db] = await Promise.all([
      decodedToken({
        token: refresh_token,
        tokenType: TOKEN_TYPE.REFRESH_TOKEN,
      }),
      refreshTokenService.findToken(refresh_token),
    ]);
    if (!refresh_token_db) {
      throw new ErrorWithMessage({
        message: message.errors.unauthorized.rt_used_or_not_found,
        status: httpStatusCode.UNAUTHORIZED,
      });
    }
    if (req) req.decoded_refresh_token = decoded_authorization;
    return decoded_authorization;
  } catch (error) {
    // check if token is expired
    if ((error as JsonWebTokenError).message === "jwt expired") {
      throw new UnauthorizedError({
        errors: {
          refresh_token: {
            msg: message.errors.unauthorized.rt_expired,
          },
        },
      });
    } else
      throw new ErrorWithMessage({
        message: (error as JsonWebTokenError).message,
        status: httpStatusCode.UNAUTHORIZED,
      });
  }
};
const verifyEmailVerifyToken = async (token: string, req?: Request) => {
  if (!token)
    throw new ErrorWithMessage({
      message: message.errors.unauthorized.verify_email.required,
      status: httpStatusCode.UNAUTHORIZED,
    });
  try {
    const decoded_token = await decodedToken({
      token,
      tokenType: TOKEN_TYPE.EMAIL_VERIFY_TOKEN,
    });
    if (req) req.decoded_email_verify_token = decoded_token;
    return decoded_token;
  } catch (error) {
    // check if token is expired
    if ((error as JsonWebTokenError).message === "jwt expired") {
      throw new UnauthorizedError({
        errors: {
          token: {
            msg: message.errors.unauthorized.verify_email.expired,
          },
        },
      });
    } else
      throw new ErrorWithMessage({
        message: (error as JsonWebTokenError).message,
        status: httpStatusCode.UNAUTHORIZED,
      });
  }
};
const verifyForgotPasswordToken = async (token: string, req?: Request) => {
  if (!token)
    throw new ErrorWithMessage({
      message: message.errors.unauthorized.reset_password.token_required,
      status: httpStatusCode.UNAUTHORIZED,
    });
  try {
    const decoded_token = await decodedToken({
      token,
      tokenType: TOKEN_TYPE.FORGOT_PASSWORD_TOKEN,
    });
    if (req) req.decoded_forgot_password_token = decoded_token;
    return decoded_token;
  } catch (error) {
    // check if token is expired
    if ((error as JsonWebTokenError).message === "jwt expired") {
      throw new UnauthorizedError({
        errors: {
          token: {
            msg: message.errors.unauthorized.reset_password.token_expired,
          },
        },
      });
    } else
      throw new ErrorWithMessage({
        message: (error as JsonWebTokenError).message,
        status: httpStatusCode.UNAUTHORIZED,
      });
  }
};
const JwtModule = {
  signToken,
  verifyToken,
  verifyAccessToken,
  verifyRefreshToken,
  signAcessToken,
  signRefreshToken,
  signEmailVerifyToken,
  signForgotPasswordToken,
  verifyEmailVerifyToken,
  decodedToken,
  verifyForgotPasswordToken,
};
export default JwtModule;
