export enum ROLE_TYPE {
  ADMIN = "admin",
  USER = "user",
}

export enum USER_VERIFY_STATUS {
  PENDING = "PENDING",
  VERIFIED = "VERIFIED",
  REJECTED = "REJECTED",
  BLOCKED = "BLOCKED",
  UNVERIFIED = "UNVERIFIED",
  REQUEST_LOCK = "REQUEST_LOCK",
  REQUEST_UNLOCK = "REQUEST_UNLOCK",
}

export enum REPORT_STATUS {
  PENDING = "PENDING",
  WARNING = "WARNING",
  REMOVE_POST = "REMOVE_POST",
  UNRESOLVED = "UNRESOLVED",
}

export enum REPORT_TYPE {
  COMMENT = "COMMENT",
  POST = "POST",
}

export enum TOKEN_TYPE {
  ACCESS_TOKEN = "access_token",
  REFRESH_TOKEN = "refresh_token",
  EMAIL_VERIFY_TOKEN = "email_verify_token",
  FORGOT_PASSWORD_TOKEN = "forgot_password_token",
}
