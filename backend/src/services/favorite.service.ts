import { FAVORITE_SCHEMA } from "~/models/schemas/Favorites.schema";
import { ObjectId } from "mongodb";
import { FAVORITE_REQUEST } from "~/models/requests/Favorite.request";
import databaseService from "./database.service";

class FavoriteService {
  public async createFavorite(payload: FAVORITE_REQUEST) {
    return await databaseService.favorites.insertOne(
      new FAVORITE_SCHEMA({
        ...payload,
        post_id: new ObjectId(payload.post_id),
        user_id: new ObjectId(payload.user_id),
      })
    );
  }
  public async getFavorites() {
    return await databaseService.favorites.find().toArray();
  }
  public async getFavoriteById(id: string) {
    return await databaseService.favorites.findOne({ _id: new ObjectId(id) });
  }
  public async getFavoritesByUserId(user_id: string) {
    return await databaseService.favorites
      .find({ user_id: new ObjectId(user_id) })
      .toArray();
  }
  public async deleteFavorite(id: string) {
    return await databaseService.favorites.deleteOne({ _id: new ObjectId(id) });
  }
  async deleteFavoriteByPostIdAndUserId(payload: FAVORITE_REQUEST) {
    return await databaseService.favorites.findOneAndDelete({
      post_id: new ObjectId(payload.post_id),
      user_id: new ObjectId(payload.user_id),
    });
  }
  async getFavoritesByUserIdAndPostId(user_id: string, post_id: string) {
    return await databaseService.favorites.findOne({
      user_id: new ObjectId(user_id),
      post_id: new ObjectId(post_id),
    });
  }
  public async getAllFavoritesOfUser(user_id: string) {
    return await databaseService.favorites
      .find({ user_id: new ObjectId(user_id) })
      .toArray();
  }
}

const favoriteService = new FavoriteService();
export default favoriteService;
