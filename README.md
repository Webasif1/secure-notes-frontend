# SecureNotes Frontend

React frontend for the **SecureNotes API**: a secure note-taking app with user and admin roles.

- Backend repo: `secure-notes-backend`
- Live site: _add your Vercel / Netlify URL here_

**Stack:** React 19 · Vite · Tailwind CSS v4 · React Router 7 · Axios · Motion (animations) · lucide-react (icons)

## Features

**Users**
- Register / login with client-side validation, show / hide password, clear error states
- Notes workspace: grid or list view (remembered), pagination, note count, skeleton loading, empty states
- Create / edit notes with validation, `Ctrl + S` to save, and a warning before leaving with unsaved changes
- Note details page, with a confirmation dialog before deleting
- Sidebar with the 5 most recent notes. It collapses on desktop and becomes a drawer on mobile
- Light / dark mode, saved in `localStorage`, following the system theme by default

**Admins**
- Overview cards with real totals from the API (users, notes)
- Users table (cards on mobile): pagination, add / edit / remove with confirmation, role changes (an admin can't remove their own admin role)
- Everyone's notes with pagination and read-only note details

## How it talks to the backend

- One Axios instance in `src/lib/api.js`. The base URL comes from `VITE_API_URL` (or `/api` through the Vite proxy in development).
- The backend returns a JWT in the response and as an httpOnly cookie. The app sends it as `Authorization: Bearer <token>`, so it also works when the frontend and backend are on different domains and the browser blocks third-party cookies.
- A `401` on any request means the session expired: the token is cleared, the user is sent to login and a toast explains why.
- Errors (validation, `403`, network, timeout) are turned into one readable message by `getErrorMessage()` and shown inline or as a toast.
- Pagination uses the API's `?page=&limit=` and its `pagination` object (`total`, `totalPages` or `hasNextPage`).
- Route guards (`Protected`, `GuestOnly`) only improve the UX. The backend checks the role on every request.

## Project structure

```
src/
  main.jsx
  app/                 App.jsx (providers), app.route.jsx (routes), index.css (design tokens)
  lib/api.js           axios instance, token, interceptors, error messages
  features/
    shared/            Button, Field, Modal, ConfirmDialog, Toast, Pagination, States, ... + hooks
    auth/              auth.context, Protected / GuestOnly, Login, Register
    layout/            AppLayout, Sidebar, Topbar, ProfileMenu
    notes/             notes list, note details, note editor
    admin/             overview + users, all users' notes
```

Each feature keeps its API calls in `services/*.api.js`, separate from the UI.

## Accessibility and motion

- Semantic HTML, labelled inputs, `aria-invalid` and linked error messages
- Visible focus rings, keyboard support for everything. Modals trap focus, close on `Esc` and return focus when closed
- Skip-to-content link
- Animations are short (150–300 ms) and turn off when the OS has "reduce motion" enabled (`MotionConfig reducedMotion="user"` + CSS)

## Run locally

```bash
git clone <this repo>
cd secure-notes-frontend
npm install
npm run dev          # http://localhost:5173
```

The backend must run on `http://localhost:3000` (see the backend README). Vite proxies `/api` to it, so no `.env` is needed locally.

## Deploy

**Vercel:** import the repo (framework: Vite) and set `VITE_API_URL=https://<your-api>.onrender.com/api`. `vercel.json` sends every route to `index.html`, so refreshing on `/notes/123` works.

**Netlify:** build command `npm run build`, publish directory `dist`, same env var. `public/_redirects` handles routing.

Then set `CLIENT_URL` on the backend to the deployed frontend URL (CORS).
