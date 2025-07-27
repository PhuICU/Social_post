import { ObjectId } from "mongodb";
import { ROLE_TYPE, USER_VERIFY_STATUS } from "~/enum/utiils.enum";
import { ImageTypes, VideoTypes } from "~/type";

interface UserType {
  _id?: ObjectId;
  full_name: string;
  phone?: string;
  email: string;
  password: string;
  role?: ROLE_TYPE;
  verify?: USER_VERIFY_STATUS;
  avatar?: ImageTypes;
  // Optional fields
  address?: string;
  forgot_password_token?: string;
  email_verify_token?: string;
  locked_posts?: ObjectId[];
  created_at?: Date;
  updated_at?: Date;
}

export class USER_SCHEMA {
  _id: ObjectId;
  full_name: string;
  phone: string;
  email: string;
  password: string;
  role: ROLE_TYPE;
  verify: USER_VERIFY_STATUS;
  avatar: ImageTypes;
  address: string;
  forgot_password_token: string;
  email_verify_token: string;
  locked_posts: ObjectId[];
  created_at: Date;
  updated_at: Date;

  constructor(user: UserType) {
    this._id = user._id || new ObjectId();
    this.full_name = user.full_name;
    this.phone = user.phone || "";
    this.email = user.email;
    this.password = user.password;
    this.role = user.role || ROLE_TYPE.USER;
    this.verify = user.verify || USER_VERIFY_STATUS.PENDING;
    this.avatar = user.avatar || {
      _id: "",
      public_id: "",
      url: "",
      created_at: "",
      updated_at: "",
    };
    this.address = user.address || "";
    this.forgot_password_token = user.forgot_password_token || "";
    this.email_verify_token = user.email_verify_token || "";
    this.locked_posts = user.locked_posts || [];
    this.created_at = user.created_at || new Date();
    this.updated_at = user.updated_at || new Date();
  }
}
