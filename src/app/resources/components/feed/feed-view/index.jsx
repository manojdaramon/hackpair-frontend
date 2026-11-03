"use client";

/** React imports */
import React, { useState } from "react";

/** Libraries */

/** Local imports */
import { useFeed } from "@/hooks/use-feed";
import DashboardShell from "@/components/dashboard/dashboard-shell";
import DeveloperCard from "@/components/dashboard/developer-card";

/** Styles */
import styles from "./feed-view.module.css";

/**
 * Dedicated Explore Feed view displaying candidate hackathon developers
 * and facilitating interest and pass interactions.
 *
 * @returns {React.ReactElement} Rendered FeedView element.
 */
const FeedView = () => {
    const { feed, loading, fetchFeed, sendRequest } = useFeed();
    const [actingUserId, setActingUserId] = useState(null);

    /**
     * Handles candidate interest or skip action on a developer card.
     *
     * @param {"interested"|"ignored"} status Decision type.
     * @param {string} toUserId Target developer identifier.
     */
    const handleSendRequest = async (status, toUserId) => {
        setActingUserId(toUserId);
        await sendRequest(status, toUserId);
        setActingUserId(null);
    };

    const refreshButton = (
        <button
            type="button"
            onClick={() => fetchFeed(1)}
            className={styles.refresh_btn}
        >
            <span>🔄</span>
            <span>Refresh Feed</span>
        </button>
    );

    return (
        <DashboardShell
            title="Discover Developers"
            subtitle="Browse candidate profiles and connect for upcoming hackathons."
            feedCount={feed.length}
            actions={refreshButton}
        >
            <div className={styles.feed_view}>
                {loading ? (
                    <div className={styles.loading_container}>
                        <div className={styles.spinner} />
                        <span>Finding matching developers...</span>
                    </div>
                ) : feed.length === 0 ? (
                    <div className={styles.empty_feed}>
                        <span className={styles.empty_icon}>✨</span>
                        <h3 className={styles.empty_title}>
                            You&apos;re All Caught Up!
                        </h3>
                        <p className={styles.empty_description}>
                            No new developers found in your feed at this moment. You&apos;ve
                            either reviewed all available profiles or sent requests to them.
                        </p>
                        <button
                            type="button"
                            onClick={() => fetchFeed(1)}
                            className={styles.reload_btn}
                        >
                            Check Again
                        </button>
                    </div>
                ) : (
                    <div className={styles.feed_grid}>
                        {feed.map((developer) => (
                            <DeveloperCard
                                key={developer._id}
                                developer={developer}
                                onSendRequest={handleSendRequest}
                                isActing={actingUserId === developer._id}
                            />
                        ))}
                    </div>
                )}
            </div>
        </DashboardShell>
    );
};

export default FeedView;

