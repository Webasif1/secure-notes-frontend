# SecureNotes Frontend

Simple React frontend for the **SecureNotes API**. The task asks for functionality over design, so the UI is intentionally plain.

- Backend repo: `secure-notes-backend`
- Live site: _add your Vercel / Netlify URL here_

**Stack:** React 19 · React Router 7 · Vite · plain CSS · `fetch`

## Pages

| Route | Who | What |
|---|---|---|
| `/register`, `/login` | everyone | Sign up (with interests) / log in. The JWT is stored in `localStorage` and sent as `Authorization: Bearer` |
| `/notes` | logged in | Create, edit, delete and list **own** notes (paginated) |
| `/posts` | everyone | Public posts feed (paginated). Logged-in users can publish |
| `/users/:id/posts` | everyone | All posts of one user (**Scenario 2**, `$lookup` aggregation) |
| `/interests` | logged in | Users grouped by interest (**Scenario 1**, single `aggregate()` call) |
| `/profile` | logged in | Edit name, interests and password |
| `/admin/users` | admin | List / add / edit / delete users, change roles |
| `/admin/notes` | admin | Everyone's notes, optionally filtered by user |

Admin links are hidden for normal users, and the backend enforces every permission anyway (403).

## Run locally

```bash
git clone <this repo>
cd secure-notes-frontend
npm install
cp .env.example .env     # VITE_API_URL=http://localhost:5000/api
npm run dev              # http://localhost:5173
```

The backend must be running (see the backend README).

## Deploy

**Vercel:** import the repo (framework: Vite) and add the env var `VITE_API_URL=https://<your-api>.onrender.com/api`. `vercel.json` rewrites all routes to `index.html`, so refreshing on `/notes` works.

**Netlify:** build command `npm run build`, publish directory `dist`, with the same env var. `public/_redirects` handles SPA routing.

Then set `CLIENT_URL` on the backend to the deployed frontend URL (for CORS).
