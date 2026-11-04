import { io } from "socket.io-client";
import { API_BASE_URL } from "./site";

let socketInstance = null;

/**
 * Creates or retrieves the singleton Socket.IO connection instance.
 * Automatically transmits cookie session for authentication.
 *
 * @returns {import("socket.io-client").Socket} Connected socket instance.
 */
export const getSocket = () => {
    if (!socketInstance || socketInstance.disconnected) {
        socketInstance = io(API_BASE_URL, {
            withCredentials: true,
            autoConnect: true,
            transports: ["websocket", "polling"],
        });
    }
    return socketInstance;
};

/**
 * Disconnects and cleans up the active socket instance.
 */
export const disconnectSocket = () => {
    if (socketInstance) {
        socketInstance.disconnect();
        socketInstance = null;
    }
};

