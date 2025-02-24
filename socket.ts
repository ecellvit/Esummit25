//TODO: (1) change cors in backend
//TODO: (2) set withCredentials: true

import { io } from "socket.io-client";

export const socket = io(process.env.NEXT_PUBLIC_BACKEND_URI, {
  transports: ['polling', 'websocket'],
  autoConnect: true,
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,
  timeout: 20000,
  // withCredentials: true,
  // Add error handling
  forceNew: true
});

// Add global error handlers
socket.on("connect_error", (error) => {
  console.error("Socket connection error:", error);
});

socket.on("error", (error) => {
  console.error("Socket error:", error);
});