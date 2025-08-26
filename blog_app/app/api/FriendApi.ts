import instance from "./apiContanst";

export const createFriendRequest = async (
  user_id: string,
  friend_id: string
) => {
  try {
    const response = await instance.post("/friend/request", {
      user_id,
      friend_id,
    });
    return response.data;
  } catch (error) {
    console.error("Error creating friend request:", error);
    throw error;
  }
};

export const getFriendRequests = async (user_id: string) => {
  try {
    const response = await instance.get(`/friend/requests/${user_id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching friend requests:", error);
    throw error;
  }
};

export const getSentFriendRequests = async (user_id: string) => {
  try {
    const response = await instance.get(`/friend/sent-requests/${user_id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching sent friend requests:", error);
    throw error;
  }
};

export const removeFriendRequest = async (friend_id: string) => {
  try {
    const response = await instance.delete(`/friend/remove`, {
      data: { friend_id },
    });
    return response.data;
  } catch (error) {
    console.error("Error removing friend request:", error);
    throw error;
  }
};

export const acceptFriendRequest = async (friend_id: string) => {
  try {
    const response = await instance.post(`/friend/accept`, {
      friend_id,
    });
    return response.data;
  } catch (error) {
    console.error("Error accepting friend request:", error);
    throw error;
  }
};

export const getFriends = async (user_id: string) => {
  try {
    const response = await instance.get(`/friend/friends/${user_id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching friends:", error);
    throw error;
  }
};

export const blockUser = async (friend_id: string) => {
  try {
    const response = await instance.post(`/friend/block`, {
      friend_id,
    });
    return response.data;
  } catch (error) {
    console.error("Error blocking user:", error);
    throw error;
  }
};
