import { ROLE_TYPE } from "~/enum/utiils.enum";

export interface ResgisterRequest {
  role: ROLE_TYPE;
  full_name: string;
  email: string;
  password: string;
  confirm_password?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}
