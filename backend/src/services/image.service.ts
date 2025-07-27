import { IMAGE_SCHEMA } from "~/models/schemas/Image.schema";
import { ObjectId } from "mongodb";
import databaseService from "./database.service";

class ImageService {
  async create(payload: { public_id: string; url: string }) {
    return await databaseService.images.insertOne(
      new IMAGE_SCHEMA({ ...payload })
    );
  }

  async getbyId(id: string) {
    return await databaseService.images.findOne({ _id: new ObjectId(id) });
  }
  async deleteImageByPublicId(public_id: string) {
    return await databaseService.images.findOneAndDelete({
      public_id: public_id,
    });
  }
}

const imageService = new ImageService();
export default imageService;
