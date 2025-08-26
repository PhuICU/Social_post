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

export enum SCOPE_TYPE {
  PUBLIC = "public",
  PRIVATE = "private",
}

export enum STATUS_FRIEND {
  PENDING = "PENDING",
  ACCEPTED = "ACCEPTED",
  BLOCKED = "BLOCKED",
}

export enum TOKEN_TYPE {
  ACCESS_TOKEN = "access_token",
  REFRESH_TOKEN = "refresh_token",
  EMAIL_VERIFY_TOKEN = "email_verify_token",
  FORGOT_PASSWORD_TOKEN = "forgot_password_token",
}

export enum MESSAGE_TYPE {
  TEXT = "text",
  IMAGE = "image",
  FILE = "file",
  SYSTEM = "system",
}

export enum MESSAGE_STATUS {
  SENT = "sent",
  DELIVERED = "delivered",
  SEEN = "seen",
}

export enum NOTIFICATION_TYPE {
  MESSAGE = "message",
  LIKE = "like",
  FAVORITE = "favorite",
}
