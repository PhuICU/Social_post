import instance from "./apiContanst";

type Post = {
  content?: string;
  images?: string[];
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
