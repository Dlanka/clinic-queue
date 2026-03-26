import { format } from "date-fns";
import type { UseFormReturn } from "react-hook-form";
import { FieldGroup, Input } from "@/components/ui";

type PasswordFormShape = {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
};

type ProfileSecuritySectionProps = {
  form: UseFormReturn<PasswordFormShape>;
  passwordChangedAt: string | null;
};

export function ProfileSecuritySection({ form, passwordChangedAt }: ProfileSecuritySectionProps) {
  return (
    <div className="space-y-4">
      <FieldGroup
        id="profile-current-password"
        label="Current Password"
        error={form.formState.errors.currentPassword?.message}
      >
        <Input id="profile-current-password" type="password" {...form.register("currentPassword")} />
      </FieldGroup>

      <FieldGroup
        id="profile-new-password"
        label="New Password"
        error={form.formState.errors.newPassword?.message}
      >
        <Input id="profile-new-password" type="password" {...form.register("newPassword")} />
      </FieldGroup>

      <FieldGroup
        id="profile-confirm-password"
        label="Confirm Password"
        error={form.formState.errors.confirmPassword?.message}
      >
        <Input id="profile-confirm-password" type="password" {...form.register("confirmPassword")} />
      </FieldGroup>

      <p className="text-xs text-neutral-70">
        Last changed: {passwordChangedAt ? format(new Date(passwordChangedAt), "MMM d, yyyy h:mm a") : "-"}
      </p>
    </div>
  );
}
