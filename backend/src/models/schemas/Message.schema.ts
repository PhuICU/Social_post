import { ObjectId } from "mongodb";

export interface MessageTypes {
  _id?: ObjectId;
  chat_id: ObjectId;
  user_id: ObjectId;
  text: string;
  created_date?: Date;
  updated_date?: Date;
}

export class MESSAGE_SCHEMA {
  _id: ObjectId;
  chat_id: ObjectId;
  user_id: ObjectId;
  text: string;
  created_date: Date;
  updated_date: Date;
  constructor(message: MessageTypes) {
    this._id = message._id || new ObjectId();
    this.chat_id = message.chat_id;
    this.user_id = message.user_id;
    this.text = message.text;
    this.created_date = message.created_date || new Date();
    this.updated_date = message.updated_date || new Date();
  }
}
