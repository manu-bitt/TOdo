# Backend Deployment Guide (Render example)

This backend uses Express + Prisma (SQLite).

## Environment variables
- PORT (default 4000)
- DATABASE_URL (e.g. file:./data/dev.db)

## Render setup (Free web service)
1. Push code to GitHub (done).
2. In Render, create a new Web Service from your repo.
3. Root Directory: todo-app/backend
4. Build Command: npm install && npx prisma migrate deploy && npx prisma generate
5. Start Command: node src/server.js
6. Environment:
   - PORT = 4000 (or leave default)
   - DATABASE_URL = file:./data/dev.db
7. Disks: add a persistent disk so the SQLite DB survives restarts.
   - Name: data
   - Mount Path: /opt/render/project/src/data
   - Size: e.g. 1 GB

Prisma will resolve file:./data/dev.db relative to the app root.

## CORS
Ensure the frontend domain is allowed by CORS (current server uses cors() which is permissive).
