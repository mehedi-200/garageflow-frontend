# GarageFlow Frontend — Project Conventions

Vehicle service management SPA. React + Vite + TanStack Query + Tailwind CSS.
API repo: https://github.com/mehedi-200/garageflow-api

## ⛔ UI/UX RULES — STRICT, NEVER BREAK, NO EXCEPTIONS

These rules apply to EVERY page and EVERY component. Never ship anything that violates a single one of them.

### 1. Fully responsive — always
Every page must work perfectly on mobile, tablet, and desktop. No page is "desktop only". Test all three breakpoints for every feature.

### 2. Mobile & tablet = native app experience
On mobile and tablet, every page must look and feel like a modern native app, not a shrunken website:
- Full-screen app-style layout (no desktop chrome)
- App-style top bar per page (title + contextual actions)
- Bottom navigation bar for primary navigation (native app pattern)
- Touch-friendly targets (min 44×44px), swipe-friendly lists, card-based layouts
- Modern app design: rounded cards, clean spacing, smooth transitions

### 3. Desktop = thin chrome + collapsible sidebar
- **Thin header** (slim, not tall)
- **Thin footer**
- **Thin sidebar** for navigation, and it MUST be collapsible (icons-only when collapsed)

### 4. Three themes — dark is DEFAULT
- **Dark mode** — the default theme
- **Light mode**
- **Reading mode** — comfortable reading palette (sepia/soft contrast)
Implement with CSS variables + a theme class on the root element; persist the user's choice (localStorage); every component must render correctly in all three themes. Never hardcode colors in components — always use theme tokens.

### 5. Global app chrome — present on every authenticated page
- **Master search bar** (global search across customers, vehicles, jobs)
- **Notification area** (bell + dropdown/panel)
- **Profile menu** (avatar → profile, settings, logout)
On desktop these live in the thin header; on mobile/tablet they live in the app-style top bar / navigation per native app conventions.

## React Architecture

```
Component
    ↓
React Query / Redux Toolkit
    ↓
API Service (Axios)
    ↓
Laravel API
```

## Project Structure

```
src/
├── components/
├── pages/
├── services/      // Axios API calls
├── store/         // Redux Toolkit (if needed)
├── hooks/         // Custom hooks
├── utils/
└── App.jsx
```

## Best Practices

- Keep API calls inside `services/`.
- Use React Query for server state (fetching, caching, refetching).
- Use Redux Toolkit only for global application state (auth, UI, settings).
- Keep components focused on rendering and user interactions.
- Reuse logic through custom hooks.
- Separate business logic from UI.
- Use Axios interceptors for authentication and error handling.

## Git

`main` ← `develop` ← `feature/*` branches, meaningful commit messages, PRs into develop.
