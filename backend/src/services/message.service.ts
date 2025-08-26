import { MESSAGE_REQUEST } from "~/models/requests/Message.request";
import { ObjectId } from "mongodb";
import databaseService from "./database.service";
import { MESSAGE_SCHEMA } from "~/models/schemas/Message.schema";
import { Server } from "socket.io";
import { notificationService } from "./notification.service";
class MessagesService {
  private io: Server;

  constructor(io: Server) {
    this.io = io;
  }

  /**
   * Lấy tất cả tin nhắn trong 1 chat
   */
  async getMessages(chatId: string) {
    if (!ObjectId.isValid(chatId)) {
      throw new Error("Invalid chatId: must be a 24-character hex string.");
    }

    return await databaseService.messages
      .find({ chat_id: new ObjectId(chatId) })
      .toArray();
  }

  /**
   * Tạo tin nhắn mới và emit qua socket
   */
  async createMessage(message: MESSAGE_REQUEST) {
    const newMessage = new MESSAGE_SCHEMA({
      chat_id: new ObjectId(message.chatId),
      user_id: new ObjectId(message.senderId),
      text: message.text,
      created_at: new Date(),
      updated_at: new Date(),
    });

    await databaseService.messages.insertOne(newMessage);

    // Emit cho tất cả client trong room chatId
    this.io.to(message.chatId).emit("newMessage", {
      _id: newMessage._id,
      chat_id: newMessage.chat_id,
      user_id: newMessage.user_id,
      text: newMessage.text,
      created_at: newMessage.created_at,
    });

    return newMessage;
  }
}

let messagesService: MessagesService;

export function initMessagesService(io: Server) {
  messagesService = new MessagesService(io);
  return messagesService;
}

export { messagesService };
