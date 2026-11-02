/** React imports */
import React from "react";

/** Libraries */
import Link from "next/link";

/** Local imports */
import LogoIcon from "@/icons/common/logo.svg";
import GithubIcon from "@/icons/common/github.svg";

/** Styles */
import styles from "./footer.module.css";

/**
 * Site footer displaying branding, directory links, network status, and copyright.
 *
 * @returns {React.ReactElement} The rendered Footer component.
 */
const Footer = () => {
    return (
        <footer className={styles.footer}>
            <div className={styles.footer_inner}>
                <div className={styles.top_grid}>
                    <div className={styles.brand_col}>
                        <Link href="/" className={styles.brand}>
                            <LogoIcon />
                            <span className={styles.brand_name}>HackPair</span>
                        </Link>
                        <p className={styles.tagline}>
                            The pairing network where developers meet, match stacks, and ship together.
                        </p>
                        <div className={styles.status_indicator}>
                            <span className={styles.indicator_dot} />
                            <span>Pairing Engine Active • 99.9% Uptime</span>
                        </div>
                    </div>

                    <div className={styles.links_col}>
                        <span className={styles.col_heading}>Platform</span>
                        <Link href="/feed" className={styles.col_link}>
                            Developer Feed
                        </Link>
                        <Link href="#how-it-works" className={styles.col_link}>
                            How It Works
                        </Link>
                        <Link href="#active-builders" className={styles.col_link}>
                            Active Builders
                        </Link>
                        <Link href="#features" className={styles.col_link}>
                            Stack Matching
                        </Link>
                    </div>

                    <div className={styles.links_col}>
                        <span className={styles.col_heading}>Hackathons</span>
                        <Link href="#hackathons" className={styles.col_link}>
                            Upcoming Sprints
                        </Link>
                        <Link href="#hackathons" className={styles.col_link}>
                            Team Assembly
                        </Link>
                        <Link href="#hackathons" className={styles.col_link}>
                            Prize Showcase
                        </Link>
                        <Link href="#hackathons" className={styles.col_link}>
                            Leaderboard
                        </Link>
                    </div>

                    <div className={styles.links_col}>
                        <span className={styles.col_heading}>Resources</span>
                        <a
                            href="https://github.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className={styles.col_link}
                        >
                            GitHub Community
                        </a>
                        <Link href="/privacy" className={styles.col_link}>
                            Privacy Policy
                        </Link>
                        <Link href="/terms" className={styles.col_link}>
                            Terms of Service
                        </Link>
                        <Link href="/guidelines" className={styles.col_link}>
                            Pairing Guidelines
                        </Link>
                    </div>
                </div>

                <div className={styles.bottom_bar}>
                    <p>© {new Date().getFullYear()} HackPair. Built for developers by developers.</p>
                    <div className={styles.social_links}>
                        <a
                            href="https://github.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className={styles.social_icon}
                            aria-label="GitHub Repository"
                        >
                            <GithubIcon />
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;

