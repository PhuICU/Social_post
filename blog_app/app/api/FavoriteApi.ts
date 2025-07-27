import instance from "./apiContanst";

export type Favorite = {
  user_id?: string;
  post_id: string;
};

export const createFavorite = async (data: Favorite) => {
  try {
    const response = await instance.post("/favorite/create", data);
    return response.data;
  } catch (error) {
    console.error("Error creating favorite:", error);
    throw error;
  }
};

export const unFavorite = async (id: string) => {
  try {
    const response = await instance.delete(`/favorite/delete/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error un-favorite:", error);
    throw error;
  }
};

export const getFavoritesByUserIdAndPostId = async (
  user_id: string,
  post_id: string
) => {
  try {
    const response = await instance.get(`/favorite/`);
    return response.data;
  } catch (error) {
    console.error("Error getting favorites by user id and post id:", error);
    throw error;
  }
};

export const getAllFavoritesOfUser = async () => {
  try {
    const response = await instance.get(`/favorite/user`);
    return response.data;
  } catch (error) {
    console.error("Error getting all favorites of user:", error);
    throw error;
  }
};

export const getAllFavoritePostsByUserId = async (user_id: string) => {
  try {
    const response = await instance.get(`/favorite/all-posts`);
    return response.data;
  } catch (error) {
    console.error("Error getting all favorite posts by user id:", error);
    throw error;
  }
};
