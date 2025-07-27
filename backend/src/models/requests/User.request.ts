import { ImageTypes } from "~/type";

export interface USER_REQUEST {
  username: string;
  password: string;
  email: string;
  avatar?: ImageTypes;
  phone: string;
  address: string;
}
