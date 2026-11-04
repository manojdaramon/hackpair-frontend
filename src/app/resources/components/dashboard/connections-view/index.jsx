"use client";

/** React imports */
import React, { useState } from "react";

/** Libraries */
import Image from "next/image";
import Link from "next/link";

/** Styles */
import styles from "./connections-view.module.css";

/**
 * Connections View component displaying the list of matched developer partners.
 *
 * @param {Object} props Component properties.
 * @param {Array<Object>} [props.connections=[]] List of accepted partner user documents.
 * @returns {React.ReactElement} Rendered ConnectionsView element.
 */
const ConnectionsView = ({ connections = [] }) => {
    const [failedImages, setFailedImages] = useState({});

    /**
     * Records image failure to fallback gracefully to styled initials.
     *
     * @param {string} id User ID.
     */
    const handleImageError = (id) => {
        setFailedImages((prev) => ({ ...prev, [id]: true }));
    };

    if (connections.length === 0) {
        return (
            <div className={styles.connections_view}>
                <div className={styles.empty_state}>
                    <span className={styles.empty_icon}>👥</span>
                    <h3 className={styles.empty_title}>No Connections Yet</h3>
                    <p className={styles.empty_description}>
                        You haven&apos;t paired up with any developers yet. Head over to the
                        Feed to send requests or check your incoming requests!
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.connections_view}>
            <div className={styles.connections_grid}>
                {connections.map((partner) => {
                    const fullName =
                        `${partner.firstName || ""} ${partner.lastName || ""}`.trim() ||
                        "Hackathon Partner";
                    const initials = (partner.firstName?.charAt(0) || "P").toUpperCase();
                    const hasImageError = failedImages[partner._id];

                    return (
                        <div key={partner._id} className={styles.connection_card}>
                            <div className={styles.avatar_wrapper}>
                                {partner.photoUrl && !hasImageError ? (
                                    <Image
                                        src={partner.photoUrl}
                                        alt={fullName}
                                        fill
                                        sizes="72px"
                                        unoptimized={partner.photoUrl.startsWith("data:")}
                                        className={styles.avatar_image}
                                        onError={() => handleImageError(partner._id)}
                                    />
                                ) : (
                                    <div className={styles.avatar_fallback}>
                                        {initials}
                                    </div>
                                )}
                            </div>

                            <h4 className={styles.partner_name}>{fullName}</h4>

                            <p className={styles.about_text}>
                                {!partner.about ||
                                partner.about.trim().toLowerCase() ===
                                    "this is a default about of the user!"
                                    ? "Connected hackathon partner ready to collaborate."
                                    : partner.about}
                            </p>

                            {partner.skills && partner.skills.length > 0 && (
                                <div className={styles.skills_container}>
                                    {partner.skills.slice(0, 5).map((skill, idx) => (
                                        <span
                                            key={`${skill}-${idx}`}
                                            className={styles.skill_tag}
                                        >
                                            {skill}
                                        </span>
                                    ))}
                                </div>
                            )}

                            <div className={styles.card_footer}>
                                <span className={styles.status_badge}>
                                    <span className={styles.badge_dot} />
                                    Connected
                                </span>
                                <Link
                                    href={`/chat?userId=${partner._id}`}
                                    className={styles.chat_btn}
                                    title={`Chat with ${partner.firstName || "partner"}`}
                                >
                                    <span>💬</span>
                                    <span>Chat</span>
                                </Link>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default ConnectionsView;

