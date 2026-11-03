"use client";

/** React imports */
import React, { useEffect } from "react";

/** Libraries */
import { useRouter } from "next/navigation";

/** Local imports */
import { useAuth } from "@/hooks/use-auth";
import ProfileEditCard from "@/components/profile/profile-edit-card";
import ChangePasswordCard from "@/components/profile/change-password-card";

/** Styles */
import styles from "./profile-view.module.css";

/**
 * Profile View layout component hosting profile information editing and password management.
 *
 * @returns {React.ReactElement} Rendered ProfileView component.
 */
const ProfileView = () => {
    const { user, loading } = useAuth();
    const router = useRouter();

    /**
     * Route protection: redirects unauthenticated users to /login.
     */
    useEffect(() => {
        if (!loading && !user) {
            router.push("/login");
        }
    }, [loading, user, router]);

    if (loading || (!user && loading)) {
        return (
            <div className={styles.profile_container}>
                <div className={styles.loading_container}>
                    <div className={styles.spinner} />
                    <span>Loading your profile...</span>
                </div>
            </div>
        );
    }

    if (!user) {
        return null;
    }

    return (
        <div className={styles.profile_container}>
            <header className={styles.profile_header}>
                <h1 className={styles.page_title}>Account Settings</h1>
                <p className={styles.page_subtitle}>
                    Manage your HackPair identity, developer profile, and account security.
                </p>
            </header>

            <div className={styles.profile_grid}>
                <ProfileEditCard />
                <ChangePasswordCard />
            </div>
        </div>
    );
};

export default ProfileView;

