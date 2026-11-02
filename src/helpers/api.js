/** Libraries */
import toast from "react-hot-toast";

/** Local imports */
import { API_BASE_URL } from "./site";

/**
 * Builds the centralized request configuration for fetch requests.
 * Includes credentials by default for cookie-based authentication.
 *
 * @param {string} [method="GET"] HTTP method (GET, POST, PUT, PATCH, DELETE).
 * @param {Object|null} [data=null] Request body payload.
 * @param {Object} [customHeaders={}] Additional or overriding headers.
 * @returns {RequestInit} Fetch configuration object.
 */
export const getConfig = (method = "GET", data = null, customHeaders = {}) => {
    const config = {
        method,
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
            ...customHeaders,
        },
    };

    if (data && method !== "GET") {
        config.body = JSON.stringify(data);
    }

    return config;
};

/**
 * Dispatches an HTTP request to the HackPair backend API.
 * Automatically manages credentials, JSON serialization, and error handling.
 *
 * @param {string} endpoint API endpoint path (e.g., "/profile/view").
 * @param {RequestInit} [options={}] Request initialization parameters.
 * @returns {Promise<any>} Parsed response data.
 * @throws {Error} Propagates error when response is not ok.
 */
export const fetchApi = async (endpoint, options = {}) => {
    const url = endpoint.startsWith("http") ? endpoint : `${API_BASE_URL}${endpoint}`;

    try {
        const response = await fetch(url, options);
        const data = await response.json().catch(() => null);

        if (!response.ok) {
            const errorMessage = data?.message || data?.error || `Request failed with status ${response.status}`;
            throw new Error(errorMessage);
        }

        return data;
    } catch (error) {
        toast.error(error.message || "An unexpected error occurred.");
        throw error;
    }
};

