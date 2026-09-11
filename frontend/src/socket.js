import { io } from "socket.io-client";
import socket from "../socket";

useEffect(() => {
  socket.on("connect", () => {
    console.log("🟢 Socket Connected:", socket.id);
  });

  socket.on("disconnect", () => {
    console.log("🔴 Socket Disconnected");
  });

}, []);

const socket = io("http://localhost:5000", {
  transports: ["websocket"]
});

export default socket;

