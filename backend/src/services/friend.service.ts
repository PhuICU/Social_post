import databaseService from "./database.service";
import { FRIEND_SCHEMA } from "~/models/schemas/Friends.schema";
import { ObjectId } from "mongodb";
import { STATUS_FRIEND } from "~/enum/utiils.enum";
import { FRIEND_REQUEST } from "~/models/requests/Friend.request";

class FriendService {
  async createFriendRequest(payload: FRIEND_REQUEST) {
    let userId = new ObjectId(payload.user_id);
    let friendId = new ObjectId(payload.friend_id);

    const friend = new FRIEND_SCHEMA({
      _id: new ObjectId(),
      user_id: userId,
      friend_id: friendId,
      status: STATUS_FRIEND.PENDING,
      created_at: new Date(),
      updated_at: new Date(),
    });

    await databaseService.friends.insertOne(friend);
    return friend;
  }

  async acceptFriendRequest(payload: FRIEND_REQUEST) {
    await databaseService.friends.updateOne(
      {
        $or: [
          {
            user_id: new ObjectId(payload.user_id),
            friend_id: new ObjectId(payload.friend_id),
          },
          {
            user_id: new ObjectId(payload.friend_id),
            friend_id: new ObjectId(payload.user_id),
          },
        ],
      },
      { $set: { status: STATUS_FRIEND.ACCEPTED, updated_at: new Date() } }
    );
  }

  async blockUser(payload: FRIEND_REQUEST) {
    await databaseService.friends.updateOne(
      {
        $or: [
          {
            user_id: new ObjectId(payload.user_id),
            friend_id: new ObjectId(payload.friend_id),
          },
          {
            user_id: new ObjectId(payload.friend_id),
            friend_id: new ObjectId(payload.user_id),
          },
        ],
      },
      { $set: { status: STATUS_FRIEND.BLOCKED, updated_at: new Date() } }
    );
  }

  async removeFriendRequest(payload: FRIEND_REQUEST) {
    await databaseService.friends.findOneAndDelete({
      $or: [
        {
          user_id: new ObjectId(payload.user_id),
          friend_id: new ObjectId(payload.friend_id),
        },
        {
          user_id: new ObjectId(payload.friend_id),
          friend_id: new ObjectId(payload.user_id),
        },
      ],
    });
  }

  async getFriendRequestsOfUser(user_id: string) {
    return await databaseService.friends
      .find({
        friend_id: new ObjectId(user_id),
        status: STATUS_FRIEND.PENDING,
      })
      .toArray();
  }

  async getSentFriendRequests(user_id: string) {
    return await databaseService.friends
      .find({
        user_id: new ObjectId(user_id),
        status: STATUS_FRIEND.PENDING,
      })
      .toArray();
  }

  async getFriends(userId: string) {
    const userObjectId = new ObjectId(userId);
    return await databaseService.friends
      .find({
        status: STATUS_FRIEND.ACCEPTED,
        $or: [{ user_id: userObjectId }, { friend_id: userObjectId }],
      })
      .toArray();
  }
}

export default new FriendService();
