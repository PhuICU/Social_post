import { Router } from "express";
import commonControllers from "~/controllers/common.controller";
import usersControllers from "~/controllers/user.controller";
import commonMiddlewares from "~/middlewares/common.middleware";
import usersMiddlewares from "~/middlewares/user.middleware";
import { wrapRequestHandler } from "~/utils/requestHandler";

const userRoutes = Router();

/**
 * description: Register a new user account
 * method: POST
 * path: /users/register
 * body: UserTypes
 */
userRoutes.post(
  "/register",
  commonMiddlewares.registerBodyValidator,
  wrapRequestHandler(commonControllers.register)
);
/**
 * description: Login to an existing user account
 * method: POST
 * path: /users/login
 * body: { email: string, password: string }
 */
userRoutes.post(
  "/login",
  commonMiddlewares.loginBodyValidator,
  wrapRequestHandler(commonControllers.login)
);
/**
 * description: Logout from the current session
 * method: POST
 * path: /users/logout
 * body: { refresh_token: string }
 * headers: {
 *  Authorization: {
 *  description: Bearer access_token
 * }
 * }
 */
userRoutes.post(
  "/logout",
  commonMiddlewares.accessTokenValidator,
  commonMiddlewares.refreshTokenValidator,
  wrapRequestHandler(commonControllers.logout)
);
/**
 * description: Refresh access token
 * method: POST
 * path: /users/refresh-access-token
 * body: { refresh_token: string }
 *
 */
userRoutes.post(
  "/refresh-access-token",
  commonMiddlewares.refreshTokenValidator,
  wrapRequestHandler(commonControllers.refreshAccessToken)
);
/**
 * description: Verify email
 * method: GET
 * path: /users/verify-email
 * query: { token: string }
 */
userRoutes.get(
  "/verify-email",
  commonMiddlewares.verifyEmailValidator,
  wrapRequestHandler(commonControllers.verifyEmail)
);
/**
 * description: Resend email verification
 * method: POST
 * path: /users/resend-email-verification
 * body: { email: string }
 */
userRoutes.get(
  "/resend-email-verification",
  wrapRequestHandler(commonControllers.resendEmailVerification)
);
/**
 * description: Forgot password
 * method: POST
 * path: /users/forgot-password
 * body: { email: string }
 */
userRoutes.post(
  "/forgot-password",
  commonMiddlewares.forgotPasswordValidator,
  wrapRequestHandler(commonControllers.forgotPassword)
);
/**
 * description: Reset password
 * method: POST
 * path: /users/reset-password
 * queries: {token: string}
 * body: { password: string }
 */
userRoutes.post(
  "/reset-password",
  commonMiddlewares.resetPasswordValidator,
  wrapRequestHandler(commonControllers.resetPassword)
);
/**
 * description: Change password for the current user
 * method: POST
 * path: /users/change-password
 * body: { old_password: string, new_password: string }
 * headers: {
 * Authorization: {
 * description: Bearer access_token
 * }
 * }
 */
userRoutes.post(
  "/change-password",
  commonMiddlewares.accessTokenValidator,
  commonMiddlewares.changePasswordValidator,
  wrapRequestHandler(commonControllers.changePassword)
);

/**
 * description: Get user profile
 * method: GET
 * path: /users/profile
 * headers: {
 * Authorization: { description: Bearer access_token }
 * }
 */
userRoutes.get(
  "/profile",
  commonMiddlewares.accessTokenValidator,
  wrapRequestHandler(usersControllers.getProfile)
);
/**
 * description: Update user profile
 * method: PUT
 * path: /users/profile
 * headers: {
 * Authorization: { description: Bearer access_token }
 * }
 * body: UserProfile
 */
userRoutes.put(
  "/profile",
  commonMiddlewares.accessTokenValidator,
  usersMiddlewares.updateProfileVaidator,
  wrapRequestHandler(usersControllers.updateProfile)
);
/**
 * description: lock a post
 * methods: POST
 * body: {post_id: string}
 * headers: {Authorization: {description: Bearer access_token}}
 */
userRoutes.post(
  "/lock-post",
  commonMiddlewares.accessTokenValidator,
  wrapRequestHandler(usersControllers.lockPost)
);
/**
 * description: unlock a post
 * methods: DELETE
 * path: /lock-post/:post_id
 * headers: {Authorization: {description: Bearer access_token}}
 */
userRoutes.delete(
  "/lock-post/:post_id",
  commonMiddlewares.accessTokenValidator,
  wrapRequestHandler(usersControllers.unlockPost)
);
/**
 * description: get lock posts
 */
userRoutes.get(
  "/lock-posts",
  commonMiddlewares.accessTokenValidator,
  wrapRequestHandler(usersControllers.getLockPosts)
);
/**
 * description: request lock account
 * methods: POST
 * body: {reason: string}
 * headers: {Authorization: {description: Bearer access_token}}
 * path: /lock-account
 */
userRoutes.put(
  "/request-lock-account",
  commonMiddlewares.accessTokenValidator,
  wrapRequestHandler(usersControllers.requestLockAccount)
);
/**
 * description: request unlock account
 * methods: POST
 * headers: {Authorization: {description: Bearer access_token}}
 */
userRoutes.put(
  "/request-unlock-account",
  commonMiddlewares.accessTokenValidator,
  wrapRequestHandler(usersControllers.requestUnlockAccount)
);
/**
 * description: lock account
 * methods: POST
 * headers: {Authorization: {description: Bearer access_token}}
 * path: /lock-account
 * middlewares: isAdmin
 */
userRoutes.put(
  "/lock-account/:user_id",
  commonMiddlewares.accessTokenValidator,
  // commonMiddlewares.isAdmin,
  wrapRequestHandler(usersControllers.lockAccount)
);
/**
 * description: unlock account
 * methods: POST
 * headers: {Authorization: {description: Bearer access_token}}
 * path: /unlock-account
 * middlewares: isAdmin
 */
userRoutes.put(
  "/unlock-account/:user_id",
  commonMiddlewares.accessTokenValidator,
  commonMiddlewares.isAdmin,
  wrapRequestHandler(usersControllers.unlockAccount)
);
/**
 * description: get all users
 * methods: GET
 * headers: {Authorization: {description: Bearer access_token}}
 * path: /users
 * middlewares: isAdmin
 */
userRoutes.get(
  "/",
  commonMiddlewares.accessTokenValidator,
  commonMiddlewares.isAdmin,
  wrapRequestHandler(usersControllers.getAllUsers)
);

// check otp
userRoutes.post("/check-otp", wrapRequestHandler(commonControllers.checkOtp));

userRoutes.get("/:id", wrapRequestHandler(usersControllers.getUserById));

userRoutes.get(
  "/slug/:slug",
  wrapRequestHandler(usersControllers.getUserBySlug)
);

export default userRoutes;
