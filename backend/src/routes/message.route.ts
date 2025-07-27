import { Router } from "express";
import messageController from "~/controllers/message.controller";
import commonMiddlewares from "~/middlewares/common.middleware";
import { wrapRequestHandler } from "~/utils/requestHandler";

const messageRoutes = Router();

messageRoutes.post(
  "/create",
  wrapRequestHandler(messageController.createMessage)
);
messageRoutes.get(
  "/:chatId",
  wrapRequestHandler(messageController.getMessages)
);

export default messageRoutes;
