"use client";

/** React imports */
import React, { useState } from "react";

/** Libraries */

/** Local imports */
import { useConnections } from "@/hooks/use-connections";
import DashboardShell from "@/components/dashboard/dashboard-shell";
import RequestsView from "@/components/dashboard/requests-view";

/** Styles */
import styles from "./requests-page-view.module.css";

/**
 * Dedicated Requests Page View component allowing users to review and respond to incoming
 * partner connection requests without loading unrelated feed profiles.
 *
 * @returns {React.ReactElement} Rendered RequestsPageView element.
 */
const RequestsPageView = () => {
    const { requests, connections, loading, reviewRequest, fetchAllData } = useConnections();
    const [isReviewing, setIsReviewing] = useState(false);

    /**
     * Handles accepting or rejecting an incoming connection request.
     *
     * @param {"accepted"|"rejected"} status Verdict for the connection request.
     * @param {string} requestId Request ID.
     */
    const handleReview = async (status, requestId) => {
        setIsReviewing(true);
        await reviewRequest(status, requestId);
        setIsReviewing(false);
    };

    const refreshButton = (
        <button
            type="button"
            onClick={fetchAllData}
            className={styles.refresh_btn}
        >
            <span>🔄</span>
            <span>Refresh Requests</span>
        </button>
    );

    return (
        <DashboardShell
            title="Match Requests"
            subtitle="Review developers who are interested in collaborating with you."
            requestsCount={requests.length}
            connectionsCount={connections.length}
            actions={refreshButton}
        >
            <div className={styles.requests_page_view}>
                {loading ? (
                    <div className={styles.loading_container}>
                        <div className={styles.spinner} />
                        <span>Loading pending requests...</span>
                    </div>
                ) : (
                    <RequestsView
                        requests={requests}
                        onReview={handleReview}
                        isReviewing={isReviewing}
                    />
                )}
            </div>
        </DashboardShell>
    );
};

export default RequestsPageView;

