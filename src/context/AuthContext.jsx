"use client";

/** React imports */
import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

/** Local imports */
import api from "@/helpers/axios";

const AuthContext = createContext({
    user: null,
    loading: true,
    login: async () => {},
    logout: async () => {},
    setUser: () => {},
});

/**
 * Global Authentication Provider (Context API replacing Redux Toolkit).
 * Handles user session persistence, login, logout, and navbar updates across components.
 */
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    /**
     * Check if user is already authenticated via cookie on initial page load.
     */
    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const response = await api.get("/profile/view");
                if (response.data) {
                    setUser(response.data);
                }
            } catch (err) {
                // Not logged in or token expired - user remains null
                setUser(null);
            } finally {
                setLoading(false);
            }
        };

        fetchUserProfile();
    }, []);

    /**
     * Authenticates user with email and password using Axios with credentials.
     *
     * @param {string} email User email.
     * @param {string} password User password.
     */
    const login = async (email, password) => {
        try {
            const response = await api.post("/login", { email, password });
            const userData = response.data;
            setUser(userData);
            toast.success(`Welcome back, ${userData?.firstName || "Developer"}!`);
            router.push("/");
            return { success: true, data: userData };
        } catch (err) {
            const errorMsg =
                err.response?.data?.message ||
                err.response?.data ||
                err.message ||
                "Failed to login. Please check your credentials.";
            toast.error(errorMsg);
            return { success: false, error: errorMsg };
        }
    };

    /**
     * Logs out the user, clears JWT cookie on server, and resets user state.
     */
    const logout = async () => {
        try {
            await api.post("/logout");
            setUser(null);
            toast.success("Logged out successfully");
            router.push("/login");
        } catch (err) {
            // Even if network fails, clear local user state
            setUser(null);
            router.push("/login");
        }
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, logout, setUser }}>
            {children}
        </AuthContext.Provider>
    );
};

/**
 * Custom hook to consume the AuthContext.
 */
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};

