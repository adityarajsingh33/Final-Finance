import axios from "axios";

const baseURL = import.meta.env.VITE_API_BASE_URL;

const api = axios.create({
    baseURL:baseURL,
    withCredentials: true,
});

export class AuthService {

    async loginUser({ email, password }) {
        try {
            const response = await api.post("/api/users/login", { email, password });
            return response;
        } catch (error) {
            console.log("AuthService :: loginUser :: error ::", error);
            return error;
        }
    }

    async logoutUser() {
        try {
            const response = await api.post("/api/users/logout");
            return response;
        } catch (error) {
            console.log("AuthService :: logoutUser :: error ::", error);
            return error;
        }
    }

    async getCurrentUser() {
        try {
            const response = await api.get("/api/users/current-user");
            return response;
        } catch (error) {
            console.log("AuthService :: getCurrentUser :: error ::", error);
            return null;
        }
    }

    async registerUser({ name, email, password }) {
        try {
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
