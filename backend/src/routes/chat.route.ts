import { Router } from "express";
import chatController from "~/controllers/chat.controller";
import { wrapRequestHandler } from "~/utils/requestHandler";
const chatRoutes = Router();

chatRoutes.post("/create", wrapRequestHandler(chatController.createChat));
chatRoutes.get(
  "/all/:firstId/:secondId",
  wrapRequestHandler(chatController.getChats)
);
chatRoutes.get("/:userId", wrapRequestHandler(chatController.getChatsOfUser));
chatRoutes.get("/chat/:chatId", wrapRequestHandler(chatController.getChatById));

export default chatRoutes;
