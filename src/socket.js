import { io } from "socket.io-client";

const connectionOptions = {
  transports: ["websocket"],
  autoConnect: false,
};

export const socket = io(
  import.meta.env.VITE_PORTAL_SOCKET || "http://localhost:6789",
  connectionOptions
);
