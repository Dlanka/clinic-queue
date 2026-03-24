# Clinic Queue SaaS

Multi-tenant clinic queue management platform built with React + Express + MongoDB.

## Monorepo Structure

- `apps/api` - Node.js + Express + TypeScript API
- `apps/web` - React + TypeScript frontend (Vite)
- `docs/` - product, architecture, and API documentation

## Features by Milestone

- Milestone 1: workspace scaffold, scripts, health endpoint, router shell
- Milestone 2: tenant/auth core with cookie-based auth and CSRF
- Milestone 3/3.1: app shell, reusable UI components, route placeholders
- Milestone 4: membership management
- Milestone 5: doctor CRUD
- Milestone 6: patient CRUD + visits
- Milestone 7: medicine CRUD + low stock logic
- Milestone 8: prescriptions lifecycle
- Milestone 9: appointments CRUD + simple double-booking prevention
- Milestone 10: doctor daily queue lifecycle
- Milestone 11: hardening (rate limiting, security headers, logging, route guards, error boundaries)

## Requirements

- Node.js 20+
- Corepack enabled (`corepack enable`)
- MongoDB running locally (default: `mongodb://127.0.0.1:27017/clinic_queue_saas`)

## Install

```bash
corepack yarn install
```

## Run

Run both API and web:

```bash
corepack yarn dev
```

Run separately:

```bash
corepack yarn dev:api
corepack yarn dev:web
```

## Seed Demo Data

```bash
corepack yarn workspace @clinic-queue/api seed
```

Default seeded account:

- Email: `admin@demo.com`
- Password: `Admin123!`

## Quality Checks

```bash
corepack yarn lint
corepack yarn typecheck
corepack yarn build
```

## Security Model

- Multi-tenant isolation with `x-tenant-id`
- Cookie-only auth (`httpOnly` access + refresh cookies)
- CSRF double-submit for `POST/PATCH/DELETE`
- Role-based access through tenant memberships (`roles: string[]`)
- Hardening middleware:
  - request logging
  - basic security headers
  - in-memory rate limiting

## Environment

API environment variables (with safe defaults):

- `NODE_ENV`
- `PORT`
- `MONGODB_URI`
- `JWT_ACCESS_SECRET`
- `JWT_REFRESH_SECRET`
- `JWT_LOGIN_SECRET`
- `JWT_ACCESS_TTL`
- `JWT_REFRESH_TTL`
- `JWT_LOGIN_TTL`
- `COOKIE_SAME_SITE`
- `RATE_LIMIT_WINDOW_MS`
- `RATE_LIMIT_MAX`

Web environment variables:

- `VITE_API_BASE_URL` (default `/api`)

## API Documentation

See [docs/API.md](./docs/API.md) for endpoint details and sample requests.
