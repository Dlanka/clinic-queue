import { Button } from "@/components/ui";
import type { AuthSessionItem } from "@/services/auth.service";
import { SettingsSectionCard } from "@/features/settings/components/settings-section-card";
import { ProfileSessionsSection } from "./profile-sessions-section";

type ProfileSessionsCardProps = {
  sessions: AuthSessionItem[];
  isLoading: boolean;
  isRevokingSession: boolean;
  isRevokingOthers: boolean;
  onRevokeSession: (sessionId: string) => void;
  onRevokeOthers: () => void;
};

export function ProfileSessionsCard({
  sessions,
  isLoading,
  isRevokingSession,
  isRevokingOthers,
  onRevokeSession,
  onRevokeOthers
}: ProfileSessionsCardProps) {
  return (
    <SettingsSectionCard
      title="Active Sessions"
      subtitle="Manage signed-in devices"
      iconName="clock3"
      iconClassName="bg-info-soft text-info"
      action={
        <Button
          size="sm"
          variant="tonal"
          intent="warning"
          startIconName="x"
          disabled={isRevokingOthers}
          onClick={onRevokeOthers}
        >
          Sign Out Others
        </Button>
      }
    >
      <ProfileSessionsSection
        sessions={sessions}
        isLoading={isLoading}
        isRevokingSession={isRevokingSession}
        onRevokeSession={onRevokeSession}
      />
    </SettingsSectionCard>
  );
}

