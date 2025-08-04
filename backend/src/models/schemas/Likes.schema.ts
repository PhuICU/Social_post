import { ObjectId } from "mongodb";

interface LikeType {
  _id?: ObjectId;
  user_id: ObjectId;
  post_id: ObjectId;
  created_date?: Date;
  updated_date?: Date;
}

export class LIKE_SCHEMA {
  _id: ObjectId;
  user_id: ObjectId;
  post_id: ObjectId;
  created_date: Date;
  updated_date: Date;

  constructor(like: LikeType) {
    this._id = like._id || new ObjectId();
    this.user_id = like.user_id;
    this.post_id = like.post_id;
    this.created_date = like.created_date || new Date();
    this.updated_date = like.updated_date || new Date();
  }
}
