import { ObjectId } from "mongodb";

interface ImageTypes {
  _id?: ObjectId;
  public_id: string;
  url: string;
  poster_id: ObjectId;
  created_date?: Date;
  updated_date?: Date;
}

export class IMAGE_SCHEMA {
  _id: ObjectId;
  public_id: string;
  url: string;
  poster_id: ObjectId;
  created_date: Date;
  updated_date: Date;
  constructor(image: ImageTypes) {
    this._id = image._id || new ObjectId();
    this.public_id = image.public_id;
    this.url = image.url;
    this.poster_id = image.poster_id || new ObjectId();
    this.created_date = image.created_date || new Date();
    this.updated_date = image.updated_date || new Date();
  }
}
