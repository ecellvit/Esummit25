//TODO: (1) change cors in backend
//TODO: (2) set withCredentials: true

import { io } from "socket.io-client";
import { getSessionUser } from "./utils/getSessionUser";

export const socket = io(process.env.NEXT_PUBLIC_BACKEND_URI, {
  transports: ['polling', 'websocket'],
  autoConnect: true,
  reconnection: true,
  reconnectionAttempts: Infinity,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,
  timeout: 20000,
  // withCredentials: true,
  // Add error handling
  forceNew: true
});

getSessionUser().then((user) => {
  if (user) {
    socket.auth = { user };
    socket.connect(); // Connect after setting auth
  }
});

// Add global error handlers
socket.on("connect_error", (error) => {
  console.warn("Socket connection error:", error);
});

socket.on("error", (error) => {
  console.warn("Socket error:", error);
});