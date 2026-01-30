# Viralis 🚀
**AI-Powered Voice-to-Business Automation Platform**

Viralis transforms voice calls into actionable business intelligence, orchestrating workflows, generating content, and managing leads automatically.

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
* **Landing Page Modularization**: Extracted all sections into reusable components (`Navbar`, `Hero`, `Features`, `Integrations`, `Pricing`, `Testimonials`, `CTA`, `Footer`).
* **Dynamic Floating Navbar**: Implemented a collapsible pill navbar using `GlassSurface` with smooth 1200ms scroll animation.
* **Hero Section**: Redesigned with `grid.jpg` background, centered layout, and 3D floating icon cards.
* **Pricing Section**: New blue-highlighted Pro card with floating 3D icon decoration.
* **Testimonials**: Bento-grid layout with multiple quote cards, avatars, and video preview card.
* **CTA Section**: Gradient blue background with decorative blur elements and dual-button layout.
* **GlassSurface Component**: Added advanced glass distortion component with hydration-safe browser detection.
* **Auth & Session**: Implemented strict redirects for Login/Register (redirects to dashboard if logged in) and enforced Onboarding completion.
* **Settings Page**: Added new `/dashboard/settings` page to edit Industry, Location, and Brand Voice.
* **Sidebar**: Made navigation scrollable while keeping Brand and Footer static. Added "Viralis Pro" subscription widget.
* **Header**: Moved User Profile dropdown to the top navigation bar for better UX.
* **Visuals**: Added custom 3D "AI Studio" fallback image and updated "Total Reach" chart to multi-line step style.
* **State**: Connected Sidebar and Header to real `authStore` data (Name, Industry Mode).

## 🛠️ Backend Logs
* **Auth API**: Updated `/auth/me` to populate full `businessId` details (Onboarding Step, Industry Mode).
* **Profile**: Enabled profile updates via `BusinessController` for the new Settings page.
* **Validation**: Ensured proper state synchronization between user session and business data.
