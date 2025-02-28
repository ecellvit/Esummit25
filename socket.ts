//TODO: (1) change cors in backend
//TODO: (2) set withCredentials: true

import { io } from "socket.io-client";
import { getSessionUser } from "./utils/getSessionUser";

// Create socket but don't connect automatically
export const socket = io(process.env.NEXT_PUBLIC_BACKEND_URI, {
  transports: ['polling', 'websocket'],
  autoConnect: false, // Changed to false to prevent auto-connection
  reconnection: true,
  reconnectionAttempts: Infinity,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,
  timeout: 20000,
  forceNew: true
});

// Initialize socket connection with authentication
export async function initializeSocket() {
  try {
    const user = await getSessionUser();
    
    if (!user) {
      console.warn("No session user found. Socket connection aborted.");
      return { success: false, message: "No user session" };
    }
    
    // Set auth data before connecting
    socket.auth = { user };
    
    // Connect manually now that we have auth data
    socket.connect();
    
    return { success: true };
  } catch (error) {
    console.error("Failed to initialize socket:", error);
    if (error instanceof Error) {
      return { success: false, message: error.message };
    } else {
      return { success: false, message: "Internal server error" };
    }
  }
}

// Set up event listeners
socket.on("connect", () => {
  console.log("Socket connected with ID:", socket.id);
});

socket.on("connected", () => {
  console.log("Server confirmed connection for user");
});

socket.on("connect_error", (error) => {
  console.warn("Socket connection error:", error);
});

socket.on("error", (error) => {
  console.warn("Socket error:", error);
});

socket.on("disconnect", (reason) => {
  console.log("Socket disconnected:", reason);
  
  // If the server disconnected us, don't try to reconnect automatically
  if (reason === "io server disconnect") {
    console.log("Server disconnected the socket, reconnection must be manual");
  }
});

// Export a reconnect function for manual reconnection if needed
export function reconnectSocket() {
  if (!socket.connected) {
    initializeSocket();
  }
}