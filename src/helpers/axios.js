import axios from "axios";
import { API_BASE_URL } from "./site";

/**
 * Global Axios instance configured with backend API base URL
 * and withCredentials: true to send/receive JWT authentication cookies.
 */
const api = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
    },
});

export default api;

