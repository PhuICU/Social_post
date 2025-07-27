import { Router } from "express";
import favoritesControllers from "~/controllers/favorite.controller";
import commonMiddlewares from "~/middlewares/common.middleware";
import favoritesMiddlewares from "~/middlewares/favorite.middleware";
import { wrapRequestHandler } from "~/utils/requestHandler";

const favoritesRoutes = Router();

/**
 * description: Create a favorite
 * method: POST
 * path: /favorites/create
 * body: { post_id: string, user_id: string }
 */
favoritesRoutes.post(
  "/create",
  commonMiddlewares.accessTokenValidator,
  favoritesMiddlewares.createFavoriteValidator,
  wrapRequestHandler(favoritesControllers.createFavorite)
);

/**
 * description: Get favorites by user id and post id
 * method: GET
 * path: /favorites/
 * query: { user_id: string, post_id: string }
 * headers: {
 * Authorization: {
 * description: Bearer access_token
 */
favoritesRoutes.get(
  "/",
  commonMiddlewares.accessTokenValidator,
  wrapRequestHandler(favoritesControllers.getFavoritesByUserIdAndPostId)
);
/**
 * description: Get all favorites posts of a user
 * method: GET
 * path: /favorites/all-posts
 */
favoritesRoutes.get(
  "/all-posts",
  commonMiddlewares.accessTokenValidator,
  wrapRequestHandler(favoritesControllers.getAllFavoritePostsByUserId)
);
/**
 * description: Delete a favorite
 * method: DELETE
 * path: /favorites/delete
 * body: { post_id: string, user_id: string }
 *
 */
favoritesRoutes.delete(
  "/delete/:id",
  commonMiddlewares.accessTokenValidator,
  wrapRequestHandler(favoritesControllers.unFavorite)
);
/**
 * description: Get all favorites of a user
 * method: GET
 * path: /favorites/all
 * headers: {
 * Authorization: {
 * description: Bearer access_token
 * }
 */

favoritesRoutes.get(
  "/user",
  commonMiddlewares.accessTokenValidator,
  wrapRequestHandler(favoritesControllers.getAllFavoritesOfUser)
);

export default favoritesRoutes;
