import { ObjectId } from "mongodb";

interface ChatTypes {
  _id?: ObjectId;
  member: Array<ObjectId>;
  created_date: Date;
  updated_date: Date;
}

export class CHAT_SCHEMA {
  _id: ObjectId;
  member: Array<ObjectId>;
  created_date: Date;
  updated_date: Date;
  constructor(chat: ChatTypes) {
    this._id = chat._id || new ObjectId();
    this.member = chat.member;
    this.created_date = chat.created_date;
    this.updated_date = chat.updated_date;
  }
}
