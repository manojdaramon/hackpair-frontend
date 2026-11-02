/** React imports */
import React from "react";

/** Local imports */
import Button from "@/components/common/button";
import HeroIllustration from "@/components/landing/hero-illustration";

/** Styles */
import styles from "./hero-section.module.css";

/**
 * Landing Hero Section featuring developer-focused value proposition and pair illustration.
 *
 * @returns {React.ReactElement} The rendered HeroSection component.
 */
const HeroSection = () => {
    return (
        <section className={styles.hero_section}>
            <div className={styles.container}>
                <div className={styles.content_col}>
                    <div className={styles.badge_pill}>
                        <span className={styles.badge_dot} />
                        <span>Winter Hackathon Season Live</span>
                    </div>

                    <h1 className={styles.headline}>
                        Find a coding partner for your next{" "}
                        <span className={styles.highlight_text}>project or hackathon.</span>
                    </h1>

                    <p className={styles.subtext}>
                        Stop searching through noisy Discord channels and dead Reddit threads.
                        Connect with developers by tech stack, timezone, and verified GitHub activity.
                    </p>

                    <div className={styles.cta_group}>
                        <Button href="/signup" variant="primary" showIcon>
                            Browse Active Builders
                        </Button>
                        <Button href="#how-it-works" variant="secondary">
                            How It Works
                        </Button>
                    </div>
                </div>

                <div className={styles.visual_col}>
                    <HeroIllustration />
                </div>
            </div>
        </section>
    );
};

export default HeroSection;
