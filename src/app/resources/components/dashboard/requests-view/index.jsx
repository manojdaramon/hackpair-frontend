"use client";

/** React imports */
import React, { useState } from "react";

/** Libraries */
import Image from "next/image";

/** Styles */
import styles from "./requests-view.module.css";

/**
 * Requests View component displaying pending incoming connection requests.
 * Allows user to accept or reject candidates with real-time feedback.
 *
 * @param {Object} props Component properties.
 * @param {Array<Object>} [props.requests=[]] List of connection request documents.
 * @param {Function} props.onReview Callback function taking status and requestId.
 * @param {boolean} [props.isReviewing=false] Indicates whether a review operation is in flight.
 * @returns {React.ReactElement} Rendered RequestsView element.
 */
const RequestsView = ({ requests = [], onReview, isReviewing = false }) => {
    const [failedImages, setFailedImages] = useState({});

    /**
     * Marks an image load as failed to display fallback initials.
     *
     * @param {string} id Unique identifier for the user.
     */
    const handleImageError = (id) => {
        setFailedImages((prev) => ({ ...prev, [id]: true }));
    };

    if (requests.length === 0) {
        return (
            <div className={styles.requests_view}>
                <div className={styles.empty_state}>
                    <span className={styles.empty_icon}>📬</span>
                    <h3 className={styles.empty_title}>No Pending Requests</h3>
                    <p className={styles.empty_description}>
                        You don&apos;t have any pending connection requests right now. Keep your
                        profile updated and explore the feed to connect with others!
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.requests_view}>
            <div className={styles.requests_list}>
                {requests.map((request) => {
                    const sender = request.fromUserId || {};
                    const fullName =
                        `${sender.firstName || ""} ${sender.lastName || ""}`.trim() ||
                        "Fellow Developer";
                    const initials = (sender.firstName?.charAt(0) || "D").toUpperCase();
                    const hasImageError = failedImages[sender._id];

                    return (
                        <div key={request._id} className={styles.request_item}>
                            <div className={styles.sender_details}>
                                <div className={styles.avatar_wrapper}>
                                    {sender.photoUrl && !hasImageError ? (
                                        <Image
                                            src={sender.photoUrl}
                                            alt={fullName}
                                            fill
                                            sizes="56px"
                                            unoptimized={sender.photoUrl.startsWith("data:")}
                                            className={styles.avatar_image}
                                            onError={() => handleImageError(sender._id)}
                                        />
                                    ) : (
                                        <div className={styles.avatar_fallback}>
                                            {initials}
                                        </div>
                                    )}
                                </div>

                                <div className={styles.info}>
                                    <h4 className={styles.sender_name}>{fullName}</h4>
                                    <p className={styles.about_text}>
                                        {!sender.about ||
                                        sender.about.trim().toLowerCase() ===
                                            "this is a default about of the user!"
                                            ? "Interested in pairing up for upcoming hackathons."
                                            : sender.about}
                                    </p>

                                    {sender.skills && sender.skills.length > 0 && (
                                        <div className={styles.skills_container}>
                                            {sender.skills.map((skill, idx) => (
                                                <span
                                                    key={`${skill}-${idx}`}
                                                    className={styles.skill_tag}
                                                >
                                                    {skill}
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className={styles.actions}>
                                <button
                                    type="button"
                                    onClick={() => onReview("rejected", request._id)}
                                    disabled={isReviewing}
                                    className={styles.decline_btn}
                                >
                                    <span>✕</span>
                                    <span>Decline</span>
                                </button>

                                <button
                                    type="button"
                                    onClick={() => onReview("accepted", request._id)}
                                    disabled={isReviewing}
                                    className={styles.accept_btn}
                                >
                                    <span>✓</span>
                                    <span>Accept</span>
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default RequestsView;

