import axios from 'axios';

const getBaseUrl = () => {
    // If we have a configured API URL, use it
    let url = process.env.NEXT_PUBLIC_API_URL;

    // Default to local backend if not set
    if (!url) {
        return 'http://localhost:5000/api';
    }

    // Ensure no trailing slash
    if (url.endsWith('/')) {
        url = url.slice(0, -1);
    }

    // Check if it already has /api (avoid double /api/api)
    if (!url.endsWith('/api')) {
        url += '/api';
    }

    return url;
};

const api = axios.create({
    baseURL: getBaseUrl(),
    // Prevent requests from hanging indefinitely on a slow/unreachable backend.
    timeout: 30000,
    headers: {
        'Content-Type': 'application/json',
    },
});

api.interceptors.request.use((config) => {
    // Guard against SSR / non-browser environments where localStorage is undefined.
    if (typeof window !== 'undefined') {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
    }
    return config;
});

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (typeof window !== 'undefined' && error.response?.status === 401) {
            localStorage.removeItem('token');
            if (window.location.pathname !== '/login') {
                window.location.href = '/login';
            }
        }

        // Attach a human-friendly message so callers can surface consistent errors,
        // covering timeouts and network failures that have no response payload.
        let friendlyMessage: string;
        if (error.code === 'ECONNABORTED') {
            friendlyMessage = 'The request timed out. Please try again.';
        } else if (!error.response) {
            friendlyMessage = 'Unable to reach the server. Check your connection and try again.';
        } else {
            friendlyMessage =
                error.response?.data?.error ||
                error.response?.data?.message ||
                'Something went wrong. Please try again.';
        }
        error.friendlyMessage = friendlyMessage;

        return Promise.reject(error);
    }
);

export default api;
