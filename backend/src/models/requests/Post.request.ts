import { ImageTypes } from "~/type";
import { SCOPE_TYPE } from "~/enum/utiils.enum";

export type POST_REQUEST = {
  content?: string;
  images?: ImageTypes[];
  videos?: any[];
  posted_by?: string;
  like?: number;

  comment?: number;
  scope?: SCOPE_TYPE;
};

export type POST_QUERY = {
  user_id: string;
  content?: string;
  images?: ImageTypes[];
  videos?: any[];
  scope?: SCOPE_TYPE;
};
