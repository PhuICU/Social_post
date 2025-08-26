import { Response, Request } from "express";
import { ParamsDictionary } from "express-serve-static-core";
import { FAVORITE_REQUEST } from "~/models/requests/Favorite.request";
import favoriteService from "~/services/favorite.service";
import newService from "~/services/post.service";
import { TokenPayload } from "~/type";
import { responseError, responseSuccess } from "~/utils/response";
import notificationController from "../controllers/notification.controller";
import userService from "~/services/user.service";
const createFavorite = async (
  req: Request<ParamsDictionary, any, FAVORITE_REQUEST, any>,
  res: Response
) => {
  const { post_id } = req.body;
  const { user_id } = req.decoded_access_token as TokenPayload;
  const result = await favoriteService.createFavorite({ post_id, user_id });
  const post = await newService.getPostById(post_id);
  if (!post) {
    return responseSuccess(res, {
      message: "Không tìm thấy tin đăng",
      data: null,
    });
  }

  // Create a mock request object for notification creation
  const notificationReq = {
    body: {
      userId: post?.poster_id?.toString(),
      type: "like",
      content: "Bài viết của bạn được ai đó thích 👍",
      fromUser: user_id,
    },
  } as Request;

  await notificationController.createNotification(notificationReq, res);

  return responseSuccess(res, {
    message: "Favorite created successfully",
    data: result,
  });
};
const unFavorite = async (
  req: Request<ParamsDictionary, any, FAVORITE_REQUEST, any>,
  res: Response
) => {
  const { id } = req.params;
  const { user_id } = req.decoded_access_token as TokenPayload;
  const result = await favoriteService.deleteFavoriteByPostIdAndUserId({
    post_id: id,
    user_id,
  });
  if (!result) {
    return responseSuccess(res, {
      message: "Không tìm thấy yêu thích để xóa",
      data: result,
    });
  }

  return responseSuccess(res, {
    message: "Bỏ yêu thích thành công",
    data: result,
  });
};

const getFavoritesByUserIdAndPostId = async (
  req: Request<ParamsDictionary, any, any, any>,
  res: Response
) => {
  const { post_id } = req.query;
  const { user_id } = req.decoded_access_token as TokenPayload;
  if (!user_id || !post_id) {
    return responseSuccess(res, {
      message: "Thiếu thông tin user_id hoặc post_id",
      data: [],
    });
  }

  const result = await favoriteService.getFavoritesByUserIdAndPostId(
    user_id as string,
    post_id as string
  );

  return responseSuccess(res, {
    message: "Truy xuất lượt thích thành công",
    data: result,
  });
};
const getAllFavoritesOfUser = async (
  req: Request<ParamsDictionary, any, any, any>,
  res: Response
) => {
  const { user_id } = req.decoded_access_token as TokenPayload;
  const result = await favoriteService.getAllFavoritesOfUser(user_id);
  const post_ids = result.map((item) => item.post_id);
  return responseSuccess(res, {
    message: "Truy xuất tất cả lượt thích của user thành công",
    data: {
      post_ids,
    },
  });
};
const getAllFavoritePostsByUserId = async (
  req: Request<ParamsDictionary, any, any, any>,
  res: Response
) => {
  const { user_id } = req.decoded_access_token as TokenPayload;
  const result = await favoriteService.getAllFavoritesOfUser(user_id);
  const post_ids = result.map((item) => item.post_id);
  const posts = await newService.getAllFavoritePostsByUserId(
    post_ids.map((item) => item.toString())
  );

  return responseSuccess(res, {
    message: "Truy xuất tất cả bài viết đã thích của user thành công",
    data: posts || [],
  });
};
const favoritesControllers = {
  createFavorite,
  unFavorite,
  getFavoritesByUserIdAndPostId,
  getAllFavoritesOfUser,
  getAllFavoritePostsByUserId,
};
export default favoritesControllers;
