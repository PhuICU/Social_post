import { Request, Response } from "express";
import { ParamsDictionary } from "express-serve-static-core";
import { ROLE_TYPE } from "~/enum/utiils.enum";
import { COMMENT_REQUEST } from "~/models/requests/Comment.request";
import commentsService from "~/services/comment.service";
import { TokenPayload } from "~/type";
import { responseError, responseSuccess } from "~/utils/response";
import postService from "~/services/post.service";
const createComment = async (
  req: Request<ParamsDictionary, any, COMMENT_REQUEST, any>,
  res: Response
) => {
  const payload = req.body;
  const { user_id } = req.decoded_access_token as TokenPayload;
  const result = await commentsService.createComment(payload);
  const post = await postService.getPostById(payload.post_id);
  if (!post) {
    return responseSuccess(res, {
      message: "Không tìm thấy tin đăng",
      data: null,
    });
  }
  await postService.update(payload.post_id, { comment: post.comment + 1 });
  return responseSuccess(res, {
    message: "Tạo comment thành công",
    data: result,
  });
};
const getComments = async (
  req: Request<ParamsDictionary, any, any, any>,
  res: Response
) => {
  const result = await commentsService.getAllComments();
  return responseSuccess(res, {
    message: "Lấy danh sách bình luận thành công",
    data: result,
  });
};
const getCommentsOfPostId = async (
  req: Request<ParamsDictionary, any, any, any>,
  res: Response
) => {
  const { postId } = req.params;

  const result = await commentsService.getCommentsByPostId(postId);
  return responseSuccess(res, {
    message: "Lấy danh sách bình luận thành công",
    data: result,
  });
};
const updateComment = async (
  req: Request<ParamsDictionary, any, COMMENT_REQUEST, any>,
  res: Response
) => {
  const { commentId } = req.params;
  const { user_id, role } = req.decoded_access_token as TokenPayload;
  const payload = req.body;
  if (role === ROLE_TYPE.ADMIN) {
    const result = await commentsService.adminUpdateComment(commentId, payload);
    return responseSuccess(res, {
      message: "Admin cập nhật comment thành công",
      data: result,
    });
  }
  const result = await commentsService.updateComment(
    user_id,
    commentId,
    payload
  );
  if (!result) {
    return responseError(res, {
      message: "Cập nhật comment thất bại hoặc bạn không có quyền cập nhật",
      code: 400, // Bad request
    });
  }
  return responseSuccess(res, {
    message: "Cập nhật comment thành công",
    data: result,
  });
};
const deleteComment = async (
  req: Request<ParamsDictionary, any, any, any>,
  res: Response
) => {
  const { id } = req.params;
  const { user_id, role } = req.decoded_access_token as TokenPayload;
  if (role === ROLE_TYPE.ADMIN) {
    const result = await commentsService.adminDeleteComment(id);
    return responseSuccess(res, {
      message: "Admin xóa comment thành công",
      data: result,
    });
  }
  const result = await commentsService.deleteComment(id, user_id);
  const post = await postService.getPostById(id);
  if (!post) {
    return responseSuccess(res, {
      message: "Không tìm thấy tin đăng",
      data: null,
    });
  }
  await postService.update(id, { comment: post.comment - 1 });
  if (!result) {
    return responseError(res, {
      message: "Comment không tồn tại hoặc bạn không có quyền xóa",
      code: 400, // Bad request
    });
  }
  return responseSuccess(res, {
    message: "Xóa comment thành công",
    data: result,
  });
};
const deleteAllCommentsOfPostID = async (
  req: Request<ParamsDictionary, any, any, any>,
  res: Response
) => {
  const { postId } = req.params;
  const result = await commentsService.deleteAllCommentsOfPostId(postId);
  return responseSuccess(res, {
    message: "Xóa tất cả comment của bài viết thành công",
    data: result,
  });
};
const commentsControllers = {
  createComment,
  getComments,
  getCommentsOfPostId,
  updateComment,
  deleteComment,
  deleteAllCommentsOfPostID,
};
export default commentsControllers;
