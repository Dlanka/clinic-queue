# API Documentation

Base URL (local): `http://localhost:4000`

## Headers

Required on tenant-scoped endpoints:

- `x-tenant-id: <tenantObjectId>`

Required on state-changing endpoints (`POST`, `PATCH`, `DELETE`):

- `x-csrf-token: <csrf_token_cookie_value>`

Auth:

- Cookie-only session (`access_token`, `refresh_token`)

## Health

### GET /health

Response:

```json
{
  "status": "ok",
  "service": "api",
  "timestamp": "2026-01-01T00:00:00.000Z"
}
```

## Auth

### POST /auth/login

Body:

```json
{
  "email": "admin@demo.com",
  "password": "Admin123!"
}
```

### POST /auth/select-tenant

Body:

```json
{
  "loginToken": "...",
  "tenantId": "..."
}
```

### POST /auth/refresh

### POST /auth/logout

### GET /auth/me

## Members

- `GET /members`
- `POST /members`
- `GET /members/:id`
- `PATCH /members/:id`
- `DELETE /members/:id`

## Doctors

- `GET /doctors`
- `POST /doctors`
- `GET /doctors/:id`
- `PATCH /doctors/:id`
- `DELETE /doctors/:id`

## Patients

- `GET /patients`
- `POST /patients`
- `GET /patients/:id`
- `PATCH /patients/:id`
- `DELETE /patients/:id`

`dateOfBirth` accepts `YYYY-MM-DD` or ISO datetime.

## Visits

- `GET /patients/:patientId/visits`
- `POST /patients/:patientId/visits`

## Medicines

- `GET /medicines`
- `POST /medicines`
- `GET /medicines/:id`
- `PATCH /medicines/:id`
- `DELETE /medicines/:id`

## Prescriptions

- `GET /prescriptions`
- `POST /visits/:id/prescriptions`
- `GET /prescriptions/:id`
- `PATCH /prescriptions/:id/dispense`

## Appointments

- `GET /appointments`
  - Query params: `status=SCHEDULED|COMPLETED|CANCELLED`
- `POST /appointments`
- `GET /appointments/:id`
- `PATCH /appointments/:id`
- `DELETE /appointments/:id`

Simple double-booking prevention is enforced per tenant for same doctor + same `scheduledAt` (except cancelled entries).

## Queue

- `GET /queue`
  - Query params: `status=WAITING|IN_PROGRESS|COMPLETED|CANCELLED`, `date=YYYY-MM-DD`, `doctorId=<id>`
- `POST /queue`
- `GET /queue/:id`
- `PATCH /queue/:id/start`
- `PATCH /queue/:id/complete`
- `PATCH /queue/:id/cancel`

Queue numbers are assigned automatically per doctor per day.

## Common Error Response

```json
{
  "message": "Human readable error"
}
```
