# FacelessReels — AI Reel Generator

Personal autopilot for creating and posting faceless short-form videos to TikTok, Instagram, and YouTube.

## Current phase: Phase 1 — Script generation

### What's built
- Next.js 14 app with full TypeScript
- Reel builder UI — topic, niche, tone, duration
- Claude API script generation endpoint (`/api/generate/script`)
- Editable script preview with segments (hook → body → CTA)
- Vercel KV job store (optional for Phase 1)
- Dashboard page (populated in Phase 3)

---

## Quick start

### 1. Clone & install
```bash
git clone <your-repo>
cd faceless-reels
npm install
```

### 2. Set up environment variables
```bash
cp .env.example .env.local
```

Then fill in `.env.local`:

| Variable | Where to get it |
|---|---|
| `ANTHROPIC_API_KEY` | [console.anthropic.com](https://console.anthropic.com) |
| `KV_*` vars | Vercel Dashboard → Storage → KV (optional in Phase 1) |

### 3. Run locally
```bash
npm run dev
# → http://localhost:3000
```

### 4. Deploy to Vercel
```bash
npm install -g vercel
vercel
```

Then in Vercel Dashboard → Settings → Environment Variables, add:
- `ANTHROPIC_API_KEY`
- KV vars (after creating a KV store in Storage tab)

---

## Project structure
```
src/
├── app/
│   ├── api/generate/script/   # Claude script generation endpoint
│   ├── builder/               # Reel builder UI
│   ├── dashboard/             # Job history (Phase 3)
│   └── page.tsx               # Overview / home
├── components/
│   ├── layout/Sidebar.tsx
│   └── ui/
│       ├── NicheSelector.tsx
│       ├── ToneDuration.tsx
│       ├── ScriptPreview.tsx
│       └── Skeleton.tsx
├── lib/
│   ├── utils.ts               # cn(), formatters, label maps
│   ├── prompts.ts             # Claude prompt builder
│   └── kv.ts                  # Vercel KV job store
└── types/index.ts             # All TypeScript types
```

---

## Phases

| Phase | Feature | Status |
|---|---|---|
| 1 | Script generation (Claude API) | ✅ Built |
| 2 | Video assembly (ElevenLabs + FFmpeg) | 🔜 Next |
| 3 | Scheduling dashboard (Vercel Cron) | 🔜 |
| 4 | Auto-posting (YouTube / TikTok / Instagram) | 🔜 |

---

## API

### `POST /api/generate/script`

Generate a reel script from a topic.

**Request body:**
```json
{
  "topic":    "The mystery of the Bermuda Triangle",
  "niche":    "mystery",
  "tone":     "suspenseful",
  "duration": 30
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "status": "idle",
    "config": { ... },
    "script": {
      "title": "...",
      "description": "...",
      "hashtags": ["mystery", "bermudatriangle", ...],
      "segments": [
        { "id": "uuid", "type": "hook", "text": "...", "duration": 5, "keywords": ["ocean", "ship"] },
        { "id": "uuid", "type": "body", "text": "...", "duration": 20, "keywords": ["compass", "navigation"] },
        { "id": "uuid", "type": "cta",  "text": "...", "duration": 5,  "keywords": ["follow", "more"] }
      ],
      "totalDuration": 30
    }
  }
}
```

**Niche options:** `motivation` `history` `mystery` `science` `finance` `philosophy` `horror` `travel` `food` `technology`

**Tone options:** `cinematic` `educational` `dramatic` `conversational` `suspenseful` `inspiring`

**Duration options:** `15` `30` `45` `60`
