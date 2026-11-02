/** React imports */
import React from "react";

/** Local imports */
import Button from "@/components/common/button";
import CheckIcon from "@/icons/common/check.svg";

/** Styles */
import styles from "./cta-section.module.css";

/**
 * Bottom Call-to-Action section inspiring developers to pair up and start shipping.
 *
 * @returns {React.ReactElement} The rendered CtaSection component.
 */
const CtaSection = () => {
    return (
        <section id="hackathons" className={styles.cta_section}>
            <div className={styles.container}>
                <div className={styles.terminal_banner}>
                    <span className={styles.prompt_symbol}>$</span>
                    <span className={styles.command}>npx hackpair@latest --find-partner</span>
                </div>

                <h2 className={styles.headline}>
                    Ready to stop building complex projects in isolation?
                </h2>

                <p className={styles.subtext}>
                    Join 4,200+ software engineers assembling teams, pairing on weekend hacks,
                    and shipping real software together.
                </p>

                <div className={styles.cta_buttons}>
                    <Button href="/signup" variant="primary" showIcon>
                        Create Builder Profile
                    </Button>
                    <Button href="/feed" variant="secondary">
                        Browse Live Feed
                    </Button>
                </div>

                <div className={styles.trust_points}>
                    <div className={styles.point_item}>
                        <CheckIcon />
                        <span>100% Free for Open Source</span>
                    </div>
                    <div className={styles.point_item}>
                        <CheckIcon />
                        <span>No Credit Card Required</span>
                    </div>
                    <div className={styles.point_item}>
                        <CheckIcon />
                        <span>Verified GitHub Authentication</span>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default CtaSection;

