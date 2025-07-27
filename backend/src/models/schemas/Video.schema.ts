import { ObjectId } from "mongodb";

interface VideoType {
  _id?: ObjectId;
  public_id: string;
  video_url: string;
  created_date?: Date;
  updated_date?: Date;
}

export class VIDEO_SCHEMA {
  _id: ObjectId;
  public_id: string;
  video_url: string;
  created_date: Date;
  updated_date: Date;
  constructor(video: VideoType) {
    this._id = video._id || new ObjectId();
    this.public_id = video.public_id;
    this.video_url = video.video_url;
    this.created_date = video.created_date || new Date();
    this.updated_date = video.updated_date || new Date();
  }
}
