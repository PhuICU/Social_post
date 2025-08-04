import express, { type Request, type Response } from "express";
import cors from "cors";
import morgan from "morgan";
import path from "path";
import cron from "node-cron";
import env_config from "./configs/env.config";
import databaseService from "./services/database.service";
import userRoutes from "./routes/user.route";
import { defaultErrorHandler } from "./utils/requestHandler";
import postRoutes from "./routes/post.route";
import commentRoutes from "./routes/comment.route";
import favoriteRoutes from "./routes/favorite.route";
import likeRoutes from "./routes/like.route";
import uploadImagesRoutes from "./routes/image.route";
import reportsRoutes from "./routes/report.route";
import videoRoutes from "./routes/video.route";
import chatRoutes from "./routes/chat.route";
import messageRoutes from "./routes/message.route";
import { responseSuccess } from "./utils/response";
const app = express();
app.use(
  cors({
    origin: [
      (env_config.CLIENT_PORTS as string) || "http://localhost:3000",
      "http://127.0.0.1:5500",
    ],
    credentials: true,
    optionsSuccessStatus: 200,
  })
);

app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
databaseService.connect();
app.use("/post", postRoutes);
app.use("/user", userRoutes);
app.use("/comment", commentRoutes);
app.use("/favorite", favoriteRoutes);
app.use("/like", likeRoutes);
app.use("/image", uploadImagesRoutes);
app.use("/report", reportsRoutes);
app.use("/video", videoRoutes);
app.use("/chat", chatRoutes);
app.use("/message", messageRoutes);
app.use(defaultErrorHandler);
app.listen(env_config.SERVER_PORT, async () => {
  console.log(`Server is running on port ${env_config.SERVER_PORT}`);
});
