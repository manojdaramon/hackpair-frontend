/** React imports */
import { useCallback, useEffect, useState } from "react";

/** Libraries */
import toast from "react-hot-toast";

/** Local imports */
import api from "@/helpers/axios";

/**
 * Custom hook to fetch feed recommendations and dispatch connection requests.
 *
 * @param {number} [initialPage=1] Initial page number to query.
 * @returns {Object} Feed state and actions.
 */
const useFeed = (initialPage = 1) => {
    const [feed, setFeed] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(initialPage);
    const [hasMore, setHasMore] = useState(true);

    /**
     * Imperatively fetches candidate developer profiles from the backend.
     *
     * @param {number} [targetPage=1] The page number to fetch.
     * @returns {Promise<void>}
     */
    const fetchFeed = useCallback(async (targetPage = 1) => {
        setLoading(true);
        try {
            const response = await api.get(`/feed?page=${targetPage}&limit=10`);
            const users = response.data?.data || [];
            setFeed(users);
            setHasMore(users.length === 10);
            setPage(targetPage);
        } catch (err) {
            const errorMsg =
                err.response?.data?.message ||
                err.response?.data ||
                err.message ||
                "Failed to fetch feed";
            toast.error(errorMsg);
        } finally {
            setLoading(false);
        }
    }, []);

    /**
     * Sends an 'interested' or 'ignored' connection request to a candidate developer.
     *
     * @param {"interested"|"ignored"} status Desired interaction status.
     * @param {string} toUserId Recipient developer's unique ID.
     * @returns {Promise<{success: boolean, error?: string}>} Operation outcome.
     */
    const sendRequest = async (status, toUserId) => {
        try {
            const response = await api.post(`/request/send/${status}/${toUserId}`);

            // Remove candidate immediately from local feed
            setFeed((prev) => prev.filter((user) => user._id !== toUserId));

            if (status === "interested") {
                toast.success("Interest sent! We'll notify you if they accept.");
            } else {
                toast("Profile passed", { icon: "👋" });
            }

            return { success: true, message: response.data?.message };
        } catch (err) {
            const errorMsg =
                err.response?.data?.message ||
                err.response?.data ||
                err.message ||
                "Failed to process connection request";
            toast.error(errorMsg);
            return { success: false, error: errorMsg };
        }
    };

    /**
     * Loads initial feed recommendations asynchronously without synchronous setState calls.
     */
    useEffect(() => {
        let isMounted = true;

        const loadInitialFeed = async () => {
            try {
                const response = await api.get(`/feed?page=${initialPage}&limit=10`);
                if (isMounted) {
                    const users = response.data?.data || [];
                    setFeed(users);
                    setHasMore(users.length === 10);
                }
            } catch (err) {
                if (isMounted) {
                    const errorMsg =
                        err.response?.data?.message ||
                        err.response?.data ||
                        err.message ||
                        "Failed to fetch feed";
                    toast.error(errorMsg);
                }
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        };

        loadInitialFeed();

        return () => {
            isMounted = false;
        };
    }, [initialPage]);

    return {
        feed,
        loading,
        page,
        hasMore,
        fetchFeed,
        sendRequest,
        setFeed,
    };
};

export default useFeed;
export { useFeed };
