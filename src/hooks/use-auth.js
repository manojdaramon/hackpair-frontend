/** Local imports */
import { useAuth } from "@/context/AuthContext";

/**
 * Custom hook returning current authentication context state and actions.
 *
 * @returns {Object} Authentication context object containing user, loading, login, signup, logout.
 */
const useAuthHook = () => {
    return useAuth();
};

export default useAuthHook;
export { useAuth };

