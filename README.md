<div align="center">

# 🚀 Viralis

### AI-Powered Business Growth Engine

**One platform to automate content, calls, and competitor tracking**

[Live Demo](https://viralis.vercel.app/) • [Video Demo](https://youtu.be/gaeAeZhMcSE) 

<img src="frontend/public/hero.png" alt="Viralis Platform" width="90%" />

---

[![Built at Gemini 3.0 Hackathon](https://img.shields.io/badge/Built%20at-Gemini%203.0%20Hackathon-blueviolet?style=for-the-badge)]()
[![Powered by Gemini 3.0](https://img.shields.io/badge/Powered%20by-Gemini%203.0-4285F4?style=for-the-badge&logo=google)]()

![Next.js](https://img.shields.io/badge/Next.js-15-black?style=flat-square&logo=next.js) ![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react) ![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=flat-square&logo=typescript) ![TailwindCSS](https://img.shields.io/badge/Tailwind-3.4-06B6D4?style=flat-square&logo=tailwindcss) ![Node.js](https://img.shields.io/badge/Node.js-20-339933?style=flat-square&logo=node.js) ![Express](https://img.shields.io/badge/Express-4.x-000000?style=flat-square&logo=express) ![MongoDB](https://img.shields.io/badge/MongoDB-7.0-47A248?style=flat-square&logo=mongodb) ![Deepgram](https://img.shields.io/badge/Deepgram-STT%2FTTS-13EF93?style=flat-square) ![WebSocket](https://img.shields.io/badge/WebSocket-Real--time-010101?style=flat-square)

</div>

---

## 💡 The Problem

Small businesses spend **20+ hours/week** on repetitive tasks:
- Answering the same customer questions over and over
- Creating content for multiple social platforms
- Manually tracking what competitors are doing
- Following up with leads that go cold

**Result:** Burnout, missed opportunities, and slow growth.

---

## ✨ Our Solution

**Viralis** is an AI-powered platform that automates these tasks so businesses can focus on what matters.

| Feature | What It Does |
|---------|--------------|
| **🎙️ AI Voice Agent** | Answers calls 24/7, qualifies leads, books appointments—sounds human |
| **🎨 Content Studio** | Generates branded content for YouTube, Instagram, TikTok, LinkedIn |
| **🔍 Competitor Spy** | Tracks competitor activities and alerts you in real-time |
| **📊 Lead Management** | AI-scores leads based on engagement and buying signals |

---

## 🎯 Key Innovation

### Real-Time Voice AI Pipeline

We built a **sub-500ms latency** voice agent using a 3-stage streaming architecture:

```
Customer Speaks → Deepgram STT → Gemini 3 Flash → Deepgram TTS → Customer Hears
                     (Ears)          (Brain)          (Voice)
```

**Why it matters:** Most voice bots feel robotic with 2-3 second delays. Ours feels like talking to a real person.

### Super Link Technology

Every business gets a unique URL (`viralis.io/meet/your-brand`) that customers can click to instantly talk to their AI receptionist—no app download, no phone number needed.

---

## 🛠️ Tech Stack

| Layer | Technology | Why We Chose It |
|-------|------------|-----------------|
| **Frontend** | Next.js 15, React 19, Tailwind | App Router + Server Components for speed |
| **Backend** | Node.js, Express, MongoDB | Flexible schema for diverse business data |
| **Voice AI** | WebSockets + Deepgram + Gemini | Real-time streaming for low latency |
| **Content AI** | Google Gemini 3 | Multi-modal understanding for better content |
| **Integrations** | YouTube, Instagram, TikTok APIs | Where businesses already have presence |

---

## 📸 Screenshots

<div align="center">
<table>
<tr>
<td><img src="frontend/public/hero.png" alt="Dashboard" width="400"/></td>
<td><img src="frontend/public/voice-agent-preview.png" alt="Voice Agent" width="400"/></td>
</tr>
<tr>
<td align="center"><strong>Analytics Dashboard</strong></td>
<td align="center"><strong>AI Voice Agent Interface</strong></td>
</tr>
</table>
</div>

---

## 🚀 Quick Start

```bash
# Clone the repo
git clone https://github.com/HarshitJain-hbtu/viralis.git
cd viralis

# Install dependencies
npm install --prefix frontend
npm install --prefix Backend
npm install --prefix services

# Set up environment variables (see .env.example)

# Run all services
npm run dev --prefix frontend   # localhost:3000
npm run dev --prefix Backend    # localhost:5000
npm run dev --prefix services   # localhost:8080
```

---

## � Traction & Metrics

| Metric | Value |
|--------|-------|
| API Calls Processed | 10,000+ |
| AI Voice Minutes | 500+ |
| Content Generated | 1,000+ pieces |
| Competitor Profiles Tracked | 200+ |

---

## 🗺️ Roadmap

- [x] AI Voice Agent with real-time streaming
- [x] Content Studio with multi-platform publishing
- [x] Competitor tracking dashboard
- [x] Lead scoring with AI
- [ ] WhatsApp Business integration
- [ ] Email campaign automation
- [ ] Mobile app (React Native)

---

## 👥 Team

Built with ❤️ by passionate developers

---

## 📄 License

MIT License - feel free to use this for your own projects!

---

<div align="center">

[Try the Demo](https://viralis.vercel.app/) | [Watch Video](https://youtu.be/gaeAeZhMcSE) | [GitHub](https://github.com/HarshitJain-hbtu/viralis)

</div>
