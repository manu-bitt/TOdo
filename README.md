# Full-Stack To-Do App

A simple CRUD To-Do application with:
- Backend: Express + Prisma (SQLite)
- Frontend: React + Axios

## Prerequisites
- Node.js 18+

## Setup

### 1) Backend (http://localhost:4000)

```
cd todo-app/backend
# Install deps (already done if you used the automation)
npm install

# Prisma: generate client and run migrations
npx prisma migrate dev --name init

# Start server
npm run start
# or
npm run dev
```

API routes:
- GET `/todos` – fetch all todos
- POST `/todos` – create todo `{ title: string }`
- PUT `/todos/:id` – update fields `{ title?: string, completed?: boolean }`
- DELETE `/todos/:id` – delete todo

### 2) Frontend (http://localhost:3000)

```
cd todo-app/frontend
npm install
npm start
```

The frontend is configured to call the backend at `http://localhost:4000/todos`.

## Notes
- SQLite file lives at `backend/prisma/dev.db`.
- Update `backend/src/server.js` to tweak CORS or port if needed.
