import type { UseFormReturn } from "react-hook-form";
import { Button, FieldGroup, Input } from "@/components/ui";
import type { LoginFormValues } from "../schemas/login.schema";

type LoginCredentialsFormProps = {
  form: UseFormReturn<LoginFormValues>;
  isPending: boolean;
  onSubmit: (values: LoginFormValues) => void;
};

export function LoginCredentialsForm({ form, isPending, onSubmit }: LoginCredentialsFormProps) {
  return (
    <>
      <p className="inline-flex rounded-full bg-primary-soft px-3 py-1 text-xs font-bold uppercase tracking-[0.08em] text-primary">
        Sign In
      </p>
      <h1 className="mt-5 text-2xl font-extrabold tracking-tight text-neutral-95">Welcome back</h1>
      <p className="mt-3 text-xs text-neutral-70">
        Sign in to your Queue account <br />
        to continue managing your clinic.
      </p>

      <form className="mt-8 space-y-5" onSubmit={form.handleSubmit(onSubmit)}>
        <FieldGroup id="email" label="Email Address" error={form.formState.errors.email?.message}>
          <Input
            id="email"
            type="email"
            placeholder="you@clinic.com"
            startIconName="mail"
            invalid={Boolean(form.formState.errors.email)}
            {...form.register("email")}
          />
        </FieldGroup>

        <FieldGroup
          id="password"
          label="Password"
          error={form.formState.errors.password?.message}
        >
          <Input
            id="password"
            type="password"
            placeholder="Enter your password"
            startIconName="lock"
            invalid={Boolean(form.formState.errors.password)}
            {...form.register("password")}
          />
        </FieldGroup>

        <div className="pt-5">
          <Button
            type="submit"
            size="lg"
            className="w-full"
            disabled={isPending}
            endIconName="arrowRight"
          >
            Sign in
          </Button>
        </div>
      </form>
    </>
  );
}
