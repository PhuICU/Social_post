import { LIKE_SCHEMA } from "~/models/schemas/Likes.schema";
import { ObjectId } from "mongodb";
import { LIKE_REQUEST } from "~/models/requests/Like.request";
import databaseService from "./database.service";

class LikeService {
  public async createLike(payload: LIKE_REQUEST) {
    return await databaseService.likes.insertOne(
      new LIKE_SCHEMA({
        ...payload,
        post_id: new ObjectId(payload.post_id),
        user_id: new ObjectId(payload.user_id),
      })
    );
  }

  public async getLikes() {
    return await databaseService.likes.find().toArray();
  }

  public async getLikeById(id: string) {
    return await databaseService.likes.findOne({ _id: new ObjectId(id) });
  }

  public async getLikesByUserId(user_id: string) {
    return await databaseService.likes
      .find({ user_id: new ObjectId(user_id) })
      .toArray();
  }

  public async deleteLike(id: string) {
    return await databaseService.likes.deleteOne({ _id: new ObjectId(id) });
  }

  async deleteLikeByPostIdAndUserId(payload: LIKE_REQUEST) {
    return await databaseService.likes.findOneAndDelete({
      post_id: new ObjectId(payload.post_id),
      user_id: new ObjectId(payload.user_id),
    });
  }

  async getLikeByUserIdAndPostId(user_id: string, post_id: string) {
    return await databaseService.likes.findOne({
      user_id: new ObjectId(user_id),
      post_id: new ObjectId(post_id),
    });
  }

  public async getAllLikesOfUser(user_id: string) {
    return await databaseService.likes
      .find({ user_id: new ObjectId(user_id) })
      .toArray();
  }

  public async getLikeCountByPostId(post_id: string) {
    return await databaseService.likes.countDocuments({
      post_id: new ObjectId(post_id),
    });
  }
}

const likeService = new LikeService();
export default likeService;
