import { Request, Response } from "express";
import { ParamsDictionary } from "express-serve-static-core";
import { InsertOneResult, ObjectId } from "mongodb";
import { POST_REQUEST } from "~/models/requests/Post.request";
import { POSTS_SCHEMA } from "~/models/schemas/Posts.schema";
import postService from "~/services/post.service";
import userService from "~/services/user.service";
import { TokenPayload } from "~/type";
import { responseSuccess } from "~/utils/response";
const createPost = async (
  req: Request<ParamsDictionary, any, POST_REQUEST, any>,
  res: Response
) => {
  const { user_id } = req.decoded_access_token as TokenPayload;
  const user = await userService.findUserById(user_id);

  if (!user) {
    return responseSuccess(res, {
      message: "Người dùng không tồn tại",
      data: null,
    });
  }

  // admin có thể tạo tin
  if (user.role === "admin") {
    const payload: POST_REQUEST = {
      ...req.body,
    };
    const createNewResult = await postService.createPost(payload, user_id);
    return responseSuccess(res, {
      message: "ADMIN tạo bài đăng thành công",
      data: createNewResult,
    });
  }
  // user thường có thể tạo tin
  else {
    const payload: POST_REQUEST = {
      ...req.body,
      posted_by: user_id,
    };
    const createNewResult = await postService.createPost(payload, user_id);

    return responseSuccess(res, {
      message: "Tạo bài đăng thành công",
      data: createNewResult,
    });
  }
};

const getPosts = async (req: Request, res: Response) => {
  const result = await postService.getPosts();
  return responseSuccess(res, {
    message: "Lấy danh sách tin thành công",
    data: result,
  });
};
const getPostById = async (
  req: Request<ParamsDictionary, any, any, any>,
  res: Response
) => {
  const { id } = req.params;
  const photoNew = await postService.getPostById(id);
  if (!photoNew) {
    return responseSuccess(res, {
      message: "Tin không tồn tại",
      data: null,
    });
  }
  return responseSuccess(res, {
    message: "Lấy tin theo id thành công",
    data: photoNew,
  });
};
const updatePost = async (
  req: Request<ParamsDictionary, any, POST_REQUEST, any>,
  res: Response
) => {
  const { id } = req.params;
  const payload = req.body;

  const result = await postService.update(id, payload);
  return responseSuccess(res, {
    message: "Cập nhật tin thành công",
    data: result,
  });
};
const deletePost = async (
  req: Request<ParamsDictionary, any, any, any>,
  res: Response
) => {
  const { id } = req.params;
  const result = await postService.deleteOne(id);
  if (!result) {
    return responseSuccess(res, {
      message: "Tin không tồn tại",
      data: null,
    });
  }
  return responseSuccess(res, {
    message: "Xóa tin thành công",
    data: result,
  });
};
const deleteManyPosts = async (
  req: Request<ParamsDictionary, any, any, any>,
  res: Response
) => {
  const { ids } = req.body;
  const result = await postService.deleteMany(ids);
  return responseSuccess(res, {
    message: "Xóa nhiều tin thành công",
    data: result,
  });
};
const getPostByUserId = async (
  req: Request<ParamsDictionary, any, any, any>,
  res: Response
) => {
  const { user_id } = req.params;
  const result = await postService.getPostsByUserId(user_id);
  return responseSuccess(res, {
    message: "Lấy danh sách tin theo user_id thành công",
    data: result,
  });
};

const getPostByImageId = async (
  req: Request<ParamsDictionary, any, any, any>,
  res: Response
) => {
  const { image_id } = req.params;
  const find_post = await postService.getPostByImageId(image_id);
  if (!find_post) {
    return responseSuccess(res, {
      message: "Không tìm thấy bài đăng với ảnh này",
      data: null,
    });
  }
  console.log("post", find_post);

  const post = await postService.getPostById(find_post._id.toString());

  return responseSuccess(res, {
    message: "Lấy bài đăng theo ảnh thành công",
    data: post,
  });
};

const deleteAllPosts = async (
  req: Request<ParamsDictionary, any, any, any>,
  res: Response
) => {
  const result = await postService.deleteAll();
  return responseSuccess(res, {
    message: "Xóa tất cả tin thành công",
    data: result,
  });
};
const getAllPosts = async (
  req: Request<ParamsDictionary, any, any, any>,
  res: Response
) => {
  const result = await postService.getPosts();
  return responseSuccess(res, {
    message: "Lấy danh sách tin thành công",
    data: result,
  });
};

const likePost = async (
  req: Request<ParamsDictionary, any, any, any>,
  res: Response
) => {
  const { id } = req.params;
  const { user_id } = req.decoded_access_token as TokenPayload;
  const post = await postService.getPostById(id);

  if (!post) {
    return responseSuccess(res, {
      message: "Tin không tồn tại",
      data: null,
    });
  }

  const updatedPost = await postService.update(id, {
    like: post.like + 1,
  });
  return responseSuccess(res, {
    message: "Thích tin thành công",
    data: updatedPost,
  });
};

const postsControllers = {
  createPost,
  getPosts,
  getAllPosts,
  getPostById,
  deleteAllPosts,
  deletePost,
  deleteManyPosts,
  getPostByUserId,
  updatePost,
  likePost,
  getPostByImageId,
};
export default postsControllers;
