import { Router } from "express";
import likeControllers from "~/controllers/like.controller";
import commonMiddlewares from "~/middlewares/common.middleware";
import likeMiddlewares from "~/middlewares/like.middleware";
import { wrapRequestHandler } from "~/utils/requestHandler";

const likeRoutes = Router();

/**
 * description: Create a like
 * method: POST
 * path: /likes/create
 * body: { post_id: string }
 */
likeRoutes.post(
  "/create",
  commonMiddlewares.accessTokenValidator,
  likeMiddlewares.createLikeValidator,
  wrapRequestHandler(likeControllers.createLike)
);

/**
 * description: Get like status by user id and post id
 * method: GET
 * path: /likes/status
 * query: { post_id: string }
 */
likeRoutes.get(
  "/status",
  commonMiddlewares.accessTokenValidator,
  wrapRequestHandler(likeControllers.getLikeByUserIdAndPostId)
);

/**
 * description: Get all liked posts of a user
 * method: GET
 * path: /likes/posts
 */
likeRoutes.get(
  "/posts",
  commonMiddlewares.accessTokenValidator,
  wrapRequestHandler(likeControllers.getAllLikedPostsByUserId)
);

/**
 * description: Get like count for a post
 * method: GET
 * path: /likes/count/:post_id
 */
likeRoutes.get(
  "/count/:post_id",
  wrapRequestHandler(likeControllers.getLikeCountByPostId)
);

/**
 * description: Delete a like (unlike)
 * method: DELETE
 * path: /likes/delete/:id
 */
likeRoutes.delete(
  "/delete/:id",
  commonMiddlewares.accessTokenValidator,
  wrapRequestHandler(likeControllers.unlike)
);

/**
 * description: Get all likes of a user
 * method: GET
 * path: /likes/user
 */
likeRoutes.get(
  "/user",
  commonMiddlewares.accessTokenValidator,
  wrapRequestHandler(likeControllers.getAllLikesOfUser)
);

export default likeRoutes;
