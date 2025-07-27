import { ObjectId } from "mongodb";

interface RefreshTokenTypes {
  _id?: ObjectId;
  user_id: ObjectId;
  token: string;
  created_date?: Date;
  updated_date?: Date;
}

export class REFRESH_TOKEN_SCHEMA {
  _id: ObjectId;
  user_id: ObjectId;
  token: string;
  created_date: Date;
  updated_date: Date;
  constructor(refreshToken: RefreshTokenTypes) {
    this._id = refreshToken._id || new ObjectId();
    this.user_id = refreshToken.user_id;
    this.token = refreshToken.token;
    this.created_date = refreshToken.created_date || new Date();
    this.updated_date = refreshToken.updated_date || new Date();
  }
}
