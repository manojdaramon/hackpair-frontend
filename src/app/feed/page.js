/** React imports */
import React, { Suspense } from "react";

/** Local imports */
import FeedView from "@/components/feed/feed-view";

/** Styles */
import styles from "./feed.module.css";

export const metadata = {
    title: "Explore Feed",
    description: "Discover developer partners and hackathon collaborators matching your skills.",
};

/**
 * Explore Feed Page Server Component.
 * Hosts developer candidate discovery and matchmaking interactions.
 *
 * @returns {React.ReactElement} The rendered Feed page view.
 */
const FeedPage = () => {
    return (
        <main className={styles.feed_page}>
            <Suspense fallback={null}>
                <FeedView />
            </Suspense>
        </main>
    );
};

export default FeedPage;

