import { ObjectId } from "mongodb";
import { STATUS_FRIEND } from "~/enum/utiils.enum";

interface FriendType {
  _id?: ObjectId;
  user_id: ObjectId;
  friend_id: ObjectId;
  status: STATUS_FRIEND;
  created_at: Date;
  updated_at: Date;
}

export class FRIEND_SCHEMA {
  _id: ObjectId;
  user_id: ObjectId;
  friend_id: ObjectId;
  status: STATUS_FRIEND;
  created_at: Date;
  updated_at: Date;

  constructor(friend: FriendType) {
    this._id = friend._id || new ObjectId();
    this.user_id = friend.user_id;
    this.friend_id = friend.friend_id;
    this.status = friend.status;
    this.created_at = friend.created_at;
    this.updated_at = friend.updated_at;
  }
}
