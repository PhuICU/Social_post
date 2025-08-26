import { CHAT_REQUEST } from "~/models/requests/Chat.request";
import databaseService from "./database.service";
import { CHAT_SCHEMA } from "~/models/schemas/Chat.schema";
import { ObjectId } from "mongodb";
import { ErrorWithMessage } from "~/utils/error";

class ChatService {
  /**
   * Tạo cuộc trò chuyện mới giữa 2 user
   */
  async createChat(chat: CHAT_REQUEST) {
    // Kiểm tra xem đã tồn tại chat giữa 2 user chưa
    const chatExist = await databaseService.chats.findOne({
      members: {
        $all: [new ObjectId(chat.members[0]), new ObjectId(chat.members[1])],
      },
    });

    if (chatExist) {
      throw new ErrorWithMessage({ message: "Chat đã tồn tại", status: 400 });
    }

    const newChat: CHAT_SCHEMA = {
      _id: new ObjectId(),
      members: chat.members.map((id) => new ObjectId(id)),
      created_at: new Date(),
      updated_at: new Date(),
    };

    await databaseService.chats.insertOne(newChat);
    return newChat;
  }

  /**
   * Lấy thông tin chat giữa 2 user (nếu có)
   */
  async getChat(chat: CHAT_REQUEST) {
    return await databaseService.chats.findOne({
      members: {
        $all: [new ObjectId(chat.members[0]), new ObjectId(chat.members[1])],
      },
    });
  }

  /**
   * Lấy tất cả chat mà user tham gia
   */
  async getUserChats(userId: string) {
    return await databaseService.chats
      .find({ members: { $in: [new ObjectId(userId)] } })
      .toArray();
  }

  /**
   * Tìm chat theo id
   */
  async findChatById(id: string) {
    return await databaseService.chats.findOne({ _id: new ObjectId(id) });
  }
}

const chatService = new ChatService();
export default chatService;
