# Lead Management: Modern Instagram Integration Guide

This document provides a step-by-step overview of the Lead Management implementation, focusing on modern Instagram discovery, global state management, and real-time engagement tracking.

---

## 🚀 Overview
The system allows users to sync their Instagram Business accounts, fetch recent media, and track real-time performance. It prioritizes a **Media-First** approach, putting your actual profile content at the forefront of the analytics experience.

## 🛠 Backend Architecture

### 1. Modern Discovery Logic
We implemented a "Modular Discovery" flow to handle modern granular-scoped tokens.
- **File**: [platformApi.ts](file:///home/sanee/Desktop/Gemini%203/viralis/Backend/src/utils/platformApi.ts)
- **Functions**:
    - `getInstagramBusinessId()`: Resigently discovers account IDs using `debug_token` and `granular_scopes`.
    - `fetchInstagramMediaList()`: Fetches media items (id, caption, like_count, etc.) directly from the Instagram Graph API.

### 2. API Endpoints
- **GET `/api/leads/analytics`**: Fetches all video analyses for a business.
- **GET `/api/leads/instagram-media`**: Automatically discovers the linked IG account and returns recent media.
- **POST `/api/leads/sync-instagram`**: Bridges the gap between raw IG data and the platform, creating `Content` records.
- **POST `/api/leads/analyze`**: Triggers AI analysis (ChatGPT) and creates `VideoAnalysis` records.

---

## 🎨 Frontend & State Management

### 1. Global State Management (Zustand)
We use a centralized store to prevent redundant API calls and provide a smooth UX.
- **File**: [leadStore.ts](file:///home/sanee/Desktop/Gemini%203/viralis/frontend/src/lib/store/leadStore.ts)
- **Caching**: Implements a **5-minute cache**. Navigator transitions are instant; data is only re-fetched if the cache expires or a forced refresh is triggered.
- **Forced Sync**: The "Sync Instagram" and "Refresh" buttons bypass the cache to ensure you see the latest live data.

### 2. Real-Data Stats Aggregation
The summary analytics cards are strictly data-driven:
- **Total Views**: Summed from all analyzed content.
- **Total Engagement**: Combined sum of `likes` and `comments` from **both** the live Instagram feed and the analyzed reports.
- **Avg Quality**: Calculated from AI-analyzed campaign scores.

### 3. Media-First Redesign
- **File**: [page.tsx](file:///home/sanee/Desktop/Gemini%203/viralis/frontend/src/app/lead-management/page.tsx)
- **Primary View**: "Your Recent Instagram Posts" is displayed at the top of the Analytics tab, providing an immediate snapshot of live performance.
- **Secondary View**: "Analyzed Campaigns" lists processed deep-dives and AI insights below the live feed.

---

## 🧪 Verification & Testing
1. Ensure your `.env` contains: `INSTAGRAM_ACCESS_TOKEN`, `FB_APP_ID`, `FB_APP_SECRET`, and `OPENAI_API_KEY`.
2. **Database State**: All mock data has been purged. Run the app, and you should see your real Instagram post thumbnails loading automatically.
3. **Analytics**: Verify that "Total Engagement" sums up the metrics shown on your live post cards.
4. **Caching**: Navigate away from Lead Management and back—the page should load **instantly** without a loading spinner.

---

## ⚠️ Merging & Best Practices
- **API Client**: Always use the centralized `axios` client (`frontend/src/lib/api/client.ts`) instead of raw `fetch` to ensure auto-authentication.
- **Route Accuracy**: The analyses endpoint is `/analytics`. Requests to `/analyses` will fail as they fall through to generic ID-based lookups.
- **State Selection**: Use `useLeadStore` for anything related to leads, analyses, or Instagram media. Do not add local `useState` for these data points.
