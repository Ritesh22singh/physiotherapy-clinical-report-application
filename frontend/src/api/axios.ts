import axios from 'axios';
import { endSession, validateSession } from '../services/session';




const api =  axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    headers: {
        "Content-Type" : "application/json",
    }
})

api.interceptors.request.use((config) => {
    const token = validateSession();

    if(token && !["/auth/login", "/auth/register"].includes(config.url ?? "")){
        config.headers.Authorization = `Bearer ${token}`
    }

    return config;
});

api.interceptors.response.use(
    (response) => response,
    (error) => {
        const token = localStorage.getItem("auth_token");
        // Ignore failed login attempts and responses from an older session.
        if (error.response?.status === 401 && token &&
            error.config?.headers?.Authorization === `Bearer ${token}`) {
            endSession("expired");
        }
        return Promise.reject(error);
    },
);

export default api;
