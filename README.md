# 🔧 GarageFlow — Frontend

![build](https://github.com/mehedi-200/garageflow-frontend/actions/workflows/build.yml/badge.svg)

Single-page application for **GarageFlow**, a vehicle service management system for garages — track service jobs from intake to delivery. Backend lives at [garageflow-api](https://github.com/mehedi-200/garageflow-api).

## Features

- 🔐 Login, profile & password management (Sanctum tokens, auto-logout on 401)
- 👥 Customers, 🚗 vehicles & 🧑‍🔧 mechanics — searchable, paginated lists with modal CRUD
- 🛠️ Service jobs board — status workflow with a visual timeline; the UI only ever offers the
  single valid next step (`Start Job → Mark Completed → Mark Delivered`), admin-only cancel
- 🧾 Invoices — print-friendly invoice view, inline labor editing, mark-as-paid
- 📊 Dashboard — live stat cards, recent jobs, jobs-by-status breakdown
- 🔍 Master search — grouped results dropdown (desktop) / full-screen search (mobile)
- 🔔 Notifications — unread badge, dropdown panel, mark-all-read (30s polling)

## Design System

- **Responsive everywhere** — desktop gets a thin header + collapsible sidebar + thin footer;
  **mobile/tablet renders as a native app**: bottom navigation, app-style top bars, bottom-sheet modals
- **Three themes** — dark (default), light and reading (sepia), all via CSS variable tokens;
  no component ever hardcodes a color
- **One shared component library** — Button, Input, Select, Card, Modal, DataList (table ⇄ cards),
  StatusChip, SearchInput and a single Pagination component used on every list page
- Full rules live in [CLAUDE.md](CLAUDE.md)

## Tech Stack

React 19 · Vite 8 · React Router · TanStack Query · Axios · React Hook Form · Tailwind CSS 4

## Getting Started

Run the [API](https://github.com/mehedi-200/garageflow-api) first, then:

```bash
npm install
cp .env.example .env    # VITE_API_URL=http://127.0.0.1:8000/api
npm run dev             # http://localhost:5173
```

Demo login: `admin@garageflow.test` / `password` (see the API README for mechanic accounts).

## Project Structure

```
src/
├── components/   # shared UI kit + layout + feature components
├── pages/        # route pages
├── services/     # Axios API calls (one file per domain)
├── hooks/        # useAuth, useTheme, useDebounce…
└── utils/
```

## Author

**Mehedi** — [@mehedi-200](https://github.com/mehedi-200)
