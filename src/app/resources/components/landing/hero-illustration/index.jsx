/** React imports */
import React from "react";

/** Libraries */
import Image from "next/image";

/** Styles */
import styles from "./hero-illustration.module.css";

/**
 * Developer Vector Art illustration for the landing Hero section.
 * Visualizes two developers collaborating and pair programming on HackPair.
 *
 * @returns {React.ReactElement} The rendered HeroIllustration component.
 */
const HeroIllustration = () => {
    return (
        <div className={styles.illustration_container}>
            <div className={styles.image_frame}>
                <Image
                    src="/images/hero-pair-illustration.jpg"
                    alt="Two software developers collaborating and pair programming on HackPair"
                    width={560}
                    height={460}
                    priority
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 560px"
                    className={styles.hero_vector_image}
                />
            </div>
        </div>
    );
};

export default HeroIllustration;
