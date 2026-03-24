export const queueQueryKey = ["queue", "ALL"] as const;

export type QueueStatusFilter = "ALL" | "WAITING" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED";
