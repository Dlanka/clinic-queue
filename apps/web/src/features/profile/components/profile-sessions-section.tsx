import { format } from "date-fns";
import { Badge, Button } from "@/components/ui";
import type { AuthSessionItem } from "@/services/auth.service";

type ProfileSessionsSectionProps = {
  sessions: AuthSessionItem[];
  isLoading: boolean;
  isRevokingSession: boolean;
  onRevokeSession: (sessionId: string) => void;
};

export function ProfileSessionsSection({
  sessions,
  isLoading,
  isRevokingSession,
  onRevokeSession
}: ProfileSessionsSectionProps) {
  if (isLoading) {
    return <p className="text-sm text-neutral-70">Loading sessions...</p>;
  }

  if (sessions.length === 0) {
    return <p className="text-sm text-neutral-70">No active sessions found.</p>;
  }

  return (
    <div className="space-y-2">
      {sessions.map((session) => (
        <div
          key={session.sessionId}
          className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-subtle bg-neutral-20/60 px-3 py-3"
        >
          <div>
            <p className="text-sm font-semibold text-neutral-90">
              {session.isCurrent ? "Current session" : `Session ${session.sessionId.slice(0, 8)}`}
            </p>
            <p className="text-xs text-neutral-70">
              Last seen {format(new Date(session.lastSeenAt), "MMM d, yyyy h:mm a")}
            </p>
          </div>

          {session.isCurrent ? (
            <Badge tone="success" size="sm">
              Current
            </Badge>
          ) : (
            <Button
              size="sm"
              variant="text"
              intent="danger"
              startIconName="x"
              disabled={isRevokingSession}
              onClick={() => onRevokeSession(session.sessionId)}
            >
              Sign Out
            </Button>
          )}
        </div>
      ))}
    </div>
  );
}

