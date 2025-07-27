import { COMMENT_SCHEMA } from "~/models/schemas/Comments.schema";
import { ObjectId } from "mongodb";
import { COMMENT_REQUEST } from "~/models/requests/Comment.request";
import databaseService from "./database.service";

class CommentsService {
  public async createComment(payload: COMMENT_REQUEST) {
    return await databaseService.comments.insertOne(
      new COMMENT_SCHEMA({
        ...payload,
        post_id: new ObjectId(payload.post_id),
        user_id: new ObjectId(payload.user_id),
      })
    );
  }
  public async getAllComments() {
    return await databaseService.comments.find().toArray();
  }
  public async getCommentById(id: string) {
    return await databaseService.comments.findOne({ _id: new ObjectId(id) });
  }
  public async getCommentsByPostId(post_id: string) {
    return await databaseService.comments
      .aggregate([
        {
          $match: {
            post_id: new ObjectId(post_id),
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "user_id",
            foreignField: "_id",
            as: "user",
          },
        },
        {
          $project: {
            _id: 1,
            content: 1,
            created_at: 1,
            updated_at: 1,
            user: {
              $arrayElemAt: ["$user", 0],
            },
          },
        },
      ])
      .toArray();
  }
  public async updateComment(
    user_id: string,
    id: string,
    payload: COMMENT_REQUEST
  ) {
    const comments = await databaseService.comments.findOne({
      _id: new ObjectId(id),
    });
    if (!comments) return null;
    if (comments.user_id.toString() !== user_id) return null;
    return await databaseService.comments.updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          ...payload,
          post_id: new ObjectId(payload.post_id),
          user_id: new ObjectId(payload.user_id),
          updated_at: new Date(),
        },
      }
    );
  }
  public async deleteComment(id: string, user_id: string) {
    return await databaseService.comments.findOneAndDelete({
      _id: new ObjectId(id),
      user_id: new ObjectId(user_id),
    });
  }
  public async deleteComments(ids: string[]) {
    return await databaseService.comments.deleteMany({
      _id: { $in: ids.map((id) => new ObjectId(id)) },
    });
  }
  public async deleteAllCommentsOfPostId(post_id: string) {
    return await databaseService.comments.deleteMany({
      post_id: new ObjectId(post_id),
    });
  }
  async adminDeleteComment(id: string) {
    return await databaseService.comments.findOneAndDelete({
      _id: new ObjectId(id),
    });
  }
  async adminUpdateComment(id: string, payload: COMMENT_REQUEST) {
    return await databaseService.comments.findOneAndUpdate(
      { _id: new ObjectId(id) },
      {
        $set: {
          ...payload,
          post_id: new ObjectId(payload.post_id),
          user_id: new ObjectId(payload.user_id),
          updated_at: new Date(),
        },
      },
      { returnDocument: "after" }
    );
  }
}
const commentsService = new CommentsService();
export default commentsService;
