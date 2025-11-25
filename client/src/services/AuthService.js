import axios from "axios";

// Base API URL pulled from environment configuration
const baseURL = import.meta.env.VITE_API_BASE_URL;

// Axios instance configured for authenticated requests
const api = axios.create({
    baseURL: baseURL,
    withCredentials: true,
});

export class AuthService {

    /**
     * Logs in a user with provided credentials
     * @param {Object} param0
     * @param {string} param0.email - User's email
     * @param {string} param0.password - User's password
     * @returns {Promise<Object>} Response data or error object
     */
    async loginUser({ email, password }) {
        try {
            // Sending login request to the server
            const response = await api.post("/api/users/login", { email, password });
            return response;
        } catch (error) {
            console.log("AuthService :: loginUser :: error ::", error);
            return error;
        }
    }

    /**
     * Logs out the current user
     * @returns {Promise<Object>} Response data or error object
     */
    async logoutUser() {
        try {
            // Calling logout API endpoint
            const response = await api.post("/api/users/logout");
            return response;
        } catch (error) {
            console.log("AuthService :: logoutUser :: error ::", error);
            return error;
        }
    }

    /**
     * Fetches the currently authenticated user
     * @returns {Promise<Object|null>} User data or null on error
     */
    async getCurrentUser() {
        try {
            // Retrieving user session details
            const response = await api.get("/api/users/current-user");
            return response;
        } catch (error) {
            console.log("AuthService :: getCurrentUser :: error ::", error);
            return null;
        }
    }

    /**
     * Registers a new user
     * @param {Object} param0
     * @param {string} param0.name - Full name of the user
     * @param {string} param0.email - User's email
     * @param {string} param0.password - User's password
     * @returns {Promise<Object>} Response data or error object
     */
    async registerUser({ name, email, password }) {
        try {
            // Sending registration payload to the backend
            const response = await api.post("/api/users/register", { name, email, password });
            return response;
        } catch (error) {
            console.log("AuthService :: registerUser :: error ::", error);
            return error;
        }
    }
}

const authService = new AuthService();
export default authService;
