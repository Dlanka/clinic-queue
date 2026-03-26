import type { QueueSettingsPayload } from "@/services/settings.service";

function parseDigits(value: string | undefined) {
  const parsed = Number.parseInt(value ?? "", 10);
  if (!Number.isFinite(parsed) || parsed <= 0) {
    return 3;
  }
  return Math.min(parsed, 8);
}

export function formatQueueTicket(
  queueNumber: number,
  queueSettings?: Partial<QueueSettingsPayload>
) {
  const prefix = queueSettings?.queuePrefix?.trim() || "Q-";
  const digits = parseDigits(queueSettings?.queueNumberDigits);
  const numberLabel = String(queueNumber).padStart(digits, "0");
  return `${prefix}${numberLabel}`;
}
