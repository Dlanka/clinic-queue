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
- Button/Input/TextArea/Table/Badge/CheckBox/RadioButton/Switch/FieldGroup built with tailwind-variants
- Toast(Sonner), Select(React-Select) build with using libs
- Use Lucide icons lib
- Use framer-motion lib for animations
- Create Reusable BaseModal with React portal, modal must append in the root div during the visible

## Milestone 3.1 — UI Shell + Base Components

Frontend only:

Layout:

- Placeholder routes:
  - Dashboard
  - Queue
  - Appointments
  - Patients
  - Doctors
  - Medicines
  - Prescriptions
  - Users

Done:

- Layout works
- Navigation works
- Components reusable

---

### Milestone 4 — Membership Management

Backend:

- GET /members
- POST /members
- GET /members/:id
- PATCH /members/:id
- DELETE /members/:id
- Roles[] assignment
- Tenant filtering
- Zod validation

Frontend:

- Members page
- Table: Email, Roles, Status
- Create/Edit modal with multi-role select

Done:

- ADMIN manages memberships
- Multi-role assignment works

---

## Milestone 5 — Doctors

Backend:

- Doctor model
- CRUD endpoints
- Tenant isolation

Frontend:

- Doctors page
- Table + modal

Done:

- Doctor CRUD per tenant

---

## Milestone 6 — Patients + Visits

Backend:

- Patient model
- Visit model
- CRUD patients
- Create/list visits
- Proper indexes

Frontend:

- Patients list
- Patient detail
- Visit creation form

Done:

- Visit history retrievable

---

## Milestone 7 — Medicines

Backend:

- Medicine model
- CRUD
- Low stock logic

Frontend:

- Medicines page
- Stock badge
- Create/Edit modal

Done:

- Medicines manageable

---

## Milestone 8 — Prescriptions

Backend:

- Prescription model
- POST /visits/:id/prescriptions
- GET /prescriptions/:id
- PATCH /prescriptions/:id/dispense

Frontend:

- Prescription builder in Visit
- Pharmacy view

Done:

- Doctor creates prescription
- Pharmacy dispenses

---

## Milestone 9 — Appointments

Backend:

- Appointment model
- CRUD
- Prevent simple double booking

Frontend:

- Appointments page
- Filter + modal

Done:

- Appointment lifecycle works

---

## Milestone 10 — Queue

Backend:

- QueueEntry model
- Auto queue number per doctor per day
- Status:
  - WAITING
  - IN_PROGRESS
  - COMPLETED
  - CANCELLED
- Queue endpoints

Frontend:

- Queue page
- Reception add
- Doctor start/complete

Done:

- Full queue workflow works

---

## Milestone 11 — Hardening

Backend:

- Index review
- Rate limiting
- Helmet
- Central error handler
- Logging

Frontend:

- Loading states
- Empty states
- Route guards
- Error boundaries

Docs:

- README updated
- API documentation

Done:

- Production-ready build

---

## Working Rules

- Work milestone by milestone.
- After each milestone:
  - List changed files
  - Provide sample API calls
  - Run:
    - yarn lint
    - yarn typecheck
    - yarn build
- Do not add new libraries unless approved.
