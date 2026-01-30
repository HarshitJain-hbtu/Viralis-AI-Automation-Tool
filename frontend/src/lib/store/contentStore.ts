import { create } from 'zustand';
import api from '../api/client';

interface ContentState {
    isGenerating: boolean;
    generatedResult: string | null;
    error: string | null;
    generateContent: (topic: string, type: string, tone: string, extraParams?: any) => Promise<void>;
    clearResult: () => void;
}

export const useContentStore = create<ContentState>((set) => ({
    isGenerating: false,
    generatedResult: null,
    error: null,

    generateContent: async (topic, type, tone, extraParams = {}) => {
        set({ isGenerating: true, error: null, generatedResult: null });
        try {
            const response = await api.post('/ai/generate', { topic, type, tone, ...extraParams });
            set({ generatedResult: response.data.result, isGenerating: false });
        } catch (error: any) {
            set({
                error: error.response?.data?.error || 'Failed to generate content',
                isGenerating: false
            });
            throw error;
        }
    },

    clearResult: () => set({ generatedResult: null, error: null })
}));
