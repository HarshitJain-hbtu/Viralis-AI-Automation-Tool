import { create } from 'zustand';
import api from '../api/client';

interface Business {
    _id: string;
    name: string;
    industryMode?: string;
    onboardingStep?: number;
}

interface User {
    id: string;
    email: string;
    name: string;
    role: string;
    businessId: string | Business; // Updated to allow populated object
}

interface AuthState {
    user: User | null;
    token: string | null;
    isLoading: boolean;
    error: string | null;
    login: (email: string, password: string) => Promise<void>;
    register: (name: string, email: string, password: string) => Promise<void>;
    logout: () => void;
    checkAuth: () => Promise<void>;
    socialStats: { youtube: any; facebook: any; instagram: any } | null;
    fetchSocialStats: () => Promise<void>;
    replyToComment: (commentId: string, text: string) => Promise<any>;
}

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    token: typeof window !== 'undefined' ? localStorage.getItem('token') : null,
    isLoading: false,
    error: null,

    login: async (email, password) => {
        set({ isLoading: true, error: null });
        try {
            const response = await api.post('/auth/login', { email, password });
            const { token, user } = response.data;

            localStorage.setItem('token', token);
            set({ token, user, isLoading: false });
        } catch (error: any) {
            set({
                error: error.response?.data?.error || 'Login failed',
                isLoading: false
            });
            throw error;
        }
    },

    register: async (name, email, password) => {
        set({ isLoading: true, error: null });
        try {
            const response = await api.post('/auth/register', { name, email, password });
            const { token, user } = response.data;

            localStorage.setItem('token', token);
            set({ token, user, isLoading: false });
        } catch (error: any) {
            set({
                error: error.response?.data?.error || 'Registration failed',
                isLoading: false
            });
            throw error;
        }
    },

    logout: () => {
        localStorage.removeItem('token');
        set({ user: null, token: null });
    },

    checkAuth: async () => {
        const token = localStorage.getItem('token');
        if (!token) return;

        try {
            const response = await api.get('/auth/me');
            set({ user: response.data });
        } catch (error) {
            localStorage.removeItem('token');
            set({ user: null, token: null });
        }
    },

    socialStats: null,

    fetchSocialStats: async () => {
        try {
            const response = await api.get('/stats');
            set({ socialStats: response.data });
        } catch (error) {
            console.error('Failed to fetch social stats', error);
            set({ socialStats: null });
        }
    },

    replyToComment: async (commentId: string, text: string) => {
        try {
            const response = await api.post('/social/youtube/reply', { commentId, text });
            return response.data.comment;
        } catch (error) {
            console.error('Failed to reply to comment', error);
            throw error;
        }
    },
}));
