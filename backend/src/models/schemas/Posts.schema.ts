import { ObjectId } from "mongodb";
import { ImageTypes, VideoTypes } from "~/type";
import { SCOPE_TYPE } from "~/enum/utiils.enum";

interface PostType {
  _id?: ObjectId;
  content?: string;
  created_date?: Date;
  poster_id: ObjectId;
  view?: number;
  like?: number;
  comment?: number;
  scope: SCOPE_TYPE;
  updated_date?: Date;
  images?: ImageTypes[];
  videos?: VideoTypes[];
}
export class POSTS_SCHEMA {
  _id: ObjectId;
  content: string;
  created_date: Date;
  poster_id: ObjectId;
  view: number;
  like: number;
  comment: number;
  scope: SCOPE_TYPE;
  updated_date: Date;
  images: ImageTypes[];
  videos: VideoTypes[];
  constructor(news: PostType) {
    this._id = news._id || new ObjectId();
    this.content = news.content || "";
    this.created_date = news.created_date || new Date();
    this.poster_id = news.poster_id;
    this.view = news.view || 0;
    this.like = news.like || 0;
    this.comment = news.comment || 0;
    this.scope = news.scope || SCOPE_TYPE.PUBLIC;
    this.updated_date = news.updated_date || new Date();
    this.images = news.images || [];
    this.videos = news.videos || [];
  }
}
