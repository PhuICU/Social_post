import express from "express";
import notificationController from "~/controllers/notification.controller";

const router = express.Router();

// 📌 Lấy tất cả thông báo của user
router.get("/:userId", notificationController.getNotifications);

// 📌 Tạo mới thông báo (ví dụ: khi có like, favorite, message...)
router.post("/", notificationController.createNotification);

// 📌 Đánh dấu 1 thông báo đã đọc
router.patch("/:id/read", notificationController.markAsRead);

// 📌 Đánh dấu tất cả thông báo đã đọc
router.patch("/read-all/:userId", notificationController.markAllAsRead);

router.get("/:userId/count", notificationController.getUnreadCount);

export default router;
