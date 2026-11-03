/** React imports */
import React from "react";

/** Local imports */
import ProfileView from "@/components/profile/profile-view";

/** Styles */
import styles from "./profile.module.css";

export const metadata = {
    title: "Profile Settings",
    description: "Manage your HackPair developer profile, skills, bio, and account credentials.",
};

/**
 * Profile Page Server Component.
 * Hosts developer profile customization and security controls.
 *
 * @returns {React.ReactElement} The rendered Profile page view.
 */
const ProfilePage = () => {
    return (
        <main className={styles.profile_page}>
            <ProfileView />
        </main>
    );
};

export default ProfilePage;

