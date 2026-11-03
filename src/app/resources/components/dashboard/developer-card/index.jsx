"use client";

/** React imports */
import React, { useState } from "react";

/** Libraries */
import Image from "next/image";

/** Styles */
import styles from "./developer-card.module.css";

/**
 * Developer Card component presenting candidate profile in the HackPair feed.
 * Allows authenticated users to pass (ignore) or show interest (connect).
 *
 * @param {Object} props Component properties.
 * @param {Object} props.developer Candidate developer profile data.
 * @param {Function} props.onSendRequest Callback function taking status and userId.
 * @param {boolean} [props.isActing=false] Whether a network action is pending on this card.
 * @returns {React.ReactElement} Rendered DeveloperCard element.
 */
const DeveloperCard = ({ developer, onSendRequest, isActing = false }) => {
    const [imageError, setImageError] = useState(false);

    const {
        _id,
        firstName,
        lastName,
        photoUrl,
        age,
        gender,
        about,
        skills = [],
    } = developer;

    const fullName = `${firstName || ""} ${lastName || ""}`.trim() || "Anonymous Developer";
    const initials = (firstName?.charAt(0) || "D").toUpperCase();

    const metaParts = [];
    if (age) {
        metaParts.push(`${age} yrs`);
    }
    if (gender) {
        metaParts.push(gender.charAt(0).toUpperCase() + gender.slice(1));
    }
    const metaString = metaParts.join(" • ");

    /**
     * Handles passing on this developer profile.
     */
    const handlePass = () => {
        onSendRequest("ignored", _id);
    };

    /**
     * Handles expressing connection interest in this developer.
     */
    const handleConnect = () => {
        onSendRequest("interested", _id);
    };

    const displayBio =
        !about || about.trim().toLowerCase() === "this is a default about of the user!"
            ? "Passionate builder looking for hackathon teammates."
            : about;

    return (
        <div className={styles.developer_card}>
            <div className={styles.card_header}>
                <div className={styles.avatar_wrapper}>
                    {photoUrl && !imageError ? (
                        <Image
                            src={photoUrl}
                            alt={fullName}
                            fill
                            sizes="64px"
                            unoptimized={photoUrl.startsWith("data:")}
                            className={styles.avatar_image}
                            onError={() => setImageError(true)}
                        />
                    ) : (
                        <div className={styles.avatar_fallback}>{initials}</div>
                    )}
                </div>

                <div className={styles.header_info}>
                    <h3 className={styles.developer_name}>{fullName}</h3>
                    {metaString && <span className={styles.meta_info}>{metaString}</span>}
                </div>
            </div>

            <div className={styles.card_body}>
                <p className={styles.about_text}>{displayBio}</p>

                {skills.length > 0 && (
                    <div className={styles.skills_container}>
                        {skills.map((skill, index) => (
                            <span key={`${skill}-${index}`} className={styles.skill_pill}>
                                {skill}
                            </span>
                        ))}
                    </div>
                )}
            </div>

            <div className={styles.card_actions}>
                <button
                    type="button"
                    onClick={handlePass}
                    disabled={isActing}
                    className={styles.pass_btn}
                    aria-label={`Pass on ${fullName}`}
                >
                    <span>✕</span>
                    <span>Pass</span>
                </button>

                <button
                    type="button"
                    onClick={handleConnect}
                    disabled={isActing}
                    className={styles.connect_btn}
                    aria-label={`Connect with ${fullName}`}
                >
                    <span>🤝</span>
                    <span>Connect</span>
                </button>
            </div>
        </div>
    );
};

export default DeveloperCard;

