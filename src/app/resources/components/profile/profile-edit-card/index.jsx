"use client";

/** React imports */
import React, { useRef, useState } from "react";

/** Libraries */
import Image from "next/image";
import toast from "react-hot-toast";

/** Local imports */
import { useAuth } from "@/hooks/use-auth";
import api from "@/helpers/axios";
import { compressImage } from "@/helpers/image";

/** Styles */
import styles from "./profile-edit-card.module.css";

/**
 * Profile Edit Card component allowing users to manage their public developer profile details
 * and upload avatars directly by selecting a photo from their device.
 *
 * @returns {React.ReactElement} Rendered ProfileEditCard component.
 */
const ProfileEditCard = () => {
    const { user, setUser } = useAuth();
    const fileInputRef = useRef(null);

    const isDefaultBio =
        user?.about &&
        user.about.trim().toLowerCase() === "this is a default about of the user!";

    const [formData, setFormData] = useState({
        firstName: user?.firstName || "",
        lastName: user?.lastName || "",
        photoUrl: user?.photoUrl || "",
        about: isDefaultBio ? "" : user?.about || "",
        gender: user?.gender || "",
        age: user?.age ? String(user.age) : "",
        skills: user?.skills ? user.skills.join(", ") : "",
    });

    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [imageError, setImageError] = useState(false);

    /**
     * Updates controlled form field state and clears validation error on change.
     *
     * @param {string} field Field identifier.
     * @returns {Function} Input change handler.
     */
    const handleChange = (field) => (e) => {
        const value = e.target.value;
        setFormData((prev) => ({ ...prev, [field]: value }));
        if (errors[field]) {
            setErrors((prev) => ({ ...prev, [field]: "" }));
        }
    };

    /**
     * Triggers the hidden native file picker dialog.
     */
    const handleAvatarClick = () => {
        fileInputRef.current?.click();
    };

    /**
     * Handles image file selection, compresses the image to a lightweight Base64 string,
     * and sets it as the avatar preview.
     *
     * @param {React.ChangeEvent<HTMLInputElement>} e File input change event.
     */
    const handleFileChange = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Reset file input value so re-selecting the same file triggers onChange
        e.target.value = "";

        if (!file.type.startsWith("image/")) {
            toast.error("Please select a valid image file (PNG, JPG, or WebP).");
            return;
        }

        // Limit file size to 5MB max before compression
        if (file.size > 5 * 1024 * 1024) {
            toast.error("Image file is too large. Please select a photo under 5MB.");
            return;
        }

        try {
            const dataUrl = await compressImage(file, 400, 400, 0.85);
            setFormData((prev) => ({ ...prev, photoUrl: dataUrl }));
            setImageError(false);
            toast.success("Photo selected! Click 'Save Profile' to apply changes.");
        } catch {
            toast.error("Failed to process image file. Please try another image.");
        }
    };

    /**
     * Removes the custom avatar and resets to fallback initials.
     */
    const handleRemovePhoto = () => {
        setFormData((prev) => ({ ...prev, photoUrl: "" }));
        setImageError(false);
    };

    /**
     * Validates edited fields before dispatching update request.
     *
     * @returns {boolean} True if inputs satisfy validation rules.
     */
    const validate = () => {
        const errs = {};

        if (!formData.firstName.trim()) {
            errs.firstName = "First name is required";
        } else if (formData.firstName.trim().length < 2) {
            errs.firstName = "First name must be at least 2 characters";
        } else if (formData.firstName.trim().length > 50) {
            errs.firstName = "First name cannot exceed 50 characters";
        }

        if (formData.lastName.trim().length > 50) {
            errs.lastName = "Last name cannot exceed 50 characters";
        }

        if (formData.about.length > 500) {
            errs.about = "About cannot exceed 500 characters";
        }

        if (formData.age) {
            const num = Number(formData.age);
            if (Number.isNaN(num) || num < 18 || num > 120) {
                errs.age = "Age must be between 18 and 120";
            }
        }

        setErrors(errs);
        return Object.keys(errs).length === 0;
    };

    /**
     * Dispatches profile changes to PATCH /profile/edit.
     *
     * @param {React.FormEvent<HTMLFormElement>} e Form submit event.
     */
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validate()) {
            return;
        }

        setIsSubmitting(true);

        const payload = {
            firstName: formData.firstName.trim(),
        };

        if (formData.lastName !== undefined) {
            payload.lastName = formData.lastName.trim();
        }

        if (formData.photoUrl) {
            payload.photoUrl = formData.photoUrl;
        }

        if (formData.about !== undefined) {
            payload.about = formData.about.trim();
        }

        if (formData.gender) {
            payload.gender = formData.gender;
        }

        if (formData.age) {
            payload.age = Number(formData.age);
        }

        if (formData.skills !== undefined) {
            const parsedSkills = formData.skills
                .split(",")
                .map((s) => s.trim())
                .filter(Boolean);
            payload.skills = parsedSkills;
        }

        try {
            const response = await api.patch("/profile/edit", payload);
            const updatedUser = response.data?.data;
            if (updatedUser) {
                setUser(updatedUser);
            }
            toast.success(
                response.data?.message || "Profile updated successfully!"
            );
        } catch (err) {
            const errorMsg =
                err.response?.data?.message ||
                err.response?.data ||
                err.message ||
                "Failed to update profile";
            toast.error(errorMsg);
        } finally {
            setIsSubmitting(false);
        }
    };

    const parsedSkillsList = formData.skills
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);

    const displayName = `${formData.firstName} ${formData.lastName}`.trim() || "Developer";
    const initials = (formData.firstName?.charAt(0) || "D").toUpperCase();

    return (
        <div className={styles.edit_card}>
            <div className={styles.card_header}>
                <h2 className={styles.card_title}>Profile Information</h2>
                <p className={styles.card_subtitle}>
                    Update your public developer persona and hackathon preferences.
                </p>
            </div>

            <div className={styles.avatar_section}>
                {/* Hidden native file input */}
                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/png, image/jpeg, image/webp"
                    style={{ display: "none" }}
                    onChange={handleFileChange}
                    aria-label="Upload profile photo"
                />

                <div
                    className={styles.avatar_upload_trigger}
                    onClick={handleAvatarClick}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                            handleAvatarClick();
                        }
                    }}
                    title="Click to select a new photo"
                >
                    {formData.photoUrl && !imageError ? (
                        <Image
                            src={formData.photoUrl}
                            alt={displayName}
                            fill
                            sizes="88px"
                            unoptimized={formData.photoUrl.startsWith("data:")}
                            className={styles.avatar_image}
                            onError={() => setImageError(true)}
                        />
                    ) : (
                        <div className={styles.avatar_fallback}>{initials}</div>
                    )}

                    <div className={styles.avatar_overlay}>
                        <span className={styles.camera_icon}>📷</span>
                        <span>Change</span>
                    </div>
                </div>

                <div className={styles.avatar_actions}>
                    <span className={styles.avatar_name}>{displayName}</span>

                    <div className={styles.button_row}>
                        <button
                            type="button"
                            onClick={handleAvatarClick}
                            className={styles.upload_btn}
                        >
                            <span>📷</span>
                            <span>Upload Photo</span>
                        </button>

                        {formData.photoUrl && (
                            <button
                                type="button"
                                onClick={handleRemovePhoto}
                                className={styles.remove_btn}
                            >
                                Remove
                            </button>
                        )}
                    </div>

                    <span className={styles.avatar_hint}>
                        JPG, PNG, or WebP up to 5MB. Click photo to choose from your device.
                    </span>
                </div>
            </div>

            <form className={styles.edit_form} onSubmit={handleSubmit} noValidate>
                <div className={styles.form_row}>
                    <div className={styles.form_group}>
                        <label htmlFor="firstName" className={styles.form_label}>
                            First Name *
                        </label>
                        <input
                            id="firstName"
                            type="text"
                            value={formData.firstName}
                            onChange={handleChange("firstName")}
                            placeholder="John"
                            className={`${styles.input_field} ${errors.firstName ? styles.input_error : ""}`}
                            disabled={isSubmitting}
                        />
                        {errors.firstName && (
                            <span className={styles.error_message}>{errors.firstName}</span>
                        )}
                    </div>

                    <div className={styles.form_group}>
                        <label htmlFor="lastName" className={styles.form_label}>
                            <span>Last Name</span>
                            <span className={styles.label_optional}>(Optional)</span>
                        </label>
                        <input
                            id="lastName"
                            type="text"
                            value={formData.lastName}
                            onChange={handleChange("lastName")}
                            placeholder="Doe"
                            className={`${styles.input_field} ${errors.lastName ? styles.input_error : ""}`}
                            disabled={isSubmitting}
                        />
                        {errors.lastName && (
                            <span className={styles.error_message}>{errors.lastName}</span>
                        )}
                    </div>
                </div>

                <div className={styles.form_group}>
                    <label htmlFor="email" className={styles.form_label}>
                        <span>Email Address</span>
                        <span className={styles.label_optional}>🔒 Read-only</span>
                    </label>
                    <input
                        id="email"
                        type="email"
                        value={user?.email || ""}
                        disabled
                        className={styles.input_field}
                    />
                </div>

                <div className={styles.form_row}>
                    <div className={styles.form_group}>
                        <label htmlFor="age" className={styles.form_label}>
                            <span>Age</span>
                            <span className={styles.label_optional}>(Optional)</span>
                        </label>
                        <input
                            id="age"
                            type="number"
                            min="18"
                            max="120"
                            value={formData.age}
                            onChange={handleChange("age")}
                            placeholder="25"
                            className={`${styles.input_field} ${errors.age ? styles.input_error : ""}`}
                            disabled={isSubmitting}
                        />
                        {errors.age && (
                            <span className={styles.error_message}>{errors.age}</span>
                        )}
                    </div>

                    <div className={styles.form_group}>
                        <label htmlFor="gender" className={styles.form_label}>
                            <span>Gender</span>
                            <span className={styles.label_optional}>(Optional)</span>
                        </label>
                        <select
                            id="gender"
                            value={formData.gender}
                            onChange={handleChange("gender")}
                            className={styles.select_field}
                            disabled={isSubmitting}
                        >
                            <option value="">Select gender</option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                            <option value="others">Other / Non-binary</option>
                        </select>
                    </div>
                </div>

                <div className={styles.form_group}>
                    <label htmlFor="skills" className={styles.form_label}>
                        <span>Skills & Technologies</span>
                        <span className={styles.label_optional}>(Comma-separated)</span>
                    </label>
                    <input
                        id="skills"
                        type="text"
                        value={formData.skills}
                        onChange={handleChange("skills")}
                        placeholder="React, Next.js, Node.js, Python, TypeScript"
                        className={styles.input_field}
                        disabled={isSubmitting}
                    />
                    {parsedSkillsList.length > 0 && (
                        <div className={styles.skills_preview}>
                            {parsedSkillsList.map((skill, idx) => (
                                <span key={`${skill}-${idx}`} className={styles.skill_pill}>
                                    {skill}
                                </span>
                            ))}
                        </div>
                    )}
                </div>

                <div className={styles.form_group}>
                    <label htmlFor="about" className={styles.form_label}>
                        <span>About / Bio</span>
                        <span className={styles.label_optional}>Max 500 characters</span>
                    </label>
                    <textarea
                        id="about"
                        rows={4}
                        value={formData.about}
                        onChange={handleChange("about")}
                        placeholder="Tell potential teammates about your interests, preferred tech stack, and hackathon goals..."
                        className={`${styles.textarea_field} ${errors.about ? styles.input_error : ""}`}
                        disabled={isSubmitting}
                    />
                    <div className={styles.field_meta}>
                        {errors.about ? (
                            <span className={styles.error_message}>{errors.about}</span>
                        ) : (
                            <span />
                        )}
                        <span>{formData.about.length}/500</span>
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={isSubmitting}
                    className={styles.submit_btn}
                >
                    {isSubmitting ? "Saving Changes..." : "Save Profile"}
                </button>
            </form>
        </div>
    );
};

export default ProfileEditCard;
