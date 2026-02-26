# SRS — Clinic Queue Management System (Multi-Tenant)

## 1. Overview

A multi-tenant clinic system to manage patients, appointments, queue/visits, prescriptions, and medicines with strict tenant isolation.

## 2. Key Concepts

- **Tenant**: a clinic organization.
- **Account**: global identity (email unique globally).
- **TenantMember**: membership of an Account in a Tenant with multiple roles.
- **Patient**: person receiving care under a tenant.
- **Appointment**: scheduled time with a doctor.
- **Queue Entry**: patient waiting/being served by a doctor on a given date.
- **Visit**: clinical encounter record (symptoms, diagnosis, notes).
- **Prescription**: medicines prescribed for a visit.
- **Medicine**: tenant’s medicine catalog and stock.

## 3. Roles

- ADMIN, RECEPTION, DOCTOR, NURSE, PHARMACY_STAFF
  A TenantMember can have multiple roles within the same tenant.

## 4. Business Rules

### 4.1 Multi-tenancy

- All data is isolated per tenant.
- All records must be associated with exactly one tenant.
- A single Account can belong to multiple tenants via TenantMember.

### 4.2 Authentication & Security (business requirement)

- Authentication must use **httpOnly cookies** (no tokens stored in browser storage).
- CSRF protection must be enforced for state-changing operations.
- Access is controlled by roles.

### 4.3 Patients

- Tenant can create/update/deactivate patients.
- Patient history must be retrievable (visits, prescriptions, appointments).

### 4.4 Doctors

- Tenant can manage doctors.
- Doctors can conduct visits and issue prescriptions.

### 4.5 Visits & History

- A visit must link a patient + doctor + date/time.
- Visit stores symptoms, diagnosis, notes, and optionally vitals.
- Visit history is immutable (edits should be tracked if implemented later).

### 4.6 Prescriptions

- Only DOCTOR can create prescriptions.
- Pharmacy staff can view prescriptions and mark dispensing status (optional phase).

### 4.7 Medicines

- Tenant manages medicine catalog (name, category, price, stock).
- Low stock should be identifiable.

### 4.8 Appointments

- Appointments can be created by RECEPTION/ADMIN.
- Appointment status: SCHEDULED, COMPLETED, CANCELLED.

### 4.9 Queue

- Queue entries are per doctor per day.
- Queue status: WAITING, IN_PROGRESS, COMPLETED, CANCELLED.
- Reception adds patients to queue.
- Doctor moves queue entry through statuses and completes a visit.

## 5. Acceptance Criteria

- Tenant isolation verified.
- Same email can join multiple tenants.
- TenantMember supports multiple roles.
- Cookie-only auth + CSRF verified.
- Core workflows work end-to-end:
  - Reception adds patient → queue → doctor visit → prescription → pharmacy view.
