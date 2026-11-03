"use client";

/** React imports */
import React, { useEffect, useState } from "react";

/** Libraries */
import Link from "next/link";
import { useRouter } from "next/navigation";

/** Local imports */
import { useAuth } from "@/context/AuthContext";

/** Styles */
import styles from "./login-card.module.css";

/**
 * Login Card client component managing controlled input states,
 * client-side form validation, and authentication with the backend.
 *
 * @returns {React.ReactElement} The rendered LoginCard component.
 */
const LoginCard = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errors, setErrors] = useState({});
    const [serverError, setServerError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { login, user } = useAuth();
    const router = useRouter();

    /**
     * If user is already authenticated, redirect to the home feed.
     */
    useEffect(() => {
        if (user) {
            router.push("/");
        }
    }, [user, router]);

    /**
     * Validates email format and required password before dispatching request.
     *
     * @returns {boolean} True if all fields are valid, false otherwise.
     */
    const validateForm = () => {
        const validationErrors = {};
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!email.trim()) {
            validationErrors.email = "Email address is required";
        } else if (!emailRegex.test(email.trim())) {
            validationErrors.email = "Please enter a valid email address";
        }

        if (!password) {
            validationErrors.password = "Password is required";
        }

        setErrors(validationErrors);
        return Object.keys(validationErrors).length === 0;
    };

    /**
     * Dispatches login request to the AuthProvider.
     *
     * @param {React.FormEvent<HTMLFormElement>} e Form submission event.
     */
    const handleSubmit = async (e) => {
        e.preventDefault();
        setServerError("");

        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);
        const result = await login(email.trim(), password);
        setIsSubmitting(false);

        if (!result.success) {
            setServerError(result.error);
        }
    };

    return (
        <div className={styles.login_card}>
            <div className={styles.card_header}>
                <h1 className={styles.card_title}>Welcome Back</h1>
                <p className={styles.card_subtitle}>
                    Sign in to connect with fellow developers on HackPair
                </p>
            </div>

            {serverError && (
                <div className={styles.alert_box} role="alert">
                    <span>⚠️</span>
                    <span>{serverError}</span>
                </div>
            )}

            <form className={styles.login_form} onSubmit={handleSubmit} noValidate>
                <div className={styles.form_group}>
                    <label htmlFor="email" className={styles.form_label}>
                        Email Address
                    </label>
                    <input
                        id="email"
                        type="email"
                        name="email"
                        value={email}
                        onChange={(e) => {
                            setEmail(e.target.value);
                            if (errors.email) {
                                setErrors((prev) => ({ ...prev, email: "" }));
                            }
                        }}
                        placeholder="name@example.com"
                        className={`${styles.input_field} ${errors.email ? styles.input_error : ""}`}
                        autoComplete="email"
                        disabled={isSubmitting}
                    />
                    {errors.email && (
                        <span className={styles.error_message}>{errors.email}</span>
                    )}
                </div>

                <div className={styles.form_group}>
                    <label htmlFor="password" className={styles.form_label}>
                        Password
                    </label>
                    <input
                        id="password"
                        type="password"
                        name="password"
                        value={password}
                        onChange={(e) => {
                            setPassword(e.target.value);
                            if (errors.password) {
                                setErrors((prev) => ({ ...prev, password: "" }));
                            }
                        }}
                        placeholder="••••••••"
                        className={`${styles.input_field} ${errors.password ? styles.input_error : ""}`}
                        autoComplete="current-password"
                        disabled={isSubmitting}
                    />
                    {errors.password && (
                        <span className={styles.error_message}>{errors.password}</span>
                    )}
                </div>

                <button
                    type="submit"
                    className={styles.submit_btn}
                    disabled={isSubmitting}
                >
                    {isSubmitting ? "Signing in..." : "Sign In"}
                </button>
            </form>

            <div className={styles.card_footer}>
                <span>Don&apos;t have an account?</span>
                <Link href="/signup" className={styles.footer_link}>
                    Join HackPair
                </Link>
            </div>
        </div>
    );
};

export default LoginCard;

