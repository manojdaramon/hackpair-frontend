"use client";

/** React imports */
import { useEffect, Suspense } from "react";

/** Libraries */
import { useRouter, useSearchParams } from "next/navigation";

/**
 * Client redirection component that inspects query parameters and forwards
 * to the appropriate dedicated page.
 *
 * @returns {null} Renders no UI elements.
 */
const DashboardRedirect = () => {
    const router = useRouter();
    const searchParams = useSearchParams();

    useEffect(() => {
        const tab = searchParams.get("tab");
        if (tab === "requests") {
            router.replace("/requests");
        } else if (tab === "connections") {
            router.replace("/connections");
        } else {
            router.replace("/feed");
        }
    }, [router, searchParams]);

    return null;
};

/**
 * Dashboard redirection entry point wrapped in Suspense boundary.
 *
 * @returns {React.ReactElement} Redirection wrapper.
 */
const DashboardPage = () => {
    return (
        <Suspense fallback={null}>
            <DashboardRedirect />
        </Suspense>
    );
};

export default DashboardPage;
