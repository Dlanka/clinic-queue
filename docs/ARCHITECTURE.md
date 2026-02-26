# ARCHITECTURE — Clinic Queue SaaS

## 1. Monorepo

- Yarn workspaces
- apps/api (Node/Express/TS)
- apps/web (React/TS)

## 2. Tenant Resolution

- Tenant context resolved from `x-tenant-id` header.
- API rejects requests missing tenant header (except health/public endpoints).

## 3. Identity Model

- Account (global): email unique globally.
- TenantMember (per tenant): tenantId + accountId, roles: string[].

## 4. Auth (Cookie Only)

- access_token: httpOnly cookie (short TTL)
- refresh_token: httpOnly cookie (long TTL, rotated)
- No Authorization header, no localStorage/sessionStorage.

## 5. CSRF

- Double-submit cookie:
  - csrf_token cookie (not httpOnly)
  - client sends x-csrf-token header
  - server validates match for POST/PATCH/DELETE.

## 6. Backend Structure

- routes → controllers → services (static class methods) → models
- middlewares: resolveTenant, requireAuth, requireRole, csrfGuard, errorHandler
- validation: zod schemas per route

## 7. Frontend Structure

- feature-based under `features/`
- API layer in `services/` using class + static methods
- React Query for server state
- TanStack Router for routing
