import { REPORT_TYPE } from "../../enum/utiils.enum";
export type REPORT_REQUEST = {
  reported_id: string;
  report_posts_id: string;
  report_type: REPORT_TYPE;
  content: string[];
};
