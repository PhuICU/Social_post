import { IMAGE_SCHEMA } from "~/models/schemas/Image.schema";
import { ObjectId } from "mongodb";
import databaseService from "./database.service";

class ImageService {
  async create(payload: { public_id: string; url: string; poster_id: string }) {
    return await databaseService.images.insertOne(
      new IMAGE_SCHEMA({
        ...payload,
        poster_id: new ObjectId(payload.poster_id),
      })
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
  async getImageByIdUser(poster_id: string) {
    return await databaseService.images
      .find({
        poster_id: new ObjectId(poster_id),
      })
      .toArray();
  }
}

const imageService = new ImageService();
export default imageService;
