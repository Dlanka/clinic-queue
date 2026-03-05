export const APP_ROLES = ["ADMIN", "RECEPTION", "DOCTOR", "NURSE", "PHARMACY_STAFF"] as const;

export type AppRole = (typeof APP_ROLES)[number];
