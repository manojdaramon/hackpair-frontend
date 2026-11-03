/** React imports */
import React, { Suspense } from "react";

/** Local imports */
import ConnectionsPageView from "@/components/connections/connections-page-view";

/** Styles */
import styles from "./connections.module.css";

export const metadata = {
    title: "My Connections",
    description: "Manage your confirmed hackathon teammates and paired developers.",
};

/**
 * Connections Page Server Component.
 * Displays all accepted hackathon partner connections.
 *
 * @returns {React.ReactElement} The rendered Connections page view.
 */
const ConnectionsPage = () => {
    return (
        <main className={styles.connections_page}>
            <Suspense fallback={null}>
                <ConnectionsPageView />
            </Suspense>
        </main>
    );
};

export default ConnectionsPage;

