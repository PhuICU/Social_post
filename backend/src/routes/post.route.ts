import { Router } from "express";
import postsControllers from "~/controllers/post.controller";
import commonMiddlewares from "~/middlewares/common.middleware";
import postsMiddlewares from "~/middlewares/post.middleware";
import { wrapRequestHandler } from "~/utils/requestHandler";

const postRoutes = Router();

/**
 * description: Create a new real estate news
 * method: POST
 * path: /real-estate-news/create
 * body: REAL_ESTATE_NEW_REQUEST_BODY
 * headers: {
 * Authorization: {
 * description: Bearer access_token
 * }
 * }
 */
postRoutes.post(
  "/create",
  commonMiddlewares.accessTokenValidator,
  postsMiddlewares.createValidator,
  wrapRequestHandler(postsControllers.createPost)
);
/**
 * description: Get all real estate news
 * method: GET
 * path: /real-estate-news
 * query: REAL_ESTATE_NEW_QUERY
 * headers: {
 * Authorization: {
 * description: Bearer access_token
 * }
 * }
 */
postRoutes.get("/", wrapRequestHandler(postsControllers.getAllPosts));
/**
 * description: Get all real estate news by status
 * method: GET
 * path: /real-estate-news/status/:status
 */
// postRoutes.get(
//   "/status/:status",
//   commonMiddlewares.accessTokenValidator,
//   wrapRequestHandler(postsControllers.)
// );
/**
 * description: Get all post for admin
 * method: GET
 * path: /real-estate-news/admin/all
 */
postRoutes.get(
  "/admin/all",
  commonMiddlewares.accessTokenValidator,
  commonMiddlewares.isAdmin,
  wrapRequestHandler(postsControllers.getAllPosts)
);

/**
 * description: Get real estate news by id
 * method: GET
 * path: /real-estate-news/:id
 * headers: {
 * Authorization: {
 * description: Bearer access_token
 * }
 * }
 */
postRoutes.get("/:id", wrapRequestHandler(postsControllers.getPostById));
/**
 * description: Get all post by user id
 * method: GET
 * path: /real-estate-news/user/:user_id
 * headers: {
 * Authorization: {
 *  description: Bearer access_token
 * }
 *  }
 */
postRoutes.get(
  "/user/:user_id",
  commonMiddlewares.accessTokenValidator,
  wrapRequestHandler(postsControllers.getPostByUserId)
);
/**
 * description: Update a real estate news
 * method: PUT
 * path: /real-estate-news/:id
 * body: REAL_ESTATE_NEW_REQUEST_BODY
 * headers: {
 * Authorization: {
 * description: Bearer access_token
 * }
 * }
 */
/**
 * description: Approve a real estate news by id
 * method: PUT
 * path: /real-estate-news/update-status/:id
 * headers: {
 * Authorization: {
 * description: Bearer access_token
 * }
 * }
 * body: {
 * status: string}
 */

// postRoutes.put(
//   "/:id",
//   commonMiddlewares.accessTokenValidator,
//   postsMiddlewares.createValidator,
//   wrapRequestHandler(postsControllers.updatePhotoNew)
// );

/**
 * description: Delete all real estate news
 * method: DELETE
 * path: /real-estate-news/delete-all
 * headers: {
 * Authorization: {
 * description: Bearer access_token
 * }
 * }
 */
postRoutes.delete(
  "/delete-all",
  commonMiddlewares.accessTokenValidator,
  wrapRequestHandler(postsControllers.deleteAllPosts)
);
/**
 * description: Delete many real estate news
 * method: DELETE
 * path: /real-estate-news/delete-many
 * body: {
 * ids: [string]
 * }
 * headers: {
 * Authorization: {
 * description: Bearer access_token
 * }
 * }
 */
postRoutes.delete(
  "/delete-many",
  commonMiddlewares.accessTokenValidator,
  wrapRequestHandler(postsControllers.deleteManyPosts)
);
/**
 * description: Delete a real estate news
 * method: DELETE
 * path: /real-estate-news/:id
 * headers: {
 * Authorization: {
 * description: Bearer access_token
 * }
 */
postRoutes.delete(
  "/:id",
  commonMiddlewares.accessTokenValidator,
  wrapRequestHandler(postsControllers.deletePost)
);

postRoutes.get(
  "/image/:image_id",

  wrapRequestHandler(postsControllers.getPostByImageId)
);

export default postRoutes;
