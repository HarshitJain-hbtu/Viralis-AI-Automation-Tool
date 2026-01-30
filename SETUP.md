# Lead Management Setup

## 1. Environment Variables (.env)

Create `/Backend/.env` and add:

```env
MONGO_URI=mongodb://localhost:27017/viralis
REDIS_HOST=localhost
REDIS_PORT=6379

# API Keys (get from below)
OPENAI_API_KEY=sk-proj-YOUR_KEY
INSTAGRAM_ACCESS_TOKEN=YOUR_TOKEN
YOUTUBE_API_KEY=YOUR_KEY
YOUTUBE_CHANNEL_ID=YOUR_CHANNEL_ID

JWT_SECRET=your-secret-key
NODE_ENV=development
PORT=5000
LOG_LEVEL=info
```

---

## 2. Get API Keys

### OpenAI API Key
- Go to: https://platform.openai.com/api-keys
- Create new secret key
- Copy it (starts with `sk-proj-`)

### Instagram Access Token (Step by Step)

**Step 1: Create an App**
- Go to: https://developers.facebook.com/
- Click "My Apps" → "Create App"
- Choose type: "Business"

**Section 1 - App Details:**
- App Name: "Viralis Lead Management"
- App Contact Email: YOUR EMAIL
- Purpose: "Analyze Instagram videos"
- Click "Next"



**Step 5: Verify**
- Check `.env` has: `INSTAGRAM_ACCESS_TOKEN=IGQV...`
- Done!

### YouTube API Key & Channel ID
- Go to: https://console.cloud.google.com/
- Enable YouTube Data API v3
- Create API Key credential
- Get Channel ID from: https://www.youtube.com/account/advanced_account

---

## 3. Start Services

**Terminal 1:**
```bash
mongod
```

**Terminal 2:**
```bash
redis-server
```

---

## 4. Run Backend

**Terminal 3:**
```bash
cd viralis/Backend
npm install
npm run dev
```

Should show: `Listening on port 5000`

---

## 5. Run Frontend

**Terminal 4:**
```bash
cd viralis/frontend
npm install
npm run dev
```

Should show: `✓ Ready in X.Xs`

---

## 6. Test

Open browser: http://localhost:3000/dashboard/lead-management

Done!
