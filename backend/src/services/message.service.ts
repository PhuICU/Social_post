import { MESSAGE_REQUEST } from "~/models/requests/Message.request";
import { ObjectId } from "mongodb";
import databaseService from "./database.service";
import { MESSAGE_SCHEMA } from "~/models/schemas/Message.schema";

class MessagesService {
  async getMessages(chatId: string) {
    // Check if chatId is a valid 24-character hex string
    if (!ObjectId.isValid(chatId)) {
      throw new Error("Invalid chatId: must be a 24-character hex string.");
    }

    // Convert chatId to ObjectId and find messages
    return await databaseService.messages
      .find({ chatId: new ObjectId(chatId) })
      .toArray();
  }

  async createMessage(message: MESSAGE_REQUEST) {
    return await databaseService.messages.insertOne(
      new MESSAGE_SCHEMA({
        ...message,
        chat_id: new ObjectId(message.chatId),
        user_id: new ObjectId(message.senderId),
        text: message.text,
      })
    );
  }
}

const messagesService = new MessagesService();

export default messagesService;
