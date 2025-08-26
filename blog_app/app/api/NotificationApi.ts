import instance from "./apiContanst";

export const getNotifications = async (userId: string) => {
  try {
    const response = await instance.get(`/notification/${userId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching notifications:", error);
    throw error;
  }
};

export const createNotification = async (notificationData: any) => {
  try {
    const response = await instance.post("/notification", notificationData);
    return response.data;
  } catch (error) {
    console.error("Error creating notification:", error);
    throw error;
  }
};

export const markAsRead = async (notificationId: string) => {
  try {
    const response = await instance.patch(
      `/notification/${notificationId}/read`
    );
    return response.data;
  } catch (error) {
    console.error("Error marking notification as read:", error);
    throw error;
  }
};

export const markAllAsRead = async (userId: string) => {
  try {
    const response = await instance.patch(`/notification/read-all/${userId}`);
    return response.data;
  } catch (error) {
    console.error("Error marking all notifications as read:", error);
    throw error;
  }
};

export const getUnreadCount = async (userId: string) => {
  try {
    const response = await instance.get(`/notification/${userId}/count`);
    return response.data;
  } catch (error) {
    console.error("Error fetching unread count:", error);
    throw error;
  }
};
