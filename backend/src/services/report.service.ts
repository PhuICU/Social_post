import { REPORT_REQUEST } from "~/models/requests/Report.request";
import { ObjectId } from "mongodb";
import databaseService from "./database.service";
import { REPORT_SCHEMA } from "~/models/schemas/Reports.schema";
import { REPORT_STATUS, REPORT_TYPE } from "~/enum/utiils.enum";

class ReportService {
  public async createReport(data: REPORT_REQUEST & { reporter_id: string }) {
    return await databaseService.reports.insertOne(
      new REPORT_SCHEMA({
        ...data,
        reporter_id: new ObjectId(data.reporter_id),
        reported_id: new ObjectId(data.reported_id),
        report_news_id: new ObjectId(data.report_news_id),
      })
    );
  }
  public async updateReportStatus(id: string, status: REPORT_STATUS) {
    if (!Object.values(REPORT_STATUS).includes(status)) {
      throw new Error("Invalid status");
    }
    if (status === REPORT_STATUS.REMOVE_POST) {
      const report = await databaseService.reports.findOne({
        _id: new ObjectId(id),
      });
      if (!report) {
        throw new Error("Report not found");
      }
      if (report.report_type === REPORT_TYPE.POST) {
        await databaseService.news.findOneAndDelete({
          _id: report.report_news_id,
        });
        return await databaseService.reports.findOneAndUpdate(
          { _id: new ObjectId(id) },
          { $set: { status, updated_date: new Date() } },
          { returnDocument: "after" }
        );
      }
    }
    return await databaseService.reports.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: { status, updated_date: new Date() } },
      { returnDocument: "after" }
    );
  }
  public async getReportById(id: string) {
    return await databaseService.reports.findOne({ _id: new ObjectId(id) });
  }
  public async getReportsByReportedId(reported_id: string) {
    return await databaseService.reports
      .find({ reported_id: new ObjectId(reported_id) })
      .toArray();
  }
  public async getReportsByReporterId(reporter_id: string) {
    return await databaseService.reports
      .find({ reporter_id: new ObjectId(reporter_id) })
      .toArray();
  }
  public async getReportsByReportItemId(report_item_id: string) {
    return await databaseService.reports
      .find({ report_item_id: new ObjectId(report_item_id) })
      .toArray();
  }
  public async getReportsByStatus(status: REPORT_STATUS) {
    return await databaseService.reports.find({ status }).toArray();
  }
  public async getReportsByStatusAndReportedId(
    status: REPORT_STATUS,
    reported_id: string
  ) {
    return await databaseService.reports
      .find({ status, reported_id: new ObjectId(reported_id) })
      .toArray();
  }
  public async getReportsByStatusAndReporterId(
    status: REPORT_STATUS,
    reporter_id: string
  ) {
    return await databaseService.reports
      .find({ status, reporter_id: new ObjectId(reporter_id) })
      .toArray();
  }
  public async getReportsByStatusAndReportItemId(
    status: REPORT_STATUS,
    report_item_id: string
  ) {
    return await databaseService.reports
      .find({ status, report_item_id: new ObjectId(report_item_id) })
      .toArray();
  }
  public async getReportsByStatusAndReportedIdAndReporterId(
    status: REPORT_STATUS,
    reported_id: string,
    reporter_id: string
  ) {
    return await databaseService.reports
      .find({
        status,
        reported_id: new ObjectId(reported_id),
        reporter_id: new ObjectId(reporter_id),
      })
      .toArray();
  }
  public async deleteReportById(id: string) {
    return await databaseService.reports.deleteOne({ _id: new ObjectId(id) });
  }
  public async getReports() {
    return await databaseService.reports
      .find()
      .sort({
        created_at: -1,
      })
      .toArray();
  }
  public async getReportsByType(type: REPORT_TYPE) {
    return await databaseService.reports.find({ report_type: type }).toArray();
  }
}
const reportsService = new ReportService();
export default reportsService;
