/** React imports */
import React from "react";

/** Local imports */
import CodeIcon from "@/icons/common/code.svg";
import SparklesIcon from "@/icons/common/sparkles.svg";
import UsersIcon from "@/icons/common/users.svg";

/** Styles */
import styles from "./how-it-works.module.css";

/**
 * How It Works section breaking down stack alignment, complementary pairing, and session start.
 *
 * @returns {React.ReactElement} The rendered HowItWorks component.
 */
const HowItWorks = () => {
    const steps = [
        {
            number: "01",
            title: "List your stack & project goals",
            description:
                "Declare your core languages and what you're building. Whether you're entering a hackathon, shipping a side project, or contributing to open source.",
            icon: CodeIcon,
            preview: [
                { key: "your_strength", val: "React / Three.js" },
                { key: "seeking", val: "Go / Microservices" },
                { key: "commitment", val: "Weekend Sprint" },
            ],
        },
        {
            number: "02",
            title: "Find complementary developers",
            description:
                "Filter developers by tech stack, timezone, and recent GitHub commits. Connect with builders whose strengths balance your technical gaps.",
            icon: SparklesIcon,
            preview: [
                { key: "stack_coverage", val: "100% Full-Stack" },
                { key: "timezone_overlap", val: "6h Overlap" },
                { key: "github_sync", val: "Active Within 24h" },
            ],
        },
        {
            number: "03",
            title: "Send a request & start building",
            description:
                "Mutual opt-in only—no spam or unsolicited recruiter messages. When both developers accept, share repos, hop into Discord, and start coding.",
            icon: UsersIcon,
            preview: [
                { key: "status", val: "Mutually Connected" },
                { key: "repo_access", val: "Granted" },
                { key: "session", val: "Ready to Pair" },
            ],
        },
    ];

    return (
        <section id="how-it-works" className={styles.how_it_works}>
            <div className={styles.container}>
                <div className={styles.section_header}>
                    <span className={styles.eyebrow}>Simple 3-Step Process</span>
                    <h2 className={styles.title}>How pairing works on HackPair.</h2>
                    <p className={styles.description}>
                        Designed to bypass the friction of traditional networking so you can focus on building.
                    </p>
                </div>

                <div className={styles.steps_grid}>
                    {steps.map((step) => {
                        const IconComponent = step.icon;
                        return (
                            <div key={step.number} className={styles.step_card}>
                                <div className={styles.step_top}>
                                    <span className={styles.step_index}>STEP {step.number}</span>
                                    <div className={styles.step_icon_box}>
                                        <IconComponent />
                                    </div>
                                </div>

                                <h3 className={styles.step_title}>{step.title}</h3>
                                <p className={styles.step_desc}>{step.description}</p>

                                <div className={styles.preview_box}>
                                    {step.preview.map((row) => (
                                        <div key={row.key} className={styles.preview_row}>
                                            <span className={styles.key}>{row.key}:</span>
                                            <span className={styles.val}>&quot;{row.val}&quot;</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

export default HowItWorks;
