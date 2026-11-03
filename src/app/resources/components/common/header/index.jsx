"use client";
/* eslint-disable @next/next/no-img-element */

/** React imports */
import React, { useEffect, useState } from "react";

/** Libraries */
import Link from "next/link";

/** Local imports */
import Button from "@/components/common/button";
import LogoIcon from "@/icons/common/logo.svg";
import MenuIcon from "@/icons/common/menu.svg";
import CloseIcon from "@/icons/common/close.svg";
import { useAuth } from "@/context/AuthContext";
import api from "@/helpers/axios";

/** Styles */
import styles from "./header.module.css";

/**
 * Site navigation header with sticky backdrop and responsive full-height mobile drawer.
 * Provides access to Explore Feed, Requests, My Connections, and Profile on smaller devices.
 *
 * @returns {React.ReactElement} The rendered Header component.
 */
const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [pendingRequestsCount, setPendingRequestsCount] = useState(0);
    const { user, logout } = useAuth();

    /**
     * Locks body scrolling while the mobile full-height drawer is open.
     */
    useEffect(() => {
        if (isMenuOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
        return () => {
            document.body.style.overflow = "";
        };
    }, [isMenuOpen]);

    /**
     * Polls or loads pending incoming requests count for authenticated users.
     */
    useEffect(() => {
        if (!user) {
            return;
        }

        let isMounted = true;

        const fetchPendingCount = async () => {
            try {
                const response = await api.get("/user/requests/received");
                if (isMounted) {
                    const count = response.data?.data?.length || 0;
                    setPendingRequestsCount(count);
                }
            } catch {
                // Silently ignore network failures for count badge
            }
        };

        fetchPendingCount();

        return () => {
            isMounted = false;
        };
    }, [user]);

    /**
     * Toggles mobile menu drawer visibility.
     */
    const handleToggleMenu = () => {
        setIsMenuOpen((prev) => !prev);
    };

    /**
     * Closes mobile menu drawer on link navigation.
     */
    const handleCloseMenu = () => {
        setIsMenuOpen(false);
    };

    return (
        <header className={styles.header}>
            <div className={styles.header_inner}>
                <Link
                    href={user ? "/feed" : "/"}
                    className={styles.brand}
                    onClick={handleCloseMenu}
                >
                    <LogoIcon />
                    <span className={styles.brand_title}>HackPair</span>
                </Link>

                {!user && (
                    <nav className={styles.nav}>
                        <Link href="#how-it-works" className={styles.nav_link}>
                            How It Works
                        </Link>
                        <Link href="#active-builders" className={styles.nav_link}>
                            Active Builders
                        </Link>
                        <Link href="#features" className={styles.nav_link}>
                            Features
                        </Link>
                        <Link href="#hackathons" className={styles.nav_link}>
                            Hackathons
                        </Link>
                    </nav>
                )}

                <div className={styles.actions}>
                    {user ? (
                        <div className={styles.user_profile}>
                            <Link
                                href="/profile"
                                className={styles.profile_pill}
                                title="View and edit your profile"
                            >
                                {user.photoUrl ? (
                                    <img
                                        src={user.photoUrl}
                                        alt={user.firstName}
                                        className={styles.user_avatar}
                                    />
                                ) : (
                                    <div className={styles.user_avatar_placeholder}>
                                        {user.firstName?.charAt(0) || "U"}
                                    </div>
                                )}
                                <span className={styles.user_greeting}>
                                    Hi, {user.firstName}
                                </span>
                                <span className={styles.pill_chevron}>
                                    <svg
                                        width="14"
                                        height="14"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2.5"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    >
                                        <polyline points="9 18 15 12 9 6" />
                                    </svg>
                                </span>
                            </Link>
                            <button
                                onClick={logout}
                                className={styles.logout_button}
                                type="button"
                            >
                                Sign Out
                            </button>
                        </div>
                    ) : (
                        <>
                            <Link href="/login" className={styles.login_link}>
                                Sign In
                            </Link>
                            <Button href="/signup" variant="primary" showIcon>
                                Find a Partner
                            </Button>
                        </>
                    )}
                </div>

                <button
                    className={styles.mobile_toggle}
                    onClick={handleToggleMenu}
                    aria-label="Toggle navigation menu"
                >
                    {isMenuOpen ? <CloseIcon /> : <MenuIcon />}
                    {user && pendingRequestsCount > 0 && (
                        <span className={styles.notification_dot} />
                    )}
                </button>
            </div>

            {isMenuOpen && (
                <div className={styles.mobile_drawer}>
                    <div className={styles.drawer_nav_list}>
                        {user ? (
                            <>
                                <Link
                                    href="/feed"
                                    className={styles.drawer_nav_item}
                                    onClick={handleCloseMenu}
                                >
                                    <span className={styles.item_label}>
                                        <span className={styles.item_icon}>⚡</span>
                                        <span>Explore Feed</span>
                                    </span>
                                </Link>

                                <Link
                                    href="/requests"
                                    className={styles.drawer_nav_item}
                                    onClick={handleCloseMenu}
                                >
                                    <span className={styles.item_label}>
                                        <span className={styles.item_icon}>📩</span>
                                        <span>Requests</span>
                                    </span>
                                    {pendingRequestsCount > 0 && (
                                        <span
                                            className={`${styles.badge} ${styles.badge_highlight}`}
                                        >
                                            {pendingRequestsCount}
                                        </span>
                                    )}
                                </Link>

                                <Link
                                    href="/connections"
                                    className={styles.drawer_nav_item}
                                    onClick={handleCloseMenu}
                                >
                                    <span className={styles.item_label}>
                                        <span className={styles.item_icon}>👥</span>
                                        <span>My Connections</span>
                                    </span>
                                </Link>

                                <Link
                                    href="/profile"
                                    className={styles.drawer_nav_item}
                                    onClick={handleCloseMenu}
                                >
                                    <span className={styles.item_label}>
                                        <span className={styles.item_icon}>👤</span>
                                        <span>Profile</span>
                                    </span>
                                </Link>
                            </>
                        ) : (
                            <>
                                <Link
                                    href="#how-it-works"
                                    className={styles.drawer_link}
                                    onClick={handleCloseMenu}
                                >
                                    How It Works
                                </Link>
                                <Link
                                    href="#active-builders"
                                    className={styles.drawer_link}
                                    onClick={handleCloseMenu}
                                >
                                    Active Builders
                                </Link>
                                <Link
                                    href="#features"
                                    className={styles.drawer_link}
                                    onClick={handleCloseMenu}
                                >
                                    Features
                                </Link>
                                <Link
                                    href="#hackathons"
                                    className={styles.drawer_link}
                                    onClick={handleCloseMenu}
                                >
                                    Hackathons
                                </Link>
                            </>
                        )}
                    </div>

                    <div className={styles.drawer_footer}>
                        {user ? (
                            <div className={styles.drawer_user_card}>
                                <div className={styles.user_info_block}>
                                    <span className={styles.signed_in_label}>Signed in as</span>
                                    <span className={styles.user_full_name}>
                                        {user.firstName} {user.lastName || ""}
                                    </span>
                                    {user.email && (
                                        <span className={styles.user_email_text}>
                                            {user.email}
                                        </span>
                                    )}
                                </div>
                                <button
                                    onClick={() => {
                                        logout();
                                        handleCloseMenu();
                                    }}
                                    className={styles.drawer_logout_btn}
                                    type="button"
                                >
                                    Sign Out
                                </button>
                            </div>
                        ) : (
                            <div className={styles.drawer_auth_buttons}>
                                <Button
                                    href="/login"
                                    variant="secondary"
                                    onClick={handleCloseMenu}
                                >
                                    Sign In
                                </Button>
                                <Button
                                    href="/signup"
                                    variant="primary"
                                    showIcon
                                    onClick={handleCloseMenu}
                                >
                                    Find a Partner
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </header>
    );
};

export default Header;
