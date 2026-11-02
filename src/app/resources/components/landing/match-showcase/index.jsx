/** React imports */
import React from "react";

/** Libraries */
import Link from "next/link";

/** Local imports */
import Button from "@/components/common/button";
import GithubIcon from "@/icons/common/github.svg";
import RightArrowIcon from "@/icons/common/right-arrow.svg";

/** Styles */
import styles from "./match-showcase.module.css";

/**
 * Showcase component highlighting real-time developers currently looking for hackathon or side-project partners.
 *
 * @returns {React.ReactElement} The rendered MatchShowcase component.
 */
const MatchShowcase = () => {
    const builders = [
        {
            initials: "ER",
            name: "Elena Rostova",
            location: "Full-Stack Dev • Berlin (UTC+1)",
            hackathon: "Devpost Open Source Sprint",
            description:
                "Architecting an open-source alternative to Datadog for local SQLite and edge workers. Looking for an eBPF or Rust systems dev to co-build kernel telemetry.",
            stack: ["TypeScript", "Next.js", "Rust", "eBPF", "ClickHouse"],
            commits: "782 commits this year",
        },
        {
            initials: "KT",
            name: "Kaito Tanaka",
            location: "ML Systems Engineer • Tokyo (UTC+9)",
            hackathon: "HuggingFace Agentic Sprint",
            description:
                "Quantizing reasoning models for local edge execution. Need a React or WebGL developer to build the interactive latency profiling dashboard.",
            stack: ["Python", "PyTorch", "CUDA", "FastAPI", "React"],
            commits: "640 commits this year",
        },
        {
            initials: "DR",
            name: "Devon Riley",
            location: "Backend Systems • Austin (UTC-6)",
            hackathon: "YC Winter Hackathon",
            description:
                "Building a peer-to-peer collaborative editor powered by local CRDTs. Seeking a frontend UI/UX wizard to craft the multi-cursor syntax canvas.",
            stack: ["Go", "WebSockets", "CRDTs", "PostgreSQL", "Tailwind"],
            commits: "910 commits this year",
        },
        {
            initials: "AP",
            name: "Aaliyah Patel",
            location: "Frontend & Web3 • London (UTC+0)",
            hackathon: "ETHGlobal London",
            description:
                "Designing high-frequency liquidity pools and decentralized perp dashboards. Looking for a Solidity/EVM smart contract developer.",
            stack: ["React 19", "Ethers.js", "Solidity", "TypeScript", "Vite"],
            commits: "495 commits this year",
        },
    ];

    return (
        <section id="active-builders" className={styles.match_showcase}>
            <div className={styles.container}>
                <div className={styles.section_header}>
                    <div className={styles.header_text}>
                        <span className={styles.eyebrow}>Active Pair Board</span>
                        <h2 className={styles.title}>Developers seeking teammates right now.</h2>
                    </div>
                    <Button href="/feed" variant="secondary" showIcon>
                        View All Active Builders
                    </Button>
                </div>

                <div className={styles.builders_grid}>
                    {builders.map((builder) => (
                        <div key={builder.name} className={styles.builder_card}>
                            <div className={styles.builder_top}>
                                <div className={styles.builder_info}>
                                    <div className={styles.avatar_badge}>
                                        <span>{builder.initials}</span>
                                    </div>
                                    <div className={styles.meta}>
                                        <span className={styles.name}>{builder.name}</span>
                                        <span className={styles.location}>{builder.location}</span>
                                    </div>
                                </div>
                                <span className={styles.badge_hackathon}>{builder.hackathon}</span>
                            </div>

                            <p className={styles.project_description}>{builder.description}</p>

                            <div className={styles.stack_list}>
                                {builder.stack.map((item) => (
                                    <span key={item} className={styles.stack_item}>
                                        {item}
                                    </span>
                                ))}
                            </div>

                            <div className={styles.card_footer}>
                                <div className={styles.commits_meta}>
                                    <GithubIcon />
                                    <span className={styles.highlight}>{builder.commits}</span>
                                </div>
                                <Link href="/signup" className={styles.connect_btn}>
                                    <span>Pair with {builder.name.split(" ")[0]}</span>
                                    <RightArrowIcon />
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default MatchShowcase;

