import { Router } from "express";
import commentsControllers from "~/controllers/comment.controller";
import commentsMiddlewares from "~/middlewares/comment.middleware";
import commonMiddlewares from "~/middlewares/common.middleware";
import { wrapRequestHandler } from "~/utils/requestHandler";

const commentsRoutes = Router();

/**
 * description: Create a new comment
 * method: POST
 * path: /comments/create
 * body: COMMENT_REQUEST_BODY
 * headers: {
 * Authorization: {
 * description: Bearer access_token
 * }
 */
commentsRoutes.post(
  "/create",
  commentsMiddlewares.createCommentValidator,
  commonMiddlewares.accessTokenValidator,
  wrapRequestHandler(commentsControllers.createComment)
);
/**
 * description: Get all comments
 * method: GET
 * path: /comments
 *
 */
commentsRoutes.get(
  "/all",
  commonMiddlewares.accessTokenValidator,
  wrapRequestHandler(commentsControllers.getComments)
);

/**
 * description: Get a comment by post id
 * method: GET
 * path: /comments/:postId
 * params: {
 * postId: {
 * description: Post id
 * type: string
 * }
 */
commentsRoutes.get(
  "/:postId",
  wrapRequestHandler(commentsControllers.getCommentsOfPostId)
);

/**
 * description: Update a comment
 * method: PUT
 * path: /comments/update/:commentId
 * params: {
 * commentId: {
 * description: Comment id
 * type: string
 * }
 * body: COMMENT_REQUEST_BODY
 */
commentsRoutes.put(
  "/update/:commentId",
  commentsMiddlewares.createCommentValidator,
  commonMiddlewares.accessTokenValidator,
  wrapRequestHandler(commentsControllers.updateComment)
);
/**
 * description: Delete a comment
 * method: DELETE
 * path: /comments/delete/:id
 * params: id (comment id)
 * headers: {
 * Authorization: {
 * description: Bearer access_token
 * }
 */
commentsRoutes.delete(
  "/delete/:id",
  commonMiddlewares.accessTokenValidator,
  wrapRequestHandler(commentsControllers.deleteComment)
);
export default commentsRoutes;
