import type { UseFormReturn } from "react-hook-form";
import { FieldGroup, Input } from "@/components/ui";

type ProfileAccountSectionProps = {
  form: UseFormReturn<{ name: string }>;
  email: string;
};

export function ProfileAccountSection({ form, email }: ProfileAccountSectionProps) {
  return (
    <div className="space-y-4">
      <FieldGroup id="profile-email" label="Email">
        <Input id="profile-email" value={email} disabled />
      </FieldGroup>

      <FieldGroup id="profile-name" label="Display Name" error={form.formState.errors.name?.message}>
        <Input id="profile-name" {...form.register("name")} />
      </FieldGroup>
    </div>
  );
}
