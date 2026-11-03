/** React imports */
import React from "react";

/** Local imports */
import SignupCard from "@/components/auth/signup-card";

/** Styles */
import styles from "./signup.module.css";

export const metadata = {
    title: "Sign Up",
    description: "Create your HackPair account to find hackathon partners and build together.",
};

/**
 * Signup Page Server Component.
 * Acts as a lightweight container delegating interactivity to SignupCard.
 *
 * @returns {React.ReactElement} The rendered Signup page view.
 */
const SignupPage = () => {
    return (
        <main className={styles.signup_container}>
            <SignupCard />
        </main>
    );
};

export default SignupPage;

