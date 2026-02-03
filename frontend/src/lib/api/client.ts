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
    headers: {
        'Content-Type': 'application/json',
    },
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            if (window.location.pathname !== '/login') {
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

export default api;
