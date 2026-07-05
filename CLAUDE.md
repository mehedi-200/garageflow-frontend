# GarageFlow Frontend — Project Conventions

Vehicle service management SPA. React + Vite + TanStack Query + Tailwind CSS.
API repo: https://github.com/mehedi-200/garageflow-api

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
