/** React imports */
import React from "react";

/** Libraries */
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "react-hot-toast";

/** Local imports */
import Header from "@/components/common/header";
import Footer from "@/components/common/footer";
import SeoData from "@/models/seo.json";
import { SITE_URL } from "@/helpers/site";
import { AuthProvider } from "@/context/AuthContext";

/** Styles */
import "./globals.css";

const geistSans = Geist({
    variable: "--font-primary",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-mono",
    subsets: ["latin"],
});

export const metadata = {
    metadataBase: new URL(SITE_URL),
    title: {
        default: SeoData.tagline,
        template: `%s | ${SeoData.siteName}`,
    },
    description: SeoData.description,
    applicationName: SeoData.siteName,
    keywords: SeoData.defaultKeywords,
    authors: [{ name: SeoData.siteName, url: SITE_URL }],
    creator: SeoData.siteName,
    publisher: SeoData.siteName,
    category: SeoData.category,
    openGraph: {
        siteName: SeoData.siteName,
        type: "website",
        locale: SeoData.locale,
    },
    icons: {
        icon: "/icons/common/logo.svg",
        shortcut: "/icons/common/logo.svg",
        apple: "/icons/common/logo.svg",
    },
};

/**
 * Root Application Layout.
 * Configures global typography, site chrome (Header and Footer), and toast alerts.
 *
 * @param {Object} props Component properties.
 * @param {React.ReactNode} props.children Child page elements.
 * @returns {React.ReactElement} Root HTML shell.
 */
const RootLayout = ({ children }) => {
    return (
        <html
            lang="en"
            className={`${geistSans.variable} ${geistMono.variable}`}
            suppressHydrationWarning
        >
            <body suppressHydrationWarning>
                <Toaster
                    position="top-right"
                    toastOptions={{
                        duration: 4000,
                        style: {
                            fontFamily: "var(--font-primary), sans-serif",
                            fontSize: "14px",
                            fontWeight: "500",
                            borderRadius: "8px",
                            background: "#ffffff",
                            color: "#0f172a",
                            border: "1px solid #e2e8f0",
                            boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.08)",
                        },
                    }}
                />
                <AuthProvider>
                    <Header />
                    <main>{children}</main>
                    <Footer />
                </AuthProvider>
            </body>
        </html>
    );
};

export default RootLayout;
