"use client";

/** React imports */
import React, { useEffect } from "react";

/** Libraries */
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

/** Local imports */
import { useAuth } from "@/hooks/use-auth";
import DashboardSidebar from "@/components/dashboard/dashboard-sidebar";

/** Styles */
import styles from "./dashboard-shell.module.css";

/**
 * Shared workspace shell providing the desktop sidebar, responsive mobile tab pills,
 * and authenticated route guarding across /feed, /requests, and /connections.
 *
 * @param {Object} props Component properties.
 * @param {React.ReactNode} props.children Child view elements.
 * @param {string} props.title Section heading title.
 * @param {string} props.subtitle Explanatory section subtitle.
 * @param {React.ReactNode} [props.actions] Optional action controls (e.g., refresh button).
 * @param {number} [props.feedCount=0] Number of feed developer cards available.
 * @param {number} [props.requestsCount] Number of incoming connection requests.
 * @param {number} [props.connectionsCount=0] Number of accepted partner connections.
 * @returns {React.ReactElement|null} Rendered DashboardShell element.
 */
const DashboardShell = ({
    children,
    title,
    subtitle,
    actions,
    feedCount = 0,
    requestsCount,
    connectionsCount = 0,
}) => {
    const { user, loading: authLoading } = useAuth();
    const router = useRouter();
    const pathname = usePathname();

    const activeTab = pathname?.startsWith("/chat")
        ? "chat"
        : pathname?.startsWith("/requests")
        ? "requests"
        : pathname?.startsWith("/connections")
        ? "connections"
        : "feed";

    /**
     * Guards authenticated views by redirecting unauthenticated visitors to /login.
     */
    useEffect(() => {
        if (!authLoading && !user) {
            router.push("/login");
        }
    }, [authLoading, user, router]);

    if (authLoading || (!user && authLoading)) {
        return (
            <div className={styles.initial_loading}>
                <div className={styles.spinner} />
                <span>Loading your developer hub...</span>
            </div>
        );
    }

    if (!user) {
        return null;
    }

    return (
        <div className={styles.dashboard_shell}>
            <DashboardSidebar
                user={user}
                activeTab={activeTab}
                feedCount={feedCount}
                requestsCount={requestsCount}
                connectionsCount={connectionsCount}
            />

            <main className={styles.shell_main}>
                {/* Responsive mobile tab switcher pills */}
                <div className={styles.mobile_tab_switcher} role="tablist">
                    <Link
                        href="/feed"
                        className={`${styles.tab_pill} ${activeTab === "feed" ? styles.tab_pill_active : ""}`}
                        role="tab"
                        aria-selected={activeTab === "feed"}
                    >
                        <span className={styles.pill_label}>⚡ Feed</span>
                        {feedCount > 0 && (
                            <span className={styles.pill_badge}>{feedCount}</span>
                        )}
                    </Link>

                    <Link
                        href="/requests"
                        className={`${styles.tab_pill} ${activeTab === "requests" ? styles.tab_pill_active : ""}`}
                        role="tab"
                        aria-selected={activeTab === "requests"}
                    >
                        <span className={styles.pill_label}>📩 Requests</span>
                        {requestsCount > 0 && (
                            <span className={`${styles.pill_badge} ${styles.pill_badge_alert}`}>
                                {requestsCount}
                            </span>
                        )}
                    </Link>

                    <Link
                        href="/connections"
                        className={`${styles.tab_pill} ${activeTab === "connections" ? styles.tab_pill_active : ""}`}
                        role="tab"
                        aria-selected={activeTab === "connections"}
                    >
                        <span className={styles.pill_label}>👥 Connections</span>
                        {connectionsCount > 0 && (
                            <span className={styles.pill_badge}>{connectionsCount}</span>
                        )}
                    </Link>

                    <Link
                        href="/chat"
                        className={`${styles.tab_pill} ${activeTab === "chat" ? styles.tab_pill_active : ""}`}
                        role="tab"
                        aria-selected={activeTab === "chat"}
                    >
                        <span className={styles.pill_label}>💬 Messages</span>
                    </Link>
                </div>

                <header className={styles.main_header}>
                    <div className={styles.header_text}>
                        <h1 className={styles.view_title}>{title}</h1>
                        {subtitle && <p className={styles.view_subtitle}>{subtitle}</p>}
                    </div>

                    {actions && <div className={styles.header_actions}>{actions}</div>}
                </header>

                <div className={styles.content_body}>{children}</div>
            </main>
        </div>
    );
};

export default DashboardShell;

