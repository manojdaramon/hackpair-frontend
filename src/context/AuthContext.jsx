"use client";

/** React imports */
import React, { createContext, useContext, useState, useEffect } from "react";

/** Libraries */
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

/** Local imports */
import api from "@/helpers/axios";

const AuthContext = createContext({
    user: null,
    loading: true,
    login: async () => {},
    signup: async () => {},
    logout: async () => {},
    setUser: () => {},
});

/**
 * Global Authentication Provider (Context API replacing Redux Toolkit).
 * Handles user session persistence, login, signup, logout, and navbar updates across components.
 *
 * @param {Object} props Component properties.
 * @param {React.ReactNode} props.children Child elements.
 * @returns {React.ReactElement} AuthContext Provider tree.
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
     * @param {string|null} [welcomeMessage=null] Optional custom toast message.
     * @returns {Promise<{success: boolean, error?: string, data?: Object}>} Login operation result.
     */
    const login = async (email, password, welcomeMessage = null) => {
        try {
            const response = await api.post("/login", { email, password });
            const userData = response.data;
            setUser(userData);
            toast.success(
                welcomeMessage || `Welcome back, ${userData?.firstName || "Developer"}!`
            );
            router.push("/dashboard");
            return { success: true, data: userData };
        } catch (err) {
            const errorMsg =
                err.response?.data?.message ||
                (typeof err.response?.data === "string" ? err.response.data : null) ||
                err.message ||
                "Failed to login. Please check your credentials.";
            toast.error(errorMsg);
            return { success: false, error: errorMsg };
        }
    };

    /**
     * Registers a new user account with HackPair and automatically signs them in.
     *
     * @param {Object} signupData User registration details.
     * @returns {Promise<{success: boolean, error?: string, data?: Object}>} Registration result.
     */
    const signup = async (signupData) => {
        try {
            await api.post("/signup", signupData);

            const greeting = signupData.firstName
                ? `Welcome to HackPair, ${signupData.firstName}!`
                : "Welcome to HackPair!";

            // Automatically establish cookie session upon registration
            const loginResult = await login(
                signupData.email,
                signupData.password,
                greeting
            );

            if (loginResult.success) {
                return { success: true, data: loginResult.data };
            }

            toast.success("Account created successfully! Please sign in.");
            router.push("/login");
            return { success: true };
        } catch (err) {
            const errorMsg =
                err.response?.data?.message ||
                (typeof err.response?.data === "string" ? err.response.data : null) ||
                err.message ||
                "Failed to sign up. Please try again.";
            toast.error(errorMsg);
            return { success: false, error: errorMsg };
        }
    };

    /**
     * Logs out the user, clears JWT cookie on server, and resets user state.
     *
     * @returns {Promise<void>}
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
        <AuthContext.Provider value={{ user, loading, login, signup, logout, setUser }}>
            {children}
        </AuthContext.Provider>
    );
};

/**
 * Custom hook to consume the AuthContext.
 *
 * @returns {Object} Auth context value.
 */
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};
