// controllers/notification.controller.ts
import { Request, Response } from "express";
import { notificationService } from "~/services/notification.service";

// 📌 Lấy tất cả thông báo của user
const getNotifications = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const notifications = await notificationService.getNotifications(userId);
    const unreadCount = await notificationService.getUnreadCount(userId);

    req.app.get("io").to(userId).emit("notification", { count: unreadCount });
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ message: "Error fetching notifications", error });
  }
};

// 📌 Tạo thông báo (ví dụ khi user gửi tin nhắn, like, favorite)
const createNotification = async (req: Request, res: Response) => {
  try {
    const { userId, type, content, fromUser } = req.body;
    const notification = await notificationService.createNotification({
      userId,
      type,
      content,
      fromUser,
    });
    res.status(201).json(notification);
  } catch (error) {
    res.status(500).json({ message: "Error creating notification", error });
  }
};

// 📌 Đánh dấu 1 thông báo đã đọc
const markAsRead = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;

    await notificationService.markAsRead(id, userId);
    res.json({ message: "Marked as read" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error marking notification as read", error });
  }
};

// 📌 Đánh dấu tất cả thông báo đã đọc
const markAllAsRead = async (req: Request, res: Response) => {
  try {
    console.log(`Marking all notifications as read for user:`);
    const { userId } = req.params;

    await notificationService.markAllAsRead(userId);
    // cập nhật lại unreadcount
    const unreadCount = await notificationService.getUnreadCount(userId);
    req.app
      .get("io")
      .to(userId)
      .emit("notification_read_all", { count: unreadCount });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ message: "Error marking all as read", error });
  }
};

const getUnreadCount = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const count = await notificationService.getUnreadCount(userId);
    res.json({ count });
  } catch (err) {
    res.status(500).json({ message: "Error getting unread count" });
  }
};

const notificationController = {
  getNotifications,
  createNotification,
  markAsRead,
  markAllAsRead,
  getUnreadCount,
};

export default notificationController;
