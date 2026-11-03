/** React imports */
import { useCallback, useEffect, useState } from "react";

/** Libraries */
import toast from "react-hot-toast";

/** Local imports */
import api from "@/helpers/axios";

/**
 * Custom hook to manage accepted user connections and pending received requests.
 *
 * @returns {Object} Connections state, received requests, and review action methods.
 */
const useConnections = () => {
    const [connections, setConnections] = useState([]);
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);

    /**
     * Fetches all accepted connections for the authenticated user.
     *
     * @returns {Promise<void>}
     */
    const fetchConnections = useCallback(async () => {
        try {
            const response = await api.get("/user/connections");
            setConnections(response.data?.data || []);
        } catch (err) {
            const errorMsg =
                err.response?.data?.message ||
                err.response?.data ||
                err.message ||
                "Failed to fetch connections";
            toast.error(errorMsg);
        }
    }, []);

    /**
     * Fetches all pending connection requests received by the user.
     *
     * @returns {Promise<void>}
     */
    const fetchRequests = useCallback(async () => {
        try {
            const response = await api.get("/user/requests/received");
            setRequests(response.data?.data || []);
        } catch (err) {
            const errorMsg =
                err.response?.data?.message ||
                err.response?.data ||
                err.message ||
                "Failed to fetch requests";
            toast.error(errorMsg);
        }
    }, []);

    /**
     * Reloads all connections and requests data imperatively on demand.
     *
     * @returns {Promise<void>}
     */
    const fetchAllData = useCallback(async () => {
        setLoading(true);
        try {
            const [connRes, reqRes] = await Promise.all([
                api.get("/user/connections"),
                api.get("/user/requests/received"),
            ]);
            setConnections(connRes.data?.data || []);
            setRequests(reqRes.data?.data || []);
        } catch (err) {
            const errorMsg =
                err.response?.data?.message ||
                err.response?.data ||
                err.message ||
                "Failed to refresh connections";
            toast.error(errorMsg);
        } finally {
            setLoading(false);
        }
    }, []);

    /**
     * Reviews a pending connection request with an accepted or rejected verdict.
     *
     * @param {"accepted"|"rejected"} status Verdict for the connection request.
     * @param {string} requestId Unique connection request identifier.
     * @returns {Promise<{success: boolean, error?: string}>} Review outcome.
     */
    const reviewRequest = async (status, requestId) => {
        try {
            const response = await api.post(`/request/review/${status}/${requestId}`);

            // Remove reviewed request from pending list
            setRequests((prev) => prev.filter((req) => req._id !== requestId));

            if (status === "accepted") {
                toast.success("Request accepted! You are now connected.");
                await fetchConnections();
            } else {
                toast("Request rejected", { icon: "👋" });
            }

            return { success: true, message: response.data?.message };
        } catch (err) {
            const errorMsg =
                err.response?.data?.message ||
                err.response?.data ||
                err.message ||
                "Failed to review request";
            toast.error(errorMsg);
            return { success: false, error: errorMsg };
        }
    };

    /**
     * Asynchronously loads connections and requests without synchronous setState in effect.
     */
    useEffect(() => {
        let isMounted = true;

        const loadInitialData = async () => {
            try {
                const [connRes, reqRes] = await Promise.all([
                    api.get("/user/connections"),
                    api.get("/user/requests/received"),
                ]);
                if (isMounted) {
                    setConnections(connRes.data?.data || []);
                    setRequests(reqRes.data?.data || []);
                }
            } catch (err) {
                if (isMounted) {
                    const errorMsg =
                        err.response?.data?.message ||
                        err.response?.data ||
                        err.message ||
                        "Failed to load connections";
                    toast.error(errorMsg);
                }
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        };

        loadInitialData();

        return () => {
            isMounted = false;
        };
    }, []);

    return {
        connections,
        requests,
        loading,
        fetchConnections,
        fetchRequests,
        reviewRequest,
        fetchAllData,
    };
};

export default useConnections;
export { useConnections };
