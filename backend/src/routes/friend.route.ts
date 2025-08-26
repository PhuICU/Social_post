import { Router } from "express";
import friendController from "~/controllers/friend.controller";
import { wrapRequestHandler } from "~/utils/requestHandler";
import commonMiddlewares from "~/middlewares/common.middleware";

const router = Router();

router.post(
  "/request",
  commonMiddlewares.accessTokenValidator,
  wrapRequestHandler(friendController.createFriendRequest)
);
router.post(
  "/accept",
  commonMiddlewares.accessTokenValidator,
  wrapRequestHandler(friendController.acceptFriendRequest)
);
router.post("/block", wrapRequestHandler(friendController.blockUser));
router.delete(
  "/remove",
  commonMiddlewares.accessTokenValidator,
  wrapRequestHandler(friendController.removeFriendRequest)
);
router.get(
  "/requests/:user_id",
  commonMiddlewares.accessTokenValidator,
  wrapRequestHandler(friendController.getFriendRequests)
);
router.get(
  "/sent-requests/:user_id",
  commonMiddlewares.accessTokenValidator,
  wrapRequestHandler(friendController.getSentFriendRequests)
);
router.get(
  "/friends/:user_id",
  commonMiddlewares.accessTokenValidator,
  wrapRequestHandler(friendController.getFriends)
);

export default router;
