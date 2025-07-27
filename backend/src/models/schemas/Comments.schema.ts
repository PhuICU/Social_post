import { ObjectId } from "mongodb";

interface CommentType {
  _id?: ObjectId;
  content: string;
  created_date?: Date;
  user_id: ObjectId;
  post_id: ObjectId;
  updated_date?: Date;
}
export class COMMENT_SCHEMA {
  _id: ObjectId;
  content: string;
  created_date: Date;
  user_id: ObjectId;
  post_id: ObjectId;
  updated_date: Date;
  constructor(comment: CommentType) {
    this._id = comment._id || new ObjectId();
    this.content = comment.content;
    this.created_date = comment.created_date || new Date();
    this.user_id = comment.user_id;
    this.post_id = comment.post_id;
    this.updated_date = comment.updated_date || new Date();
  }
}
