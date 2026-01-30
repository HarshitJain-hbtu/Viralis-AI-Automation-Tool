# Viralis 🚀
**AI-Powered Video-to-Lead Automation Platform**

Viralis transforms social media videos into actionable business intelligence, automatically fetching platform analytics, analyzing with AI, and generating leads for your business.

---

## 📊 Lead Management System
**NEW:** Complete video analytics and lead generation pipeline

The system automatically:
1. **Tracks videos** posted to Instagram & YouTube
2. **Fetches platform stats** (views, likes, comments, engagement)
3. **Analyzes with ChatGPT** to extract valuable insights
4. **Scores leads** based on audience engagement potential
5. **Displays analytics** in an intuitive dashboard

### Quick Start
→ See [IMPLEMENTATION_SUMMARY.md](./IMPLEMENTATION_SUMMARY.md) for overview  
→ See [LEAD_MANAGEMENT_GUIDE.md](./LEAD_MANAGEMENT_GUIDE.md) for technical details  
→ See [SETUP_CHECKLIST.md](./SETUP_CHECKLIST.md) for setup instructions  
→ See [API_TESTING_GUIDE.md](./API_TESTING_GUIDE.md) for API endpoints  
→ See [TEAMMATE_GUIDE.md](./TEAMMATE_GUIDE.md) for user guide

---

## 🤖 AI Voice Agent (New)
* **Voice Microservice**: Built a dedicated Node.js service using **WebSockets** for real-time, low-latency audio streaming.
* **The "Brain" Pipeline**: Implemented a 3-stage conversational loop:
    * **Ears**: Deepgram Nova-2 (Speech-to-Text).
    * **Mind**: Gemini 3 Flash (Context-aware LLM).
    * **Mouth**: Deepgram Aura (Text-to-Speech).
* **Dynamic Persona**: The agent automatically fetches specific business data (Hours, Services, Pricing) upon connection to act as a tailored receptionist for *any* business.
* **Super Link UI**: Created the public-facing "Meet" page (`/meet/[brandId]`) featuring a "Cyberpunk" glowing orb interface for customers to talk to the AI.
* **AI Brain Settings**: Added a new dashboard page (`/dashboard/settings/ai-brain`) where business owners can:
    * Configure their "Knowledge Base" (Services, Prices, Custom Rules).
    * Generate and copy their unique "Super Link".
* **Public API**: Exposed secure, unauthenticated routes (`/api/public/brand/:id`) to allow the Voice Service to read business data without compromising security.

## 🎨 Frontend Logs

*   **Billing Page**: Added `/dashboard/billing` with dynamic pricing cards and manual "Dev Tools" for tier switching.
*   **Sidebar**: Updated Sidebar to display real subscription plan (Free/Starter/Business), badges, and credit usage.
*   **Profile**: Added avatar file upload with size validation (100KB limit).
*   **Social Connect**: Added "Disconnect" button to unlink social accounts.
*   **Voice Lab**: Refactored UI to match website (light mode, white cards), improved form validation.
*   **Landing Page Modularization**: Extracted all sections into reusable components (`Navbar`, `Hero`, `Features`, `Integrations`, `Pricing`, `Testimonials`, `CTA`, `Footer`).
*   **Dynamic Floating Navbar**: Implemented a collapsible pill navbar using `GlassSurface` with smooth 1200ms scroll animation.
*   **Hero Section**: Redesigned with `grid.jpg` background, centered layout, and 3D floating icon cards.
*   **Pricing Section**: New blue-highlighted Pro card with floating 3D icon decoration.
*   **Testimonials**: Bento-grid layout with multiple quote cards, avatars, and video preview card.
*   **CTA Section**: Gradient blue background with decorative blur elements and dual-button layout.
*   **GlassSurface Component**: Added advanced glass distortion component with hydration-safe browser detection.
*   **Auth & Session**: Implemented strict redirects for Login/Register (redirects to dashboard if logged in) and enforced Onboarding completion.
*   **Settings Page**: Added new `/dashboard/settings` page to edit Industry, Location, and Brand Voice.
*   **Lead Management Dashboard**: NEW - Dynamic video analytics with AI-powered insights, sentiment analysis, and lead quality scoring.
*   **Sidebar**: Made navigation scrollable while keeping Brand and Footer static. Added "Viralis Pro" subscription widget.
*   **Header**: Moved User Profile dropdown to the top navigation bar for better UX.
*   **Visuals**: Added custom 3D "AI Studio" fallback image and updated "Total Reach" chart to multi-line step style.
*   **State**: Connected Sidebar and Header to real `authStore` data (Name, Industry Mode).

## 🛠️ Backend Logs
*   **Business Controller**: Added input sanitization to prevent validation errors on empty fields (e.g., `brandVoice`).
*   **Social Controller**: Implemented `disconnectSocial` to wipe account data.
*   **Social Routes**: Added `DELETE /auth/disconnect/:provider`.
*   **Auth API**: Updated `/auth/me` to populate full `businessId` details (Onboarding Step, Industry Mode).
*   **Profile**: Enabled profile updates via `BusinessController` for the new Settings page.
*   **Lead Management API**: NEW - Complete video analytics pipeline with 5 new endpoints
*   **Platform Integration**: Instagram Graph API & YouTube Data API integration for real video stats
*   **AI Integration**: ChatGPT analysis for extracting insights from video performance data
*   **Models**: Enhanced Content model, created VideoAnalysis model with comprehensive fields
*   **Utilities**: Platform API fetching and ChatGPT analysis utilities with error handling
*   **Validation**: Ensured proper state synchronization between user session and business data.

---

## 🚀 Key Features

### For Marketers
- 📊 **Automated Analytics**: Videos analyzed end-of-day automatically
- 🧠 **AI Insights**: ChatGPT-powered analysis of audience sentiment and engagement
- 📈 **Lead Scoring**: AI-calculated lead quality scores (0-100)
- 🎯 **Audience Type Detection**: Automatic demographic and psychographic analysis
- 💡 **Recommendations**: Actionable insights for future content

### For Developers
- 🔌 **REST API**: 5 comprehensive endpoints for video analysis
- 🔐 **Secure**: JWT-protected routes, business ownership verification
- 📦 **Scalable**: Batch processing for multiple videos
- 🗄️ **Well-structured**: TypeScript models, utilities, and controllers
- 📝 **Documented**: Comprehensive guides and API documentation

### For Business
- 💰 **ROI Optimization**: Focus on high-performing content
- 🎬 **Strategy Acceleration**: Data-driven content decisions
- 📊 **Competitive Analysis**: Compare video performance
- 🤖 **Automation**: No manual data collection needed
- 🔄 **Continuous Improvement**: Learn from every video posted

