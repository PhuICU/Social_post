import instance from "./apiContanst";
interface ImageData {
  _id: string;
  url: string;
  public_id: string;
}
type Post = {
  content?: string;
  images?: ImageData[];
  videos?: string[];
};

export const getAllPosts = async () => {
  try {
    const response = await instance.get("/post");
    return response.data;
  } catch (error) {
    console.error("Error fetching photo news:", error);
    throw error;
  }
};

export const createPost = async (data: Post) => {
  try {
    const response = await instance.post("/post/create", data);
    return response.data;
  } catch (error) {
    console.error("Error creating photo news:", error);
    throw error;
  }
};

export const getPostByUserId = async (user_id: string) => {
  try {
    const response = await instance.get(`/post/user/${user_id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching posts by user ID:", error);
    throw error;
  }
};

export const getPostById = async (post_id: string) => {
  try {
    const response = await instance.get(`/post/${post_id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching post by ID:", error);
    throw error;
  }
};

export const getPostByImageId = async (image_id: string) => {
  try {
    const response = await instance.get(`/post/image/${image_id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching post by image ID:", error);
    throw error;
  }
};
