import { ObjectId } from "mongodb";
import { REPORT_TYPE, REPORT_STATUS } from "~/enum/utiils.enum";

interface ReportType {
  _id?: ObjectId;
  reporter_id: ObjectId;
  reported_id: ObjectId;
  report_news_id: ObjectId;
  report_type: REPORT_TYPE;
  status?: REPORT_STATUS;
  content: string[];
  created_date?: Date;
  updated_date?: Date;
}
export class REPORT_SCHEMA {
  _id: ObjectId;
  reporter_id: ObjectId;
  reported_id: ObjectId;
  report_news_id: ObjectId;
  report_type: REPORT_TYPE;
  status: REPORT_STATUS;
  content: string[];
  created_date: Date;
  updated_date: Date;
  constructor(report: ReportType) {
    this._id = report._id || new ObjectId();
    this.reporter_id = report.reporter_id;
    this.reported_id = report.reported_id;
    this.report_news_id = report.report_news_id;
    this.report_type = report.report_type;
    this.status = report.status || REPORT_STATUS.PENDING;
    this.content = report.content;
    this.created_date = report.created_date || new Date();
    this.updated_date = report.updated_date || new Date();
  }
}
