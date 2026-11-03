/** React imports */
import React from "react";

/** Local imports */
import LoginCard from "@/components/auth/login-card";

/** Styles */
import styles from "./login.module.css";

export const metadata = {
    title: "Sign In",
    description: "Sign in to your HackPair account to connect with developers.",
};

/**
 * Login Page Server Component.
 * Acts as a lightweight container delegating interactivity to LoginCard.
 *
 * @returns {React.ReactElement} The rendered Login page view.
 */
const LoginPage = () => {
    return (
        <main className={styles.login_container}>
            <LoginCard />
        </main>
    );
};

export default LoginPage;
