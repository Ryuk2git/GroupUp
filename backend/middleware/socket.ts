import { Server } from "socket.io";

let io: Server;

export const initSocket = (httpServer: any) => {
  io = new Server(httpServer, {
    cors: {
      origin: "*"
    }
  });

  io.on("connection", socket => {
    console.log("New client connected", socket.id);
  });

  return io;
};

export { io };
