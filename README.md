# Viralis 🚀
**AI-Powered Voice-to-Business Automation Platform**

Viralis transforms voice calls into actionable business intelligence, orchestrating workflows, generating content, and managing leads automatically.

---

## � Frontend Logs
*   **Auth & Session**: Implemented strict redirects for Login/Register (redirects to dashboard if logged in) and enforced Onboarding completion.
*   **Settings Page**: Added new `/dashboard/settings` page to edit Industry, Location, and Brand Voice.
*   **Sidebar**: Made navigation scrollable while keeping Brand and Footer static. Added "Viralis Pro" subscription widget.
*   **Header**: Moved User Profile dropdown to the top navigation bar for better UX.
*   **Visuals**: Added custom 3D "AI Studio" fallback image and updated "Total Reach" chart to multi-line step style.
*   **State**: Connected Sidebar and Header to real `authStore` data (Name, Industry Mode).

## 🛠️ Backend Logs
*   **Auth API**: Updated `/auth/me` to populate full `businessId` details (Onboarding Step, Industry Mode).
*   **Profile**: Enabled profile updates via `BusinessController` for the new Settings page.
*   **Validation**: Ensured proper state synchronization between user session and business data.
