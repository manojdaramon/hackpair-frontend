/** React imports */
import React from "react";

/** Libraries */
import Link from "next/link";
import clsx from "clsx";

/** Local imports */
import RightArrowIcon from "@/icons/common/right-arrow.svg";

/** Styles */
import styles from "./button.module.css";

/**
 * Reusable Button component matching HackPair standards.
 * Dynamically renders either an anchor (via next/link) or an HTML button.
 *
 * @param {Object} props Component properties.
 * @param {string} [props.href] Navigation URL. Renders Next Link if provided.
 * @param {React.ReactNode} props.children Button inner content.
 * @param {"primary"|"secondary"|"outline"} [props.variant="primary"] Visual style variant.
 * @param {boolean} [props.showIcon=false] Whether to append a trailing arrow icon.
 * @param {string} [props.className] Additional CSS class overrides.
 * @returns {React.ReactElement} The rendered button or link element.
 */
const Button = ({
    href,
    children,
    variant = "primary",
    showIcon = false,
    className,
    ...rest
}) => {
    const buttonClasses = clsx(
        styles.button,
        styles[`variant_${variant}`],
        className
    );

    if (href) {
        return (
            <Link href={href} className={buttonClasses} {...rest}>
                <span>{children}</span>
                {showIcon && <RightArrowIcon />}
            </Link>
        );
    }

    return (
        <button className={buttonClasses} {...rest}>
            <span>{children}</span>
            {showIcon && <RightArrowIcon />}
        </button>
    );
};

export default Button;

