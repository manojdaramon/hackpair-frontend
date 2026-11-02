/** React imports */
import React from "react";

/** Local imports */
import HeroSection from "@/components/landing/hero-section";
import HowItWorks from "@/components/landing/how-it-works";
import MatchShowcase from "@/components/landing/match-showcase";
import TechFeatures from "@/components/landing/tech-features";
import CtaSection from "@/components/landing/cta-section";

/** Styles */
import styles from "./page.module.css";

/**
 * Main Landing Page for HackPair.
 * Composes the five core landing sections into a unified developer matchmaking experience.
 *
 * @returns {React.ReactElement} The rendered HomePage component.
 */
const HomePage = () => {
    return (
        <div className={styles.landing_page}>
            <HeroSection />
            <HowItWorks />
            <MatchShowcase />
            <TechFeatures />
            <CtaSection />
        </div>
    );
};

export default HomePage;
