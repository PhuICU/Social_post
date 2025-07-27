import { VIDEO_SCHEMA } from "~/models/schemas/Video.schema";
import databaseService from "./database.service";
import { ObjectId } from "mongodb";

class VideoService {
  async create(payload: { public_id: string; video_url: string }) {
    return await databaseService.videos.insertOne(new VIDEO_SCHEMA(payload));
  }

  async getbyId(id: string) {
    return await databaseService.videos.findOne({ _id: new ObjectId(id) });
  }
  async deleteVideoByPublicId(public_id: string) {
    return await databaseService.videos.findOneAndDelete({
      public_id: public_id,
    });
  }
}

const videoService = new VideoService();
export default videoService;
