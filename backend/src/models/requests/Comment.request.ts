import { ImageTypes, VideoTypes } from "../../type.d";

export type COMMENT_REQUEST = {
  content: string;
  image?: ImageTypes;
  video?: VideoTypes;
  post_id: string;
  user_id: string;
};
