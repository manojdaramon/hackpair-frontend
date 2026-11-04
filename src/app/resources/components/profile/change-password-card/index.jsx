"use client";

/** React imports */
import React, { useState } from "react";

/** Libraries */
import toast from "react-hot-toast";

/** Local imports */
import api from "@/helpers/axios";
import EyeIcon from "@/icons/common/eye.svg";
import EyeOffIcon from "@/icons/common/eye-off.svg";

/** Styles */
import styles from "./change-password-card.module.css";

/**
 * Evaluates password string against backend security rules.
 *
 * @param {string} password Password to check.
 * @returns {Object} Security criteria results.
 */
const evaluatePassword = (password) => {
    return {
        minLength: password.length >= 8,
        hasUpper: /[A-Z]/.test(password),
        hasLower: /[a-z]/.test(password),
        hasNumber: /[0-9]/.test(password),
        hasSymbol: /[^A-Za-z0-9]/.test(password),
    };
};

/**
 * Change Password Card component managing secure password modifications.
 * Communicates with PATCH /profile/password.
 *
 * @returns {React.ReactElement} Rendered ChangePasswordCard component.
 */
const ChangePasswordCard = () => {
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const criteria = evaluatePassword(newPassword);

    /**
     * Validates input values before dispatching password change request.
     *
     * @returns {boolean} True if inputs pass validation.
     */
    const validate = () => {
        const errs = {};

        if (!currentPassword) {
            errs.currentPassword = "Current password is required";
        }

        if (!newPassword) {
            errs.newPassword = "New password is required";
        } else {
            const { minLength, hasUpper, hasLower, hasNumber, hasSymbol } = criteria;
            if (!minLength || !hasUpper || !hasLower || !hasNumber || !hasSymbol) {
                errs.newPassword =
                    "New password must be at least 8 characters and include uppercase, lowercase, number, and symbol";
            }
        }

        if (!confirmPassword) {
            errs.confirmPassword = "Confirm password is required";
        } else if (newPassword !== confirmPassword) {
            errs.confirmPassword = "Passwords do not match";
        }

        setErrors(errs);
        return Object.keys(errs).length === 0;
    };

    /**
     * Dispatches password change payload to PATCH /profile/password.
     *
     * @param {React.FormEvent<HTMLFormElement>} e Form submit event.
     */
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validate()) {
            return;
        }

        setIsSubmitting(true);

        try {
            const response = await api.patch("/profile/password", {
                currentPassword,
                newPassword,
            });

            toast.success(response.data || "Password changed successfully!");
            setCurrentPassword("");
            setNewPassword("");
            setConfirmPassword("");
            setErrors({});
        } catch (err) {
            const errorMsg =
                err.response?.data?.message ||
                err.response?.data ||
                err.message ||
                "Failed to change password";
            toast.error(errorMsg);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className={styles.password_card}>
            <div className={styles.card_header}>
                <h2 className={styles.card_title}>Security & Password</h2>
                <p className={styles.card_subtitle}>
                    Ensure your account stays secure by choosing a strong password.
                </p>
            </div>

            <form className={styles.password_form} onSubmit={handleSubmit} noValidate>
                <div className={styles.form_group}>
                    <label htmlFor="currentPassword" className={styles.form_label}>
                        Current Password
                    </label>
                    <div className={styles.password_wrapper}>
                        <input
                            id="currentPassword"
                            type={showCurrentPassword ? "text" : "password"}
                            value={currentPassword}
                            onChange={(e) => {
                                setCurrentPassword(e.target.value);
                                if (errors.currentPassword) {
                                    setErrors((prev) => ({ ...prev, currentPassword: "" }));
                                }
                            }}
                            placeholder="••••••••"
                            className={`${styles.input_field} ${errors.currentPassword ? styles.input_error : ""}`}
                            disabled={isSubmitting}
                            autoComplete="current-password"
                        />
                        <button
                            type="button"
                            onClick={() => setShowCurrentPassword((prev) => !prev)}
                            className={styles.password_toggle_btn}
                            aria-label={showCurrentPassword ? "Hide password" : "Show password"}
                            tabIndex={-1}
                        >
                            {showCurrentPassword ? <EyeOffIcon /> : <EyeIcon />}
                        </button>
                    </div>
                    {errors.currentPassword && (
                        <span className={styles.error_message}>{errors.currentPassword}</span>
                    )}
                </div>

                <div className={styles.form_group}>
                    <label htmlFor="newPassword" className={styles.form_label}>
                        New Password
                    </label>
                    <div className={styles.password_wrapper}>
                        <input
                            id="newPassword"
                            type={showNewPassword ? "text" : "password"}
                            value={newPassword}
                            onChange={(e) => {
                                setNewPassword(e.target.value);
                                if (errors.newPassword) {
                                    setErrors((prev) => ({ ...prev, newPassword: "" }));
                                }
                            }}
                            placeholder="••••••••"
                            className={`${styles.input_field} ${errors.newPassword ? styles.input_error : ""}`}
                            disabled={isSubmitting}
                            autoComplete="new-password"
                        />
                        <button
                            type="button"
                            onClick={() => setShowNewPassword((prev) => !prev)}
                            className={styles.password_toggle_btn}
                            aria-label={showNewPassword ? "Hide password" : "Show password"}
                            tabIndex={-1}
                        >
                            {showNewPassword ? <EyeOffIcon /> : <EyeIcon />}
                        </button>
                    </div>
                    {errors.newPassword && (
                        <span className={styles.error_message}>{errors.newPassword}</span>
                    )}
                </div>

                <div className={styles.password_checklist}>
                    <span
                        className={`${styles.checklist_item} ${criteria.minLength ? styles.checklist_valid : ""}`}
                    >
                        <span className={styles.check_icon}>{criteria.minLength ? "✓" : "○"}</span>
                        8+ chars
                    </span>
                    <span
                        className={`${styles.checklist_item} ${criteria.hasUpper ? styles.checklist_valid : ""}`}
                    >
                        <span className={styles.check_icon}>{criteria.hasUpper ? "✓" : "○"}</span>
                        Uppercase
                    </span>
                    <span
                        className={`${styles.checklist_item} ${criteria.hasLower ? styles.checklist_valid : ""}`}
                    >
                        <span className={styles.check_icon}>{criteria.hasLower ? "✓" : "○"}</span>
                        Lowercase
                    </span>
                    <span
                        className={`${styles.checklist_item} ${criteria.hasNumber ? styles.checklist_valid : ""}`}
                    >
                        <span className={styles.check_icon}>{criteria.hasNumber ? "✓" : "○"}</span>
                        Number
                    </span>
                    <span
                        className={`${styles.checklist_item} ${criteria.hasSymbol ? styles.checklist_valid : ""}`}
                    >
                        <span className={styles.check_icon}>{criteria.hasSymbol ? "✓" : "○"}</span>
                        Special symbol
                    </span>
                </div>

                <div className={styles.form_group}>
                    <label htmlFor="confirmPassword" className={styles.form_label}>
                        Confirm New Password
                    </label>
                    <div className={styles.password_wrapper}>
                        <input
                            id="confirmPassword"
                            type={showConfirmPassword ? "text" : "password"}
                            value={confirmPassword}
                            onChange={(e) => {
                                setConfirmPassword(e.target.value);
                                if (errors.confirmPassword) {
                                    setErrors((prev) => ({ ...prev, confirmPassword: "" }));
                                }
                            }}
                            placeholder="••••••••"
                            className={`${styles.input_field} ${errors.confirmPassword ? styles.input_error : ""}`}
                            disabled={isSubmitting}
                            autoComplete="new-password"
                        />
                        <button
                            type="button"
                            onClick={() => setShowConfirmPassword((prev) => !prev)}
                            className={styles.password_toggle_btn}
                            aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                            tabIndex={-1}
                        >
                            {showConfirmPassword ? <EyeOffIcon /> : <EyeIcon />}
                        </button>
                    </div>
                    {errors.confirmPassword && (
                        <span className={styles.error_message}>{errors.confirmPassword}</span>
                    )}
                </div>

                <button
                    type="submit"
                    disabled={isSubmitting}
                    className={styles.submit_btn}
                >
                    {isSubmitting ? "Updating..." : "Update Password"}
                </button>
            </form>
        </div>
    );
};

export default ChangePasswordCard;

