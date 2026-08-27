# Canopus Labs

**Your gateway to open source.** Discover organizations, programs and events worth contributing to — all in one place.

Canopus Labs is an open-source discovery platform built around two core ideas: **Organizations** and **Events**. It pulls real data from the GSoC Organizations API, stores it in MongoDB Atlas, and surfaces it through a clean, fast, modern frontend.

---

## Features

- **Organization discovery** — 500+ GSoC organizations with logos, categories, technologies, topics, and per-year project history
- **Event directory** — Mentorships, hackathons, fellowships and contribution programs (GSoC, LFX, Outreachy, Hacktoberfest and more)
- **Advanced search** — Debounced search with MongoDB Atlas Search (fuzzy matching, relevance ranking) with native `$text` fallback
- **Autocomplete suggestions** — Lightweight dropdown suggestions as you type
- **Faceted filters** — Filter by category, technology, topic, year — all server-side with counts
- **GSoC data pipeline** — Sync script ingests all historical org + project data (2016–2026) into MongoDB
- **Liquid glass navbar** — Floating pill navbar with mobile menu
- **Fully responsive** — Mobile, tablet, desktop

---

## Tech Stack

### Frontend
| | |
|---|---|
| React 18 | UI framework |
| Vite 5 | Build tool |
| Tailwind CSS 3 | Styling |
| Framer Motion 11 | Animations |
| React Router v6 | Routing |
| Lucide React | Icons |
| Space Grotesk + Inter | Fonts |

### Backend
| | |
|---|---|
| Node.js + Express 4 | REST API |
| Mongoose 8 | MongoDB ODM |
| MongoDB Atlas | Database |
| dotenv | Environment config |

### Tooling
| | |
|---|---|
| concurrently | Run frontend + backend together |
| Render | Backend hosting |

---

## Project Structure

```
canopus-labs/
├── public/
│   ├── logo.png
│   ├── event-logos/          # Event logo images
│   └── org-mock-logo/        # Org logo images (mockup)
│
├── server/
│   ├── index.js              # Express entry point
│   ├── db.js                 # MongoDB connection
│   ├── models/
│   │   └── Organization.js   # Mongoose schema (one doc per org × year)
│   └── routes/
│       └── organizations.js  # API routes
│
├── scripts/
│   └── sync-gsoc.js          # GSoC data ingestion script
│
├── src/
│   ├── components/           # Navbar, Footer, Cards, etc.
│   ├── data/                 # Static events data
│   ├── hooks/                # useOrganizations, useOrganizationMeta, etc.
│   └── pages/                # Home, Organizations, Events, Detail pages
│
├── .env.example              # Environment variable template
└── package.json
```

---

## Getting Started

### Prerequisites

- Node.js 18+
- A MongoDB Atlas account (free tier works)

### 1. Clone and install

```bash
git clone https://github.com/your-username/canopus-labs.git
cd canopus-labs
npm install
```

### 2. Configure environment variables

```bash
cp .env.example .env
```

Open `.env` and fill in your values:

```env
MONGODB_URI=mongodb+srv://<user>:<password>@<cluster>.mongodb.net/
MONGODB_DATABASE=canopus_labs
PORT=3001
NODE_ENV=development
CORS_ORIGIN=http://localhost:5173
VITE_API_URL=          # leave empty for local dev (uses Vite proxy)
```

### 3. Sync GSoC data into MongoDB

This fetches all organizations (2016–2026) from the GSoC API and populates your database.

```bash
# Preview without writing anything
npm run sync:gsoc:dry

# Full sync
npm run sync:gsoc

# Sync a specific year only
npm run sync:gsoc -- --year 2026
```

Expected output:

```
✅ MongoDB connected — database: "canopus_labs"
📡 Fetching: https://api.gsocorganizations.dev/organizations.json
   ✓ Received 519 organizations
   Upserting: 3200/3200

✅ Sync complete!
   Orgs in API response  : 519
   Years processed       : 2016 ... 2026
   Documents created     : 3200+
   Projects stored       : 18000+
   Errors                : 0
```

### 4. Start the application

**Option A — run everything together:**

```bash
npm run dev:all
```

**Option B — two separate terminals:**

```bash
# Terminal 1 — backend API
npm run server

# Terminal 2 — frontend
npm run dev
```

Open `http://localhost:5173` in your browser.

---

## API Reference

Base URL (local): `http://localhost:3001`

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | Health check |
| `GET` | `/api/organizations` | Paginated org list with search + filters |
| `GET` | `/api/organizations/meta` | Filter metadata (categories, technologies, years with counts) |
| `GET` | `/api/organizations/suggest?q=pyth` | Autocomplete suggestions |
| `GET` | `/api/organizations/:gsocId` | Full org detail with all years and projects |

### Query parameters for `GET /api/organizations`

| Param | Type | Example | Description |
|---|---|---|---|
| `search` | string | `python` | Full-text / fuzzy search |
| `category` | string | `Science and medicine` | Filter by category |
| `technology` | string | `Go,Rust` | Filter by technology (comma-separated) |
| `topic` | string | `machine learning` | Filter by topic |
| `year` | number | `2025` | Filter by GSoC year |
| `page` | number | `2` | Page number (default: 1) |
| `limit` | number | `24` | Results per page (max: 100) |

---

## Data Architecture

The database uses a **one document per (organization × year)** model:

```
gsoc_orgs collection
├── { gsocId: "apache", year: 2024, name: "Apache", projects: [...] }
├── { gsocId: "apache", year: 2025, name: "Apache", projects: [...] }
├── { gsocId: "cncf",   year: 2024, name: "CNCF",   projects: [...] }
└── ...
```

This preserves complete historical data. Re-syncing a new year never touches existing year documents.

---

## MongoDB Atlas Search (Optional)

For fuzzy search and relevance ranking, create an Atlas Search index:

1. Go to **MongoDB Atlas → your cluster → Search → Create Index**
2. Index name: `org_atlas_search`
3. Collection: `canopus_labs.gsoc_orgs`
4. Use this JSON definition:

```json
{
  "mappings": {
    "dynamic": false,
    "fields": {
      "name": [
        { "type": "string", "analyzer": "lucene.standard" },
        { "type": "autocomplete", "tokenization": "edgeGram", "minGrams": 2, "maxGrams": 15 }
      ],
      "description":      { "type": "string", "analyzer": "lucene.standard" },
      "category":         { "type": "string", "analyzer": "lucene.standard" },
      "technologies":     { "type": "string", "analyzer": "lucene.standard" },
      "topics":           { "type": "string", "analyzer": "lucene.standard" },
      "year":             { "type": "number" }
    }
  }
}
```

The backend auto-detects Atlas Search on startup and switches to it automatically. If not configured, it falls back to native `$text` search — the application never breaks.

---

## Deployment

### Backend — Render

| Field | Value |
|---|---|
| Language | Node |
| Build Command | `npm install` |
| Start Command | `node server/index.js` |

Environment variables to set in Render:

```
MONGODB_URI=<your Atlas URI>
MONGODB_DATABASE=canopus_labs
PORT=3001
NODE_ENV=production
CORS_ORIGIN=https://your-frontend-url.onrender.com
```

### Frontend — Render Static Site

| Field | Value |
|---|---|
| Build Command | `npm install; npm run build` |
| Publish Directory | `dist` |

Environment variable:

```
VITE_API_URL=https://canopus-labs-api.onrender.com
```

---

## Available Scripts

| Script | Description |
|---|---|
| `npm run dev` | Start Vite frontend dev server |
| `npm run build` | Build frontend for production |
| `npm run preview` | Preview production build |
| `npm run server` | Start Express backend |
| `npm run server:dev` | Start backend with `--watch` (auto-restart) |
| `npm run dev:all` | Start frontend + backend concurrently |
| `npm run sync:gsoc` | Sync all GSoC data into MongoDB |
| `npm run sync:gsoc:dry` | Preview sync without writing |
| `npm run sync:gsoc -- --year 2026` | Sync a specific year only |
| `npm run sync:gsoc -- --drop` | Drop collection then sync fresh |

---

## License

MIT
