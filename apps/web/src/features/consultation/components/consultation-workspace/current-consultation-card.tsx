import { format } from "date-fns";
import { useEffect, useMemo, useState } from "react";
import { Avatar, Badge, Button, Card } from "@/components/ui";
import { useTenantSettings } from "@/hooks/use-tenant-settings";
import { iconMap } from "@/config/icons";
import type { PatientGender } from "@/services/patient.service";
import type { QueueEntry } from "@/services/queue.service";
import { formatQueueTicket } from "@/utils/queue-ticket";

interface CurrentConsultationCardProps {
  entry: QueueEntry | null;
  patientGender?: PatientGender;
  patientAge?: number | null;
  onContinue: (entry: QueueEntry) => void;
}

export function CurrentConsultationCard({
  entry,
  patientGender,
  patientAge,
  onContinue
}: CurrentConsultationCardProps) {
  const ClockIcon = iconMap.clock3;
  const settingsQuery = useTenantSettings();
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    if (!entry) {
      return;
    }

    const timer = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(timer);
  }, [entry]);

  const elapsedLabel = useMemo(() => {
    if (!entry) {
      return null;
    }

    const startDate = entry.startedAt ? new Date(entry.startedAt) : new Date(entry.createdAt);
    const elapsedSeconds = Math.max(0, Math.floor((now - startDate.getTime()) / 1000));
    const hours = Math.floor(elapsedSeconds / 3600);
    const minutes = Math.floor((elapsedSeconds % 3600) / 60);
    const seconds = elapsedSeconds % 60;

    const hh = String(hours).padStart(2, "0");
    const mm = String(minutes).padStart(2, "0");
    const ss = String(seconds).padStart(2, "0");

    return `${hh}:${mm}:${ss}`;
  }, [entry, now]);

  const demographicLabel = useMemo(() => {
    const genderLabel = patientGender
      ? patientGender.charAt(0).toUpperCase() + patientGender.slice(1).toLowerCase()
      : null;
    const ageLabel = typeof patientAge === "number" ? `${patientAge} yrs` : null;

    if (genderLabel && ageLabel) {
      return `${genderLabel} - ${ageLabel}`;
    }

    return genderLabel ?? ageLabel ?? null;
  }, [patientAge, patientGender]);

  return (
    <Card className="overflow-hidden">
      {!entry ? (
        <Card.Body className="py-4">
          <p className="text-sm text-neutral-70">No active consultation in progress.</p>
        </Card.Body>
      ) : (
        <Card.Body className="flex flex-wrap items-center justify-between gap-4 py-4">
          <div className="flex min-w-0 items-center gap-3">
            <Avatar
              name={entry.patientName}
              size="lg"
              className="size-11 shrink-0 rounded-lg text-base"
            />
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-3">
                <p className="truncate text-base font-bold text-neutral-90">{entry.patientName}</p>
                <Badge tone="info" size="sm" withDot>
                  IN PROGRESS
                </Badge>
              </div>
              <p className="truncate text-xs font-bold text-neutral-70 inline-flex gap-3 leading-tight items-center">
                <span className="flex ">{formatQueueTicket(entry.queueNumber, settingsQuery.data?.queue)}</span>
                <span className="inline-flex items-center gap-1">
                  <ClockIcon size={12} />
                  Started{" "}
                  {entry.startedAt ? format(new Date(entry.startedAt), "h:mm a") : "just now"}
                </span>
                {demographicLabel ? <span>{demographicLabel}</span> : null}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Badge tone="info" size="md" className="w-20 justify-center">
              {elapsedLabel}
            </Badge>
            <Button size="sm" startIconName="activity" onClick={() => onContinue(entry)}>
              Continue
            </Button>
          </div>
        </Card.Body>
      )}
    </Card>
  );
}


