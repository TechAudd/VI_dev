import axios from "axios";

const API = axios.create({
    baseURL: import.meta.env.VITE_APP_BASE_URL,
    withCredentials: true, // Allows sending HTTP-only cookies
});

// Function to get access token from localStorage
const getAccessToken = () => localStorage.getItem("accessToken");

// Flag to prevent multiple refresh attempts
let isRefreshing = false;
let refreshSubscribers = [];

// Function to update tokens in storage and headers
const updateAccessToken = (newAccessToken) => {
    localStorage.setItem("accessToken", newAccessToken);
    API.defaults.headers.common["Authorization"] = `Bearer ${newAccessToken}`;
};

// Function to notify all queued requests after refresh
const onTokenRefreshed = (newAccessToken) => {
    refreshSubscribers.forEach((callback) => callback(newAccessToken));
    refreshSubscribers = [];
};

// Request interceptor: Attach Access Token
API.interceptors.request.use(
    async (config) => {
        const accessToken = getAccessToken();
        if (accessToken) {
            config.headers["Authorization"] = `Bearer ${accessToken}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor: Handle 401 (Unauthorized)
API.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // If 401 error and it's the first retry attempt
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            // Handle multiple requests waiting for refresh
            if (isRefreshing) {
                return new Promise((resolve) => {
                    refreshSubscribers.push((newAccessToken) => {
                        originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
                        resolve(API(originalRequest));
                    });
                });
            }

            isRefreshing = true;
            try {
                const { data } = await axios.get(`${import.meta.env.VITE_APP_BASE_URL}/auth/refreshToken`, {
                    withCredentials: true,
                });

                updateAccessToken(data.accessToken);
                onTokenRefreshed(data.accessToken);
                isRefreshing = false;

                originalRequest.headers["Authorization"] = `Bearer ${data.accessToken}`;
                return API(originalRequest);
            } catch (err) {
                console.error("Refresh Token Expired:", err);
                localStorage.removeItem("accessToken");
                window.location.href = "/login"; // Redirect to login
                return Promise.reject(err);
            }
        }

        return Promise.reject(error);
    }
);

export default API;
