import { ObjectId } from "mongodb";

interface ChatTypes {
  _id?: ObjectId;
  members: ObjectId[]; // Danh sách thành viên
  created_at: Date;
  updated_at: Date;
}

export class CHAT_SCHEMA {
  _id: ObjectId;
  members: ObjectId[];
  created_at: Date;
  updated_at: Date;

  constructor(chat: ChatTypes) {
    this._id = chat._id || new ObjectId();
    this.members = chat.members;
    this.created_at = chat.created_at;
    this.updated_at = chat.updated_at;
  }
}
