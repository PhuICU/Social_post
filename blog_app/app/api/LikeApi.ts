import instance from "./apiContanst";

export type Like = {
  post_id: string;
};

export const createLike = async (data: Like) => {
  try {
    const response = await instance.post("/like/create", data);
    return response.data;
  } catch (error) {
    console.error("Error creating like:", error);
    throw error;
  }
};

export const unlike = async (post_id: string) => {
  try {
    const response = await instance.delete(`/like/delete/${post_id}`);
    return response.data;
  } catch (error) {
    console.error("Error unliking:", error);
    throw error;
  }
};

export const getAllLikedPostsByUserId = async () => {
  try {
    const response = await instance.get(`/like/posts`);
    return response.data;
  } catch (error) {
    console.error("Error getting liked posts by user id:", error);
    throw error;
  }
};

export const getAllLikesOfUser = async () => {
  try {
    const response = await instance.get(`/like/user`);
    return response.data;
  } catch (error) {
    console.error("Error getting all likes of user:", error);
    throw error;
  }
};

export const getLikeCountByPostId = async (post_id: string) => {
  try {
    const response = await instance.get(`/like/count/${post_id}`);
    return response.data;
  } catch (error) {
    console.error("Error getting like count by post id:", error);
    throw error;
  }
};
