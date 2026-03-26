import type { UseFormReturn } from "react-hook-form";
import { Button } from "@/components/ui";
import { SettingsSectionCard } from "@/features/settings/components/settings-section-card";
import { ProfileSecuritySection } from "./profile-security-section";

type PasswordFormShape = {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
};

type ProfileSecurityCardProps = {
  form: UseFormReturn<PasswordFormShape>;
  passwordChangedAt: string | null;
  isSaving: boolean;
  onSubmit: () => void;
};

export function ProfileSecurityCard({
  form,
  passwordChangedAt,
  isSaving,
  onSubmit
}: ProfileSecurityCardProps) {
  return (
    <SettingsSectionCard
      title="Security"
      subtitle="Update password and account safety"
      iconName="lock"
      iconClassName="bg-warning-soft text-warning"
      action={
        <Button
          type="submit"
          form="profile-password-form"
          size="sm"
          startIconName="check"
          disabled={isSaving}
        >
          Save
        </Button>
      }
    >
      <form
        id="profile-password-form"
        onSubmit={(event) => {
          event.preventDefault();
          onSubmit();
        }}
      >
        <ProfileSecuritySection form={form} passwordChangedAt={passwordChangedAt} />
      </form>
    </SettingsSectionCard>
  );
}

