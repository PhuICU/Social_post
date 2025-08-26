import { ObjectId } from "mongodb";

interface MessageTypes {
  _id?: ObjectId;
  chat_id: ObjectId;
  user_id: ObjectId;
  text: string;
  created_at: Date;
  updated_at: Date;
}

export class MESSAGE_SCHEMA {
  _id: ObjectId;
  chat_id: ObjectId;
  user_id: ObjectId;
  text: string;
  created_at: Date;
  updated_at: Date;

  constructor(message: MessageTypes) {
    this._id = message._id || new ObjectId();
    this.chat_id = message.chat_id;
    this.user_id = message.user_id;
    this.text = message.text;
    this.created_at = message.created_at || new Date();
    this.updated_at = message.updated_at || new Date();
  }
}
