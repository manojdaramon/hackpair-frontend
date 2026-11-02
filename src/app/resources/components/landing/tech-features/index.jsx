/** React imports */
import React from "react";

/** Local imports */
import GithubIcon from "@/icons/common/github.svg";
import CodeIcon from "@/icons/common/code.svg";
import ShieldIcon from "@/icons/common/shield.svg";
import TerminalIcon from "@/icons/common/terminal.svg";

/** Styles */
import styles from "./tech-features.module.css";

/**
 * Technical features bento-matrix outlining HackPair's engineering-first advantages.
 *
 * @returns {React.ReactElement} The rendered TechFeatures component.
 */
const TechFeatures = () => {
    const features = [
        {
            title: "Verified Code Activity",
            description:
                "Profiles connect directly to GitHub. See authentic commit heatmaps, top languages, and public repositories before you initiate contact.",
            icon: GithubIcon,
        },
        {
            title: "Complementary Matching",
            description:
                "Our matching algorithms pair opposing technical disciplines (Frontend + Backend, Rust + UI) to construct perfectly balanced hackathon teams.",
            icon: CodeIcon,
        },
        {
            title: "Zero Spam & Scrapers",
            description:
                "No unsolicited recruiter spam or scrapers. Contact details and direct communication channels unlock solely upon mutual acceptance.",
            icon: ShieldIcon,
        },
        {
            title: "Pair Rooms & Repo Sync",
            description:
                "Once matched, spin up a private pairing session room, sync GitHub repo access, and commence pairing without friction.",
            icon: TerminalIcon,
        },
    ];

    return (
        <section id="features" className={styles.tech_features}>
            <div className={styles.container}>
                <div className={styles.section_header}>
                    <span className={styles.eyebrow}>Platform Advantages</span>
                    <h2 className={styles.title}>Why top builders pair on HackPair.</h2>
                    <p className={styles.description}>
                        Unlike generic social networks or Discord chaos, HackPair is strictly engineered
                        around the workflows of shipping software engineers.
                    </p>
                </div>

                <div className={styles.features_grid}>
                    {features.map((item) => {
                        const IconComponent = item.icon;
                        return (
                            <div key={item.title} className={styles.feature_card}>
                                <div className={styles.icon_wrapper}>
                                    <IconComponent />
                                </div>
                                <h3 className={styles.feature_title}>{item.title}</h3>
                                <p className={styles.feature_desc}>{item.description}</p>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

export default TechFeatures;

