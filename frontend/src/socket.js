
import { io } from "socket.io-client";

const socket = io("https://smartexam-ai-1-b0yj.onrender.com", {
  transports: ["websocket"],
  autoConnect: true,
});

export default socket;