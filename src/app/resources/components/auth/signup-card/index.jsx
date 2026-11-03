"use client";

/** React imports */
import React, { useEffect, useState } from "react";

/** Libraries */
import Link from "next/link";
import { useRouter } from "next/navigation";

/** Local imports */
import { useAuth } from "@/context/AuthContext";

/** Styles */
import styles from "./signup-card.module.css";

/**
 * Checks whether the password fulfills specific security criteria required by the backend.
 *
 * @param {string} password The password to test.
 * @returns {Object} Object with boolean flags for each criterion.
 */
const getPasswordCriteria = (password) => {
    return {
        minLength: password.length >= 8,
        hasUpper: /[A-Z]/.test(password),
        hasLower: /[a-z]/.test(password),
        hasNumber: /[0-9]/.test(password),
        hasSymbol: /[^A-Za-z0-9]/.test(password),
    };
};

/**
 * Sign up Card client component managing controlled input states,
 * password security feedback, form validation, and registration integration with the backend.
 *
 * @returns {React.ReactElement} The rendered SignupCard component.
 */
const SignupCard = () => {
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        confirmPassword: "",
        skills: "",
        gender: "",
        age: "",
    });
    const [errors, setErrors] = useState({});
    const [serverError, setServerError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showAdditional, setShowAdditional] = useState(false);

    const { signup, user } = useAuth();
    const router = useRouter();

    /**
     * If user is already authenticated, redirect to the feed.
     */
    useEffect(() => {
        if (user) {
            router.push("/feed");
        }
    }, [user, router]);

    const passwordCriteria = getPasswordCriteria(formData.password);

    /**
     * Handles updating form state values and clears corresponding validation error.
     *
     * @param {string} field Form field key to update.
     * @returns {Function} Event handler function.
     */
    const handleInputChange = (field) => (e) => {
        const value = e.target.value;
        setFormData((prev) => ({ ...prev, [field]: value }));
        if (errors[field]) {
            setErrors((prev) => ({ ...prev, [field]: "" }));
        }
    };

    /**
     * Toggles optional profile fields accordion.
     */
    const handleToggleAdditional = () => {
        setShowAdditional((prev) => !prev);
    };

    /**
     * Validates all form input fields against backend business rules.
     *
     * @returns {boolean} True if all required fields are valid, false otherwise.
     */
    const validateForm = () => {
        const validationErrors = {};
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!formData.firstName.trim()) {
            validationErrors.firstName = "First name is required";
        } else if (formData.firstName.trim().length < 2) {
            validationErrors.firstName = "First name must be at least 2 characters";
        } else if (formData.firstName.trim().length > 50) {
            validationErrors.firstName = "First name cannot exceed 50 characters";
        }

        if (formData.lastName.trim().length > 50) {
            validationErrors.lastName = "Last name cannot exceed 50 characters";
        }

        if (!formData.email.trim()) {
            validationErrors.email = "Email address is required";
        } else if (!emailRegex.test(formData.email.trim())) {
            validationErrors.email = "Please enter a valid email address";
        }

        if (!formData.password) {
            validationErrors.password = "Password is required";
        } else {
            const { minLength, hasUpper, hasLower, hasNumber, hasSymbol } = passwordCriteria;
            if (!minLength || !hasUpper || !hasLower || !hasNumber || !hasSymbol) {
                validationErrors.password =
                    "Password must be at least 8 characters and include uppercase, lowercase, number, and symbol";
            }
        }

        if (!formData.confirmPassword) {
            validationErrors.confirmPassword = "Confirm password is required";
        } else if (formData.password !== formData.confirmPassword) {
            validationErrors.confirmPassword = "Passwords do not match";
        }

        if (formData.age) {
            const numAge = Number(formData.age);
            if (Number.isNaN(numAge) || numAge < 18 || numAge > 120) {
                validationErrors.age = "Age must be between 18 and 120";
            }
        }

        setErrors(validationErrors);
        return Object.keys(validationErrors).length === 0;
    };

    /**
     * Dispatches user registration payload to AuthProvider.
     *
     * @param {React.FormEvent<HTMLFormElement>} e Form submission event.
     */
    const handleSubmit = async (e) => {
        e.preventDefault();
        setServerError("");

        if (!validateForm()) {
            return;
        }

        const payload = {
            firstName: formData.firstName.trim(),
            email: formData.email.trim().toLowerCase(),
            password: formData.password,
        };

        if (formData.lastName.trim()) {
            payload.lastName = formData.lastName.trim();
        }

        if (formData.skills.trim()) {
            const parsedSkills = formData.skills
                .split(",")
                .map((skill) => skill.trim())
                .filter((skill) => skill.length > 0);
            if (parsedSkills.length > 0) {
                payload.skills = parsedSkills;
            }
        }

        if (formData.gender) {
            payload.gender = formData.gender;
        }

        if (formData.age) {
            payload.age = Number(formData.age);
        }

        setIsSubmitting(true);
        const result = await signup(payload);
        setIsSubmitting(false);

        if (!result.success) {
            setServerError(result.error);
        }
    };

    return (
        <div className={styles.signup_card}>
            <div className={styles.card_header}>
                <h1 className={styles.card_title}>Join HackPair</h1>
                <p className={styles.card_subtitle}>
                    Find your ideal hackathon partner and build amazing projects together
                </p>
            </div>

            {serverError && (
                <div className={styles.alert_box} role="alert">
                    <span>⚠️</span>
                    <span>{serverError}</span>
                </div>
            )}

            <form className={styles.signup_form} onSubmit={handleSubmit} noValidate>
                <div className={styles.form_row}>
                    <div className={styles.form_group}>
                        <label htmlFor="firstName" className={styles.form_label}>
                            First Name *
                        </label>
                        <input
                            id="firstName"
                            type="text"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleInputChange("firstName")}
                            placeholder="John"
                            className={`${styles.input_field} ${errors.firstName ? styles.input_error : ""}`}
                            autoComplete="given-name"
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
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleInputChange("lastName")}
                            placeholder="Doe"
                            className={`${styles.input_field} ${errors.lastName ? styles.input_error : ""}`}
                            autoComplete="family-name"
                            disabled={isSubmitting}
                        />
                        {errors.lastName && (
                            <span className={styles.error_message}>{errors.lastName}</span>
                        )}
                    </div>
                </div>

                <div className={styles.form_group}>
                    <label htmlFor="email" className={styles.form_label}>
                        Email Address *
                    </label>
                    <input
                        id="email"
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange("email")}
                        placeholder="john@example.com"
                        className={`${styles.input_field} ${errors.email ? styles.input_error : ""}`}
                        autoComplete="email"
                        disabled={isSubmitting}
                    />
                    {errors.email && (
                        <span className={styles.error_message}>{errors.email}</span>
                    )}
                </div>

                <div className={styles.form_row}>
                    <div className={styles.form_group}>
                        <label htmlFor="password" className={styles.form_label}>
                            Password *
                        </label>
                        <input
                            id="password"
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleInputChange("password")}
                            placeholder="••••••••"
                            className={`${styles.input_field} ${errors.password ? styles.input_error : ""}`}
                            autoComplete="new-password"
                            disabled={isSubmitting}
                        />
                        {errors.password && (
                            <span className={styles.error_message}>{errors.password}</span>
                        )}
                    </div>

                    <div className={styles.form_group}>
                        <label htmlFor="confirmPassword" className={styles.form_label}>
                            Confirm Password *
                        </label>
                        <input
                            id="confirmPassword"
                            type="password"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleInputChange("confirmPassword")}
                            placeholder="••••••••"
                            className={`${styles.input_field} ${errors.confirmPassword ? styles.input_error : ""}`}
                            autoComplete="new-password"
                            disabled={isSubmitting}
                        />
                        {errors.confirmPassword && (
                            <span className={styles.error_message}>{errors.confirmPassword}</span>
                        )}
                    </div>
                </div>

                <div className={styles.password_checklist}>
                    <span
                        className={`${styles.checklist_item} ${passwordCriteria.minLength ? styles.checklist_valid : ""}`}
                    >
                        <span className={styles.check_icon}>
                            {passwordCriteria.minLength ? "✓" : "○"}
                        </span>
                        8+ chars
                    </span>
                    <span
                        className={`${styles.checklist_item} ${passwordCriteria.hasUpper ? styles.checklist_valid : ""}`}
                    >
                        <span className={styles.check_icon}>
                            {passwordCriteria.hasUpper ? "✓" : "○"}
                        </span>
                        Uppercase
                    </span>
                    <span
                        className={`${styles.checklist_item} ${passwordCriteria.hasLower ? styles.checklist_valid : ""}`}
                    >
                        <span className={styles.check_icon}>
                            {passwordCriteria.hasLower ? "✓" : "○"}
                        </span>
                        Lowercase
                    </span>
                    <span
                        className={`${styles.checklist_item} ${passwordCriteria.hasNumber ? styles.checklist_valid : ""}`}
                    >
                        <span className={styles.check_icon}>
                            {passwordCriteria.hasNumber ? "✓" : "○"}
                        </span>
                        Number
                    </span>
                    <span
                        className={`${styles.checklist_item} ${passwordCriteria.hasSymbol ? styles.checklist_valid : ""}`}
                    >
                        <span className={styles.check_icon}>
                            {passwordCriteria.hasSymbol ? "✓" : "○"}
                        </span>
                        Special symbol
                    </span>
                </div>

                <div className={styles.form_group}>
                    <label htmlFor="skills" className={styles.form_label}>
                        <span>Primary Skills</span>
                        <span className={styles.label_optional}>(Optional)</span>
                    </label>
                    <input
                        id="skills"
                        type="text"
                        name="skills"
                        value={formData.skills}
                        onChange={handleInputChange("skills")}
                        placeholder="React, Next.js, Node.js, Python, Figma"
                        className={styles.input_field}
                        disabled={isSubmitting}
                    />
                    <span className={styles.field_hint}>
                        Separate your top skills with commas (e.g., React, Node.js, Python)
                    </span>
                </div>

                <button
                    type="button"
                    onClick={handleToggleAdditional}
                    className={styles.details_toggle_btn}
                >
                    <span>{showAdditional ? "▲ Hide" : "▼ Show"} Additional Profile Details</span>
                </button>

                {showAdditional && (
                    <div className={styles.details_section}>
                        <div className={styles.form_row}>
                            <div className={styles.form_group}>
                                <label htmlFor="age" className={styles.form_label}>
                                    <span>Age</span>
                                    <span className={styles.label_optional}>(Optional)</span>
                                </label>
                                <input
                                    id="age"
                                    type="number"
                                    name="age"
                                    min="18"
                                    max="120"
                                    value={formData.age}
                                    onChange={handleInputChange("age")}
                                    placeholder="24"
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
                                    name="gender"
                                    value={formData.gender}
                                    onChange={handleInputChange("gender")}
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
                    </div>
                )}

                <button
                    type="submit"
                    className={styles.submit_btn}
                    disabled={isSubmitting}
                >
                    {isSubmitting ? "Creating Account..." : "Create Account"}
                </button>
            </form>

            <div className={styles.card_footer}>
                <span>Already have an account?</span>
                <Link href="/login" className={styles.footer_link}>
                    Sign In
                </Link>
            </div>
        </div>
    );
};

export default SignupCard;

