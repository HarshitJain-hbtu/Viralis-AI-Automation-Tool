import { create } from 'zustand';
import api from '../api/client';

export interface VideoAnalysis {
    _id: string;
    videoUrl: string;
    platform: 'instagram' | 'youtube';
    platformStats: {
        views?: number;
        likes?: number;
        comments?: number;
        engagement?: number;
        engagementRate?: number;
    };
    aiSummary?: string;
    keyInsights?: string[];
    audienceType?: string;
    audienceSentiment?: string;
    leadQualityScore?: number;
    thumbnailUrl?: string;
    description?: string;
    analyzedAt: string;
}

export interface Lead {
    _id: string;
    name: string;
    email?: string;
    phone?: string;
    status: 'new' | 'qualified' | 'contacted' | 'closed' | 'archived';
    source: string;
    score: number;
    notes?: string;
    createdAt: string;
}

export interface InstagramMedia {
    id: string;
    caption?: string;
    media_type: string;
    media_url?: string;
    like_count?: number;
    comments_count?: number;
}

interface LeadState {
    analyses: VideoAnalysis[];
    leads: Lead[];
    instagramMedia: InstagramMedia[];
    loading: boolean;
    lastFetched: {
        analyses: number | null;
        leads: number | null;
        media: number | null;
    };

    // Actions
    fetchAnalyses: (force?: boolean) => Promise<void>;
    fetchLeads: (force?: boolean) => Promise<void>;
    fetchInstagramMedia: (force?: boolean) => Promise<void>;
    setLeads: (leads: Lead[]) => void;

    // Stats selectors
    getTotalStats: () => {
        views: number;
        engagement: number;
        avgQuality: number;
    };
}

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export const useLeadStore = create<LeadState>((set, get) => ({
    analyses: [],
    leads: [],
    instagramMedia: [],
    loading: false,
    lastFetched: {
        analyses: null,
        leads: null,
        media: null
    },

    fetchAnalyses: async (force = false) => {
        const { lastFetched, analyses } = get();
        if (!force && analyses.length > 0 && lastFetched.analyses && Date.now() - lastFetched.analyses < CACHE_DURATION) {
            return;
        }

        set({ loading: true });
        try {
            const response = await api.get('/leads/analytics');
            set({
                analyses: response.data.data || [],
                lastFetched: { ...get().lastFetched, analyses: Date.now() },
                loading: false
            });
        } catch (error) {
            console.error('Error fetching analyses:', error);
            set({ loading: false });
        }
    },

    fetchLeads: async (force = false) => {
        const { lastFetched, leads } = get();
        if (!force && leads.length > 0 && lastFetched.leads && Date.now() - lastFetched.leads < CACHE_DURATION) {
            return;
        }

        set({ loading: true });
        try {
            const response = await api.get('/leads');
            set({
                leads: response.data.data || [],
                lastFetched: { ...get().lastFetched, leads: Date.now() },
                loading: false
            });
        } catch (error) {
            console.error('Error fetching leads:', error);
            set({ loading: false });
        }
    },

    fetchInstagramMedia: async (force = false) => {
        const { lastFetched, instagramMedia } = get();
        if (!force && instagramMedia.length > 0 && lastFetched.media && Date.now() - lastFetched.media < CACHE_DURATION) {
            return;
        }

        set({ loading: true });
        try {
            const response = await api.get('/leads/instagram-media', {
                params: { limit: 24 }
            });
            set({
                instagramMedia: response.data.data || [],
                lastFetched: { ...get().lastFetched, media: Date.now() },
                loading: false
            });
        } catch (error) {
            console.error('Error fetching media:', error);
            set({ loading: false });
        }
    },

    setLeads: (leads) => set({ leads }),

    getTotalStats: () => {
        const { analyses, instagramMedia } = get();

        // 1. Total Views: Sum from analyses
        const analysisViews = analyses.reduce((sum, a) => sum + (a.platformStats.views || 0), 0);

        // 2. Engagement: Sum from BOTH analyses and live feed
        const analysisEng = analyses.reduce((sum, a) => sum + (a.platformStats.likes || 0) + (a.platformStats.comments || 0), 0);
        const liveEng = instagramMedia.reduce((sum, m) => sum + (m.like_count || 0) + (m.comments_count || 0), 0);

        // 3. Avg Quality: From analyses
        const avgQuality = analyses.length > 0
            ? Math.round(analyses.reduce((sum, a) => sum + (a.leadQualityScore || 0), 0) / analyses.length)
            : 0;

        return {
            views: analysisViews,
            engagement: analysisEng + liveEng,
            avgQuality
        };
    }
}));
