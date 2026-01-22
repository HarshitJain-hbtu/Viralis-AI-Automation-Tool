import { create } from 'zustand';
import api from '../api/client';

interface BusinessState {
    profile: any | null;
    isLoading: boolean;
    error: string | null;
    fetchProfile: () => Promise<void>;
    updateProfile: (data: any) => Promise<void>;
}

export const useBusinessStore = create<BusinessState>((set) => ({
    profile: null,
    isLoading: false,
    error: null,

    fetchProfile: async () => {
        set({ isLoading: true, error: null });
        try {
            const response = await api.get('/business/profile');
            set({ profile: response.data, isLoading: false });
        } catch (error: any) {
            set({ error: error.message, isLoading: false });
        }
    },

    updateProfile: async (data) => {
        set({ isLoading: true, error: null });
        try {
            const response = await api.patch('/business/profile', data);
            set({ profile: response.data, isLoading: false });
        } catch (error: any) {
            set({ error: error.message, isLoading: false });
            throw error;
        }
    },
}));
