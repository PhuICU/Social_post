import express, { type Request, type Response } from "express";
import cors from "cors";
import morgan from "morgan";
import path from "path";
import env_config from "./configs/env.config";
import databaseService from "./services/database.service";
import { initSocket } from "./utils/socket";

// import routes
import userRoutes from "./routes/user.route";
import postRoutes from "./routes/post.route";
import commentRoutes from "./routes/comment.route";
import favoriteRoutes from "./routes/favorite.route";
import likeRoutes from "./routes/like.route";
import uploadImagesRoutes from "./routes/image.route";
import reportsRoutes from "./routes/report.route";
import videoRoutes from "./routes/video.route";
import chatRoutes from "./routes/chat.route";
import messageRoutes from "./routes/message.route";
import friendRoutes from "./routes/friend.route";
import notificationRoutes from "./routes/notification.route";

// utils
import { defaultErrorHandler } from "./utils/requestHandler";

// socket.io
import { Server } from "socket.io";
import http from "http";
import { initMessagesService } from "./services/message.service";
import { initNotificationService } from "./services/notification.service";

const app = express();

// middleware
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

// view engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// connect database
databaseService.connect();

// routes
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
app.use("/friend", friendRoutes);
app.use("/notification", notificationRoutes);

// error handler
app.use(defaultErrorHandler);

const PORT = parseInt(env_config.SERVER_PORT as string) || 3001;

const httpServer = http.createServer(app);
const io = initSocket(httpServer);

app.set("io", io);

initMessagesService(io);

initNotificationService(io);
// start server
httpServer
  .listen(PORT, async () => {
    console.log(`🚀 Server is running on port ${PORT}`);
  })
  .on("error", (err: any) => {
    if (err.code === "EADDRINUSE") {
      console.log(`Port ${PORT} is already in use. Trying port ${PORT + 1}...`);
      httpServer.listen(PORT + 1, () => {
        console.log(`🚀 Server is running on port ${PORT + 1}`);
      });
    } else {
      console.error("Server error:", err);
    }
  });
