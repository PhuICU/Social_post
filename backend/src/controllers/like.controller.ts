import { Response, Request } from "express";
import { ParamsDictionary } from "express-serve-static-core";
import { LIKE_REQUEST } from "~/models/requests/Like.request";
import likeService from "~/services/like.service";
import postService from "~/services/post.service";
import { TokenPayload } from "~/type";
import { responseError, responseSuccess } from "~/utils/response";

const createLike = async (
  req: Request<ParamsDictionary, any, LIKE_REQUEST, any>,
  res: Response
) => {
  const { post_id } = req.body;
  const { user_id } = req.decoded_access_token as TokenPayload;

  // Check if user already liked this post
  const existingLike = await likeService.getLikeByUserIdAndPostId(
    user_id,
    post_id
  );
  if (existingLike) {
    return responseError(res, {
      message: "Bạn đã thích bài viết này rồi",
      status: 400,
    });
  }

  const result = await likeService.createLike({ post_id, user_id });
  const post = await postService.getPostById(post_id);

  if (!post) {
    return responseError(res, {
      message: "Không tìm thấy bài viết",
      status: 404,
    });
  }

  await postService.update(post_id, { like: post.like + 1 });

  return responseSuccess(res, {
    message: "Thích bài viết thành công",
    data: result,
  });
};

const unlike = async (
  req: Request<ParamsDictionary, any, LIKE_REQUEST, any>,
  res: Response
) => {
  const { id } = req.params;
  const { user_id } = req.decoded_access_token as TokenPayload;

  const result = await likeService.deleteLikeByPostIdAndUserId({
    post_id: id,
    user_id,
  });

  if (!result) {
    return responseError(res, {
      message: "Không tìm thấy lượt thích để xóa",
      status: 404,
    });
  }

  const post = await postService.getPostById(id);
  if (!post) {
    return responseError(res, {
      message: "Không tìm thấy bài viết",
      status: 404,
    });
  }

  await postService.update(id, { like: Math.max(0, post.like - 1) });

  return responseSuccess(res, {
    message: "Bỏ thích bài viết thành công",
    data: result,
  });
};

const getLikeByUserIdAndPostId = async (
  req: Request<ParamsDictionary, any, any, any>,
  res: Response
) => {
  const { post_id } = req.query;
  const { user_id } = req.decoded_access_token as TokenPayload;

  if (!user_id || !post_id) {
    return responseError(res, {
      message: "Thiếu thông tin user_id hoặc post_id",
      status: 400,
    });
  }

  const result = await likeService.getLikeByUserIdAndPostId(
    user_id as string,
    post_id as string
  );

  return responseSuccess(res, {
    message: "Truy xuất trạng thái thích thành công",
    data: result,
  });
};

const getAllLikesOfUser = async (
  req: Request<ParamsDictionary, any, any, any>,
  res: Response
) => {
  const { user_id } = req.decoded_access_token as TokenPayload;
  const result = await likeService.getAllLikesOfUser(user_id);
  const post_ids = result.map((item) => item.post_id);

  return responseSuccess(res, {
    message: "Truy xuất tất cả lượt thích của user thành công",
    data: {
      post_ids,
    },
  });
};

const getAllLikedPostsByUserId = async (
  req: Request<ParamsDictionary, any, any, any>,
  res: Response
) => {
  const { user_id } = req.decoded_access_token as TokenPayload;
  const result = await likeService.getAllLikesOfUser(user_id);
  const post_ids = result.map((item) => item.post_id);
  const posts = await postService.getAllFavoritePostsByUserId(
    post_ids.map((item) => item.toString())
  );

  return responseSuccess(res, {
    message: "Truy xuất tất cả bài viết đã thích của user thành công",
    data: posts || [],
  });
};

const getLikeCountByPostId = async (
  req: Request<ParamsDictionary, any, any, any>,
  res: Response
) => {
  const { post_id } = req.params;

  if (!post_id) {
    return responseError(res, {
      message: "Thiếu thông tin post_id",
      status: 400,
    });
  }

  const count = await likeService.getLikeCountByPostId(post_id);

  return responseSuccess(res, {
    message: "Truy xuất số lượt thích thành công",
    data: { count },
  });
};

const likeControllers = {
  createLike,
  unlike,
  getLikeByUserIdAndPostId,
  getAllLikesOfUser,
  getAllLikedPostsByUserId,
  getLikeCountByPostId,
};

export default likeControllers;
