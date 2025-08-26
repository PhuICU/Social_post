// services/notification.service.ts
import { ObjectId } from "mongodb";
import databaseService from "./database.service";
import { NOTIFICATION_SCHEMA } from "~/models/schemas/Notification.schema";
import { Server } from "socket.io";

class NotificationService {
  private io: Server;

  constructor(io: Server) {
    this.io = io;
  }

  // 📌 Tạo thông báo mới
  async createNotification({
    userId,
    type,
    content,
    fromUser,
  }: {
    userId: string;
    type: "message" | "like" | "favorite";
    content: string;
    fromUser: string;
  }) {
    const notification = new NOTIFICATION_SCHEMA({
      user_id: new ObjectId(userId),
      type,
      content,
      from_user: new ObjectId(fromUser),
      created_at: new Date(),
      read: false,
    });

    await databaseService.notifications.insertOne(notification);

    // Gửi realtime tới client
    this.io.to(userId).emit("notification", notification);

    return notification;
  }

  // 📌 Lấy danh sách thông báo
  async getNotifications(userId: string) {
    return databaseService.notifications
      .find({ user_id: new ObjectId(userId) })
      .sort({ created_at: -1 })
      .toArray();
  }

  // 📌 Đánh dấu 1 thông báo đã đọc
  async markAsRead(notificationId: string, userId: string) {
    await databaseService.notifications.updateOne(
      { _id: new ObjectId(notificationId), user_id: new ObjectId(userId) },
      { $set: { read: true } }
    );

    this.io.to(userId).emit("notification_read", notificationId);
  }

  // 📌 Đánh dấu tất cả đã đọc
  async markAllAsRead(userId: string) {
    await databaseService.notifications.updateMany(
      { user_id: new ObjectId(userId), read: false },
      { $set: { read: true } }
    );
  }

  async getUnreadCount(userId: string) {
    return await databaseService.notifications.countDocuments({
      user_id: new ObjectId(userId),
      read: false,
    });
  }
}

let notificationService: NotificationService;

export function initNotificationService(io: Server) {
  notificationService = new NotificationService(io);
  return notificationService;
}

export { notificationService };
