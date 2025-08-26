// models/schemas/Notification.schema.ts
import { ObjectId } from "mongodb";

interface NotificationTypes {
  _id?: ObjectId;
  user_id: ObjectId; // người nhận thông báo
  type: "message" | "like" | "favorite";
  content: string;
  from_user: ObjectId; // người tạo thông báo
  created_at: Date;
  read: boolean;
}

export class NOTIFICATION_SCHEMA {
  _id: ObjectId;
  user_id: ObjectId;
  type: "message" | "like" | "favorite";
  content: string;
  from_user: ObjectId;
  created_at: Date;
  read: boolean;

  constructor(notification: NotificationTypes) {
    this._id = notification._id || new ObjectId();
    this.user_id = notification.user_id;
    this.type = notification.type;
    this.content = notification.content;
    this.from_user = notification.from_user;
    this.created_at = notification.created_at || new Date();
    this.read = notification.read || false;
  }
}
