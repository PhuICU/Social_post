import { POST_REQUEST } from "~/models/requests/Post.request";
import databaseService from "./database.service";
import { POSTS_SCHEMA } from "~/models/schemas/Posts.schema";
import { ObjectId } from "mongodb";

class PostService {
  public async createPost(payload: POST_REQUEST, user_id: string) {
    return await databaseService.posts.insertOne(
      new POSTS_SCHEMA({
        ...payload,
        poster_id: new ObjectId(user_id),
      })
    );
  }
  public async getPosts() {
    return await databaseService.posts.find().toArray();
  }
  public async getPostById(id: string) {
    return await databaseService.posts.findOne({ _id: new ObjectId(id) });
  }
  public async updatePost(id: string, payload: POST_REQUEST) {
    return await databaseService.posts.updateOne(
      { _id: new ObjectId(id) },
      { $set: payload }
    );
  }
  public async deletePost(id: string) {
    return await databaseService.posts.deleteOne({ _id: new ObjectId(id) });
  }
  public async likePost(id: string, user_id: string) {
    return await databaseService.posts.updateOne(
      { _id: new ObjectId(id) },
      { $inc: { like: 1 } }
    );
  }
  public async unLikePost(id: string, user_id: string) {
    return await databaseService.posts.updateOne(
      { _id: new ObjectId(id) },
      { $inc: { like: -1 } }
    );
  }
  public async viewPost(id: string) {
    return await databaseService.posts.updateOne(
      { _id: new ObjectId(id) },
      { $inc: { view: 1 } }
    );
  }
  async getAllFavoritePostsByUserId(ids: string[]) {
    return await databaseService.posts
      .find({ _id: { $in: ids.map((id) => new ObjectId(id)) } })
      .toArray();
  }
  async getPostsByUserId(user_id: string) {
    return await databaseService.posts
      .find({ poster_id: new ObjectId(user_id) })
      .toArray();
  }

  async getPostByImageId(image_id: string) {
    return await databaseService.posts.findOne(
      { images: { $elemMatch: { _id: image_id } } },
      {
        projection: { images: { $elemMatch: { _id: image_id } } },
      }
    );
  }

  public async update(id: string, payload: POST_REQUEST) {
    return await databaseService.posts.findOneAndUpdate(
      { _id: new ObjectId(id) },
      {
        $set: {
          ...payload,
          posted_by: new ObjectId(payload.posted_by),
          // convert string to date
          updated_at: new Date(),
        },
      }
    );
  }
  public async deleteOne(id: string) {
    return await databaseService.posts.findOneAndDelete({
      _id: new ObjectId(id),
    });
  }
  public async deleteMany(ids: string[]) {
    return await databaseService.posts.deleteMany({
      _id: {
        $in: ids.map((id) => new ObjectId(id)),
      },
    });
  }
  public async deleteAll() {
    return await databaseService.posts.deleteMany({});
  }
}

const newService = new PostService();
export default newService;
