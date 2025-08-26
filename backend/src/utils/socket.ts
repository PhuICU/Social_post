import { Server } from "socket.io";

export function initSocket(server: any) {
  const io = new Server(server, {
    cors: { origin: ["http://localhost:3000"], credentials: true },
  });

  io.on("connection", (socket) => {
    console.log("✅ Socket connected:", socket.id);

    socket.on("joinRoom", (chatId: string) => {
      socket.join(chatId);
      console.log(`User ${socket.id} joined room ${chatId}`);
    });
    socket.on("joinUser", (userId: string) => {
      socket.join(userId);
      console.log(`User ${userId} joined personal notification room`);
    });

    socket.on("disconnect", () => {
      console.log("❌ Client disconnected:", socket.id);
    });
  });

  return io;
}
