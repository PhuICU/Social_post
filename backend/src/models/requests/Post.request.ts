import { ImageTypes } from "~/type";

export type POST_REQUEST = {
  content?: string;
  images?: ImageTypes[];
  videos?: any[];
  posted_by?: string;
  like?: number;
  comment?: number;
};

export type POST_QUERY = {
  user_id: string;
  content?: string;
  images?: ImageTypes[];
  videos?: any[];
};
