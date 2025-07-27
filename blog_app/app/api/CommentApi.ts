import instance from "./apiContanst";

type Comment = {
  content: string;
  user_id: string;
  post_id: string;
};

export const createComment = async (data: Comment) => {
  try {
    const response = await instance.post("/comment/create", data);
    return response.data;
  } catch (error) {
    console.error("Error creating comment:", error);
    throw error;
  }
};

export const getComments = async () => {
  try {
    const response = await instance.get("/comment/all");
    return response.data;
  } catch (error) {
    console.error("Error getting comments:", error);
    throw error;
  }
};

export const getCommentsOfPostId = async (post_id: string) => {
  try {
    const response = await instance.get(`/comment/${post_id}`);
    return response.data;
  } catch (error) {
    console.error("Error getting comments of post id:", error);
    throw error;
  }
};

export const updateComment = async (id: string, data: Comment) => {
  try {
    const response = await instance.put(`/comment/update/${id}`, data);
    return response.data;
  } catch (error) {
    console.error("Error updating comment:", error);
    throw error;
  }
};

export const deleteComment = async (id: string) => {
  try {
    const response = await instance.delete(`/comment/delete/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting comment:", error);
    throw error;
  }
};

export const deleteAllCommentsOfPostID = async (post_id: string) => {
  try {
    const response = await instance.delete(`/comment/delete-all/${post_id}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting all comments of post id:", error);
    throw error;
  }
};

// createComment,
// getComments,
// getCommentsOfPostId,
// updateComment,
// deleteComment,
// deleteAllCommentsOfPostID,
