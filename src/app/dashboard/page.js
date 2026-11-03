/** Libraries */
import { redirect } from "next/navigation";

export const metadata = {
    title: "Redirecting to Feed...",
};

/**
 * Dashboard redirection handler.
 * Seamlessly forwards traffic from legacy /dashboard URLs to dedicated /feed,
 * /requests, or /connections routes while preserving query intent.
 *
 * @param {Object} props Component properties.
 * @param {Promise<{tab?: string}>} props.searchParams URL search parameters.
 */
const DashboardPage = async ({ searchParams }) => {
    const params = await searchParams;
    const tab = params?.tab;

    if (tab === "requests") {
        redirect("/requests");
    }

    if (tab === "connections") {
        redirect("/connections");
    }

    redirect("/feed");
};

export default DashboardPage;
