"use client";
/* eslint-disable @next/next/no-img-element */

/** React imports */
import React, { useState } from "react";

/** Libraries */
import Link from "next/link";

/** Local imports */
import Button from "@/components/common/button";
import LogoIcon from "@/icons/common/logo.svg";
import MenuIcon from "@/icons/common/menu.svg";
import CloseIcon from "@/icons/common/close.svg";
import { useAuth } from "@/context/AuthContext";

/** Styles */
import styles from "./header.module.css";

/**
 * Site navigation header with sticky backdrop and responsive mobile drawer from 925px.
 *
 * @returns {React.ReactElement} The rendered Header component.
 */
const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { user, logout } = useAuth();

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
                <Link href="/" className={styles.brand} onClick={handleCloseMenu}>
                    <LogoIcon />
                    <span className={styles.brand_title}>HackPair</span>
                    <span className={styles.brand_status_dot} title="System Online" />
                </Link>

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

                <div className={styles.actions}>
                    {user ? (
                        <div className={styles.user_profile}>
                            {user.photoUrl ? (
                                <img
                                    src={user.photoUrl}
                                    alt={user.firstName}
                                    className={styles.user_avatar}
                                />
                            ) : (
                                <div
                                    className={styles.user_avatar}
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        background: "#e0e7ff",
                                        color: "#4f46e5",
                                        fontWeight: 600,
                                    }}
                                >
                                    {user.firstName?.charAt(0) || "U"}
                                </div>
                            )}
                            <span className={styles.user_greeting}>
                                Hi, {user.firstName}
                            </span>
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
                </button>
            </div>

            {isMenuOpen && (
                <div className={styles.mobile_drawer}>
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

                    <div className={styles.drawer_actions}>
                        {user ? (
                            <div
                                className={styles.user_profile}
                                style={{
                                    justifyContent: "space-between",
                                    width: "100%",
                                }}
                            >
                                <div
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "0.75rem",
                                    }}
                                >
                                    {user.photoUrl && (
                                        <img
                                            src={user.photoUrl}
                                            alt={user.firstName}
                                            className={styles.user_avatar}
                                        />
                                    )}
                                    <span className={styles.user_greeting}>
                                        Hi, {user.firstName}
                                    </span>
                                </div>
                                <button
                                    onClick={() => {
                                        logout();
                                        handleCloseMenu();
                                    }}
                                    className={styles.logout_button}
                                    type="button"
                                >
                                    Sign Out
                                </button>
                            </div>
                        ) : (
                            <>
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
                            </>
                        )}
                    </div>
                </div>
            )}
        </header>
    );
};

export default Header;
