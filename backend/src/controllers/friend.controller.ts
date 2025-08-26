import { Request, Response } from "express";
import { ParamsDictionary } from "express-serve-static-core";
import { responseError, responseSuccess } from "../utils/response";
import friendService from "../services/friend.service";
import { FRIEND_REQUEST } from "~/models/requests/Friend.request";
import { TokenPayload } from "~/type";
import notificationController from "../controllers/notification.controller";
// Gửi lời mời kết bạn
const createFriendRequest = async (
  req: Request<ParamsDictionary, any, FRIEND_REQUEST>,
  res: Response
) => {
  const { user_id } = req.decoded_access_token as TokenPayload;
  const { friend_id } = req.body;

  const friend = await friendService.createFriendRequest({
    user_id,
    friend_id,
  });

  const notificationReq = {
    body: {
      userId: friend_id.toString(),
      type: "friend_request",
      content: "Bạn có một lời mời kết bạn mới",
      fromUser: user_id,
    },
  } as Request;

  await notificationController.createNotification(notificationReq, res);

  return responseSuccess(res, {
    message: "Friend request created successfully",
    data: friend,
  });
};

// Chấp nhận lời mời kết bạn
const acceptFriendRequest = async (
  req: Request<ParamsDictionary, any, any>,
  res: Response
) => {
  const { user_id } = req.decoded_access_token as TokenPayload;
  const { friend_id } = req.body;

  const friend = await friendService.acceptFriendRequest({
    user_id,
    friend_id,
  });

  return responseSuccess(res, {
    message: "Friend request accepted",
    data: friend,
  });
};

// Chặn user
const blockUser = async (
  req: Request<ParamsDictionary, any, FRIEND_REQUEST>,
  res: Response
) => {
  const { user_id } = req.decoded_access_token as TokenPayload;
  const { friend_id } = req.body;

  const friend = await friendService.blockUser({
    user_id,
    friend_id,
  });

  return responseSuccess(res, {
    message: "User blocked successfully",
    data: friend,
  });
};

// Hủy lời mời kết bạn hoặc xóa bạn
const removeFriendRequest = async (
  req: Request<ParamsDictionary, any, FRIEND_REQUEST>,
  res: Response
) => {
  const { user_id } = req.decoded_access_token as TokenPayload;
  const { friend_id } = req.body;

  const friend = await friendService.removeFriendRequest({
    user_id,
    friend_id,
  });

  return responseSuccess(res, {
    message: "Friend request removed successfully",
    data: friend,
  });
};

// Danh sách lời mời đến (người nhận)
const getFriendRequests = async (
  req: Request<ParamsDictionary, any, any>,
  res: Response
) => {
  const { user_id } = req.decoded_access_token as TokenPayload;

  const friendRequests = await friendService.getFriendRequestsOfUser(user_id);

  const senderIds = friendRequests.map((request) => request.user_id);

  return responseSuccess(res, {
    message: "Lấy danh sách lời mời kết bạn thành công",
    data: senderIds,
  });
};

// Danh sách lời mời đã gửi (người gửi)
const getSentFriendRequests = async (
  req: Request<ParamsDictionary, any, any>,
  res: Response
) => {
  const { user_id } = req.decoded_access_token as TokenPayload;

  const friendRequests = await friendService.getSentFriendRequests(user_id);
  const receiverIds = friendRequests.map((request) => request.friend_id);

  return responseSuccess(res, {
    message: "Lấy danh sách lời mời kết bạn đã gửi thành công",
    data: receiverIds,
  });
};

// Danh sách bạn bè (accepted)
const getFriends = async (
  req: Request<ParamsDictionary, any, any>,
  res: Response
) => {
  const { user_id } = req.params;

  const friends = await friendService.getFriends(user_id);

  // Lấy ra id của người bạn (vì record có thể lưu user_id hoặc friend_id)
  const friendIds = friends.map((f) =>
    f.user_id.toString() === user_id.toString() ? f.friend_id : f.user_id
  );

  return responseSuccess(res, {
    message: "Lấy danh sách bạn bè thành công",
    data: friendIds,
  });
};

const friendController = {
  createFriendRequest,
  acceptFriendRequest,
  blockUser,
  removeFriendRequest,
  getFriendRequests,
  getSentFriendRequests,
  getFriends,
};

export default friendController;
