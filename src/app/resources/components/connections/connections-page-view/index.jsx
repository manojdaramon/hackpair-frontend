"use client";

/** React imports */
import React from "react";

/** Libraries */

/** Local imports */
import { useConnections } from "@/hooks/use-connections";
import DashboardShell from "@/components/dashboard/dashboard-shell";
import ConnectionsView from "@/components/dashboard/connections-view";

/** Styles */
import styles from "./connections-page-view.module.css";

/**
 * Dedicated Connections Page View component rendering accepted hackathon partners.
 *
 * @returns {React.ReactElement} Rendered ConnectionsPageView element.
 */
const ConnectionsPageView = () => {
    const { connections, requests, loading, fetchAllData } = useConnections();

    const refreshButton = (
        <button
            type="button"
            onClick={fetchAllData}
            className={styles.refresh_btn}
        >
            <span>🔄</span>
            <span>Refresh Connections</span>
        </button>
    );

    return (
        <DashboardShell
            title="My Connections"
            subtitle="Your confirmed hackathon partners ready to build together."
            connectionsCount={connections.length}
            requestsCount={requests.length}
            actions={refreshButton}
        >
            <div className={styles.connections_page_view}>
                {loading ? (
                    <div className={styles.loading_container}>
                        <div className={styles.spinner} />
                        <span>Loading connections...</span>
                    </div>
                ) : (
                    <ConnectionsView connections={connections} />
                )}
            </div>
        </DashboardShell>
    );
};

export default ConnectionsPageView;

