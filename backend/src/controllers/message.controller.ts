import { Request, Response } from "express";
import { ParamsDictionary } from "express-serve-static-core";
import { messagesService } from "../services/message.service";
import { MESSAGE_REQUEST } from "../models/requests/Message.request";
import { responseError, responseSuccess } from "../utils/response";
import { ErrorWithMessage } from "~/utils/error";

/**
 * Lấy danh sách tin nhắn của 1 chat
 */
const getMessages = async (
  req: Request<ParamsDictionary, any, any, any>,
  res: Response
) => {
  const { chatId } = req.params;
  const result = await messagesService.getMessages(chatId);

  if (!result) {
    throw new ErrorWithMessage({
      message: "Không tìm thấy tin nhắn",
      status: 404,
    });
  }

  return responseSuccess(res, {
    message: "Lấy danh sách tin nhắn thành công",
    data: result,
  });
};

/**
 * Tạo tin nhắn mới
 */
const createMessage = async (
  req: Request<any, any, MESSAGE_REQUEST>,
  res: Response
): Promise<Response> => {
  const payload = req.body;
  const result = await messagesService.createMessage(payload);

  if (!result) {
    throw new ErrorWithMessage({
      message: "Tạo tin nhắn không thành công",
      status: 400,
    });
  }

  return responseSuccess(res, {
    message: "Tạo tin nhắn thành công",
    data: result,
  });
};

const messageController = {
  getMessages,
  createMessage,
};

export default messageController;
