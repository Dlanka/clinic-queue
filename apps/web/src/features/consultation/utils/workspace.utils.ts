import type { QueueEntry } from "@/services/queue.service";

export function sortByQueueAndPriority(rows: QueueEntry[]) {
  return [...rows].sort((a, b) => {
    if (a.isPriority !== b.isPriority) {
      return a.isPriority ? -1 : 1;
    }

    return a.queueNumber - b.queueNumber;
  });
}

export function initialsFromName(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((token) => token[0]?.toUpperCase() ?? "")
    .join("");
}

export function normalizeDoctorName(value: string) {
  return value
    .toLowerCase()
    .replace(/\bdr\.?\b/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

export function calculateAgeFromDate(dateOfBirth?: string) {
  if (!dateOfBirth) {
    return null;
  }

  const dob = new Date(dateOfBirth);
  if (Number.isNaN(dob.getTime())) {
    return null;
  }

  const now = new Date();
  let age = now.getFullYear() - dob.getFullYear();
  const monthDiff = now.getMonth() - dob.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && now.getDate() < dob.getDate())) {
    age -= 1;
  }

  return age >= 0 ? age : null;
}
