import type { UseFormReturn } from "react-hook-form";
import { Button } from "@/components/ui";
import { SettingsSectionCard } from "@/features/settings/components/settings-section-card";
import { ProfileAccountSection } from "./profile-account-section";

type ProfileAccountCardProps = {
  form: UseFormReturn<{ name: string }>;
  email: string;
  isSaving: boolean;
  isLoading: boolean;
  onSubmit: () => void;
};

export function ProfileAccountCard({
  form,
  email,
  isSaving,
  isLoading,
  onSubmit
}: ProfileAccountCardProps) {
  return (
    <SettingsSectionCard
      title="Account"
      subtitle="Basic profile details"
      iconName="user"
      iconClassName="bg-tertiary-soft text-tertiary"
      action={
        <Button
          type="submit"
          form="profile-account-form"
          size="sm"
          startIconName="check"
          disabled={isSaving || isLoading}
        >
          Save
        </Button>
      }
    >
      <form id="profile-account-form" onSubmit={(event) => {
        event.preventDefault();
        onSubmit();
      }}>
        <ProfileAccountSection form={form} email={email} />
      </form>
    </SettingsSectionCard>
  );
}

