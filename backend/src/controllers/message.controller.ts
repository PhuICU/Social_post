import { Request, Response } from "express";
import { ParamsDictionary } from "express-serve-static-core";

import messagesService from "../services/message.service";
import { MESSAGE_REQUEST } from "../models/requests/Message.request";
import { responseError, responseSuccess } from "../utils/response";
import { MESSAGE_SCHEMA } from "~/models/schemas/Message.schema";

const createMessage = async (
  req: Request<ParamsDictionary, any, MESSAGE_REQUEST, any>,
  res: Response
) => {
  const payload = req.body;

  const result = await messagesService.createMessage(payload);

  if (!result) {
    return responseError(res, {
      message: "Tạo message thất bại",
    });
  }
  return responseSuccess(res, {
    message: "Tạo message thành công",
    data: result,
  });
};

const getMessages = async (
  req: Request<ParamsDictionary, any, any, any>,
  res: Response
) => {
  const { chatId } = req.params;
  const result = await messagesService.getMessages(chatId);
  return responseSuccess(res, {
    message: "Lấy danh sách message thành công",
    data: result,
  });
};

const messageController = {
  createMessage,
  getMessages,
};

export default messageController;
