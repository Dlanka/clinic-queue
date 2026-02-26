# AGENTS.md — Codex Instructions (Clinic Queue SaaS)

## Always read first

- docs/SRS.md
- docs/ARCHITECTURE.md
- docs/UI_SPEC.md
- CHANGE_REQUESTS.md (if not empty)

## Stack (mandatory)

Frontend: React + TypeScript, Tailwind v4, tailwind-variants, TanStack Router, React Query, RHF + zod, date-fns,Sonner, axios,  
Backend: Node + Express + TypeScript, MongoDB (Mongoose), service classes with static methods

## Non-negotiables

- Multi-tenant: enforce tenantId on all records and queries, tenant from `x-tenant-id`.
- Auth: cookie-only (httpOnly access + refresh), no Authorization header, no browser storage tokens.
- CSRF: double-submit cookie for POST/PATCH/DELETE.
- TenantMember supports multiple roles: roles: string[].

## Milestones

### Milestone 1 — Scaffold

- Yarn workspaces monorepo (apps/api, apps/web)
- Lint/format/typecheck/build scripts
- API health endpoint
- Web shell with router + query provider

### Milestone 2 — Tenant + Auth Core

- Mongo connection + config
- Account + TenantMember models
- Auth endpoints: login/refresh/logout/me using cookies
- CSRF guard
- resolveTenant + requireAuth + requireRole
- Seed: tenant + account + tenantMember roles ["ADMIN"]

### Milestone 3 — UI Shell + Base Components

- Sidebar/topbar layout
- Theme tokens(google material m3 tonal color pallet) ex: --color-primary-0: #000, --color-primary-10: #04042c,... --color-primary-100: #fff,
- Button/Input/Table/Modal/Toast built with tailwind-variants

### Milestone 4 — User/Membership Management

- Manage TenantMembers (assign multiple roles)

### Milestone 5 — Doctors

### Milestone 6 — Patients + Visits

### Milestone 7 — Medicines

### Milestone 8 — Prescriptions

### Milestone 9 — Appointments

### Milestone 10 — Queue

### Milestone 11 — Hardening (indexes, rate limit, logging, docs)
