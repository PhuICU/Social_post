import { ObjectId } from "mongodb";

interface FavoriteType {
  _id?: ObjectId;
  user_id: ObjectId;
  post_id: ObjectId;
  created_date?: Date;
  updated_date?: Date;
}
export class FAVORITE_SCHEMA {
  _id: ObjectId;
  user_id: ObjectId;
  post_id: ObjectId;
  created_date: Date;
  updated_date: Date;
  constructor(favorite: FavoriteType) {
    this._id = favorite._id || new ObjectId();
    this.user_id = favorite.user_id;
    this.post_id = favorite.post_id;
    this.created_date = favorite.created_date || new Date();
    this.updated_date = favorite.updated_date || new Date();
  }
}
