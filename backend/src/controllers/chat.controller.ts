import { Request, Response } from "express";
import { ParamsDictionary } from "express-serve-static-core";
import chatService from "../services/chat.service";
import { CHAT_REQUEST } from "../models/requests/Chat.request";
import { responseError, responseSuccess } from "../utils/response";
import { ErrorWithMessage } from "~/utils/error";

const createChat = async (
  req: Request<any, any, CHAT_REQUEST>,
  res: Response
): Promise<Response> => {
  const payload = req.body;
  const result = await chatService.createChat(payload);
  if (!result) {
    throw new ErrorWithMessage({
      message: "Tạo chat không thành công",
      status: 400,
    });
  }
  return responseSuccess(res, {
    message: "Tạo chat thành công",
    data: result,
  });
};

const getChats = async (
  req: Request<ParamsDictionary, any, any, any>,
  res: Response
) => {
  const { firstId, secondId } = req.params;
  const result = await chatService.getChat({ members: [firstId, secondId] });
  return responseSuccess(res, {
    message: "Lấy danh sách chat thành công",
    data: result,
  });
};

const getChatsOfUser = async (
  req: Request<ParamsDictionary, any, any, any>,
  res: Response
) => {
  const { userId } = req.params;
  const result = await chatService.getUserChats(userId);

  return responseSuccess(res, {
    message: "Lấy danh sách chat theo user thành công",
    data: result,
  });
};

const getChatById = async (
  req: Request<ParamsDictionary, any, any, any>,
  res: Response
) => {
  const { chatId } = req.params;
  const result = await chatService.findChatById(chatId);
  return responseSuccess(res, {
    message: "Lấy chat thành công",
    data: result,
  });
};

const chatController = {
  createChat,
  getChats,
  getChatsOfUser,
  getChatById,
};

export default chatController;
