/** React imports */
import React, { Suspense } from "react";

/** Local imports */
import RequestsPageView from "@/components/requests/requests-page-view";

/** Styles */
import styles from "./requests.module.css";

export const metadata = {
    title: "Match Requests",
    description: "Review incoming hackathon connection requests from other developers.",
};

/**
 * Requests Page Server Component.
 * Hosts review actions for incoming collaboration invitations.
 *
 * @returns {React.ReactElement} The rendered Requests page view.
 */
const RequestsPage = () => {
    return (
        <main className={styles.requests_page}>
            <Suspense fallback={null}>
                <RequestsPageView />
            </Suspense>
        </main>
    );
};

export default RequestsPage;

