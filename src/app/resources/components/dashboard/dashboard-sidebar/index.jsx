"use client";

/** React imports */
import React, { useEffect, useState } from "react";

/** Libraries */
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

/** Local imports */
import api from "@/helpers/axios";
import { getSocket } from "@/helpers/socket";

/** Styles */
import styles from "./dashboard-sidebar.module.css";

/**
 * Dashboard Sidebar component containing user profile summary, primary
 * navigation links (Explore Feed, Requests, My Connections), and profile shortcut.
 *
 * @param {Object} props Component properties.
 * @param {Object} props.user Current authenticated user profile object.
 * @param {"feed"|"requests"|"connections"} [props.activeTab] Currently active tab identifier.
 * @param {Function} [props.onSelectTab] Optional callback when switching tabs.
 * @param {number} [props.feedCount=0] Number of available feed developer cards.
 * @param {number} [props.requestsCount] Number of pending incoming requests.
 * @param {number} [props.connectionsCount=0] Number of accepted connections.
 * @returns {React.ReactElement} Rendered DashboardSidebar element.
 */
const DashboardSidebar = ({
    user,
    activeTab,
    onSelectTab,
    feedCount = 0,
    requestsCount,
    connectionsCount = 0,
}) => {
    const pathname = usePathname();
    const [imageError, setImageError] = useState(false);
    const [internalRequestsCount, setInternalRequestsCount] = useState(0);
    const [unreadMessagesCount, setUnreadMessagesCount] = useState(0);

    const displayName = `${user?.firstName || ""} ${user?.lastName || ""}`.trim() || "Developer";
    const initials = (user?.firstName?.charAt(0) || "D").toUpperCase();

    // Determine current active navigation section based on pathname or activeTab prop
    const activeNav =
        activeTab ||
        (pathname?.startsWith("/chat")
            ? "chat"
            : pathname?.startsWith("/requests")
            ? "requests"
            : pathname?.startsWith("/connections")
            ? "connections"
            : "feed");

    /**
     * Polls incoming request count if not explicitly supplied by parent view.
     */
    useEffect(() => {
        if (requestsCount !== undefined || !user) {
            return;
        }

        let isMounted = true;
        const fetchPendingCount = async () => {
            try {
                const response = await api.get("/user/requests/received");
                if (isMounted) {
                    const count = response.data?.data?.length || 0;
                    setInternalRequestsCount(count);
                }
            } catch {
                // Silently swallow sidebar badge errors
            }
        };

        fetchPendingCount();

        return () => {
            isMounted = false;
        };
    }, [requestsCount, user]);

    /**
     * Fetches unread chat messages count and syncs live with Socket.IO
     */
    useEffect(() => {
        if (!user) return;

        let isMounted = true;
        const fetchUnreadCount = async () => {
            try {
                const response = await api.get("/chat/unread-count");
                if (isMounted) {
                    setUnreadMessagesCount(response.data?.unreadCount || 0);
                }
            } catch {
                // Silently swallow chat badge errors
            }
        };

        fetchUnreadCount();

        const socket = getSocket();

        const handleNewUnread = () => {
            setUnreadMessagesCount((prev) => prev + 1);
        };

        const handleUnreadUpdated = () => {
            fetchUnreadCount();
        };

        socket.on("newUnreadMessage", handleNewUnread);
        socket.on("unreadCountUpdated", handleUnreadUpdated);

        return () => {
            isMounted = false;
            socket.off("newUnreadMessage", handleNewUnread);
            socket.off("unreadCountUpdated", handleUnreadUpdated);
        };
    }, [user, pathname]);

    const displayRequestsCount =
        requestsCount !== undefined ? requestsCount : internalRequestsCount;

    return (
        <aside className={styles.dashboard_sidebar} aria-label="Dashboard navigation">
            <div className={styles.user_profile_box}>
                <div className={styles.avatar_wrapper}>
                    {user?.photoUrl && !imageError ? (
                        <Image
                            src={user.photoUrl}
                            alt={displayName}
                            fill
                            sizes="52px"
                            unoptimized={user.photoUrl.startsWith("data:")}
                            className={styles.avatar_image}
                            onError={() => setImageError(true)}
                        />
                    ) : (
                        <div className={styles.avatar_fallback}>{initials}</div>
                    )}
                </div>

                <div className={styles.user_info}>
                    <span className={styles.user_name} title={displayName}>
                        {displayName}
                    </span>
                </div>
            </div>

            <nav className={styles.nav_section} aria-label="Main menu">
                <Link
                    href="/feed"
                    onClick={() => onSelectTab && onSelectTab("feed")}
                    className={`${styles.nav_item} ${activeNav === "feed" ? styles.nav_item_active : ""}`}
                >
                    <span className={styles.item_label}>
                        <span className={styles.item_icon}>⚡</span>
                        <span>Explore Feed</span>
                    </span>
                    {feedCount > 0 && <span className={styles.badge}>{feedCount}</span>}
                </Link>

                <Link
                    href="/requests"
                    onClick={() => onSelectTab && onSelectTab("requests")}
                    className={`${styles.nav_item} ${activeNav === "requests" ? styles.nav_item_active : ""}`}
                >
                    <span className={styles.item_label}>
                        <span className={styles.item_icon}>📩</span>
                        <span>Requests</span>
                    </span>
                    {displayRequestsCount > 0 && (
                        <span className={`${styles.badge} ${styles.badge_highlight}`}>
                            {displayRequestsCount}
                        </span>
                    )}
                </Link>

                <Link
                    href="/connections"
                    onClick={() => onSelectTab && onSelectTab("connections")}
                    className={`${styles.nav_item} ${activeNav === "connections" ? styles.nav_item_active : ""}`}
                >
                    <span className={styles.item_label}>
                        <span className={styles.item_icon}>👥</span>
                        <span>My Connections</span>
                    </span>
                    {connectionsCount > 0 && (
                        <span className={styles.badge}>{connectionsCount}</span>
                    )}
                </Link>

                <Link
                    href="/chat"
                    onClick={() => onSelectTab && onSelectTab("chat")}
                    className={`${styles.nav_item} ${activeNav === "chat" ? styles.nav_item_active : ""}`}
                >
                    <span className={styles.item_label}>
                        <span className={styles.item_icon}>💬</span>
                        <span>Messages</span>
                    </span>
                    {unreadMessagesCount > 0 && (
                        <span className={`${styles.badge} ${styles.badge_highlight}`}>
                            {unreadMessagesCount}
                        </span>
                    )}
                </Link>
            </nav>

            <div className={styles.sidebar_divider} />

            <nav className={styles.nav_section} aria-label="Account menu">
                <span className={styles.section_label}>Preferences</span>

                <Link
                    href="/profile"
                    className={`${styles.nav_item} ${pathname?.startsWith("/profile") ? styles.nav_item_active : ""}`}
                >
                    <span className={styles.item_label}>
                        <span className={styles.item_icon}>👤</span>
                        <span>Profile</span>
                    </span>
                </Link>
            </nav>

            <div className={styles.promo_card}>
                <span className={styles.promo_title}>
                    <span>💡</span> Pro Tip
                </span>
                <p className={styles.promo_desc}>
                    Update your skills and bio in Profile to appear in more partner search feeds.
                </p>
                <Link href="/profile" className={styles.promo_link}>
                    Edit Profile →
                </Link>
            </div>
        </aside>
    );
};

export default DashboardSidebar;
