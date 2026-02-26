# UI_SPEC — UI Shell + Base Components

## 1. Layout

- Sidebar + topbar layout.
- Sidebar items: Dashboard, Queue, Appointments, Patients, Doctors, Medicines, Prescriptions, Users.
- Responsive: sidebar collapses on small screens.

## 2. Theme

- Use CSS variables for: primary (blue), secondary (blue variant), neutral, neutral-variant, success, danger, warning.
- Tailwind colors map to CSS variables.

## 3. Base Components (tailwind-variants)

Each component:

- lives in components/ui/<name>/
- has \*.tv.ts
- has index.ts
- barrel export components/ui/index.ts

Components:

- Button
- Input (+ error state)
- Table (+ empty state slot)
- Modal (dialog)
- Toast (success/error) + hook
- Skeleton loader (optional)

## 4. Forms

- react-hook-form + zod resolver
- inline errors, loading states, toasts
