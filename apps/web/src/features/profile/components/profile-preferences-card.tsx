import type { UseFormReturn } from "react-hook-form";
import { Button } from "@/components/ui";
import { SettingsSectionCard } from "@/features/settings/components/settings-section-card";
import { ProfilePreferencesSection } from "./profile-preferences-section";

type PreferencesFormShape = {
  language: string;
  timezone: string;
  dateFormat: string;
  timeFormat: string;
  emailNotifications: boolean;
  inAppNotifications: boolean;
};

type ProfilePreferencesCardProps = {
  form: UseFormReturn<PreferencesFormShape>;
  isSaving: boolean;
  onSubmit: () => void;
};

export function ProfilePreferencesCard({ form, isSaving, onSubmit }: ProfilePreferencesCardProps) {
  return (
    <SettingsSectionCard
      title="Preferences"
      subtitle="Language, timezone and notification preferences"
      iconName="settings"
      iconClassName="bg-primary-soft text-primary"
      action={
        <Button
          type="submit"
          form="profile-preferences-form"
          size="sm"
          startIconName="check"
          disabled={isSaving}
        >
          Save
        </Button>
      }
    >
      <form
        id="profile-preferences-form"
        onSubmit={(event) => {
          event.preventDefault();
          onSubmit();
        }}
      >
        <ProfilePreferencesSection form={form} />
      </form>
    </SettingsSectionCard>
  );
}

