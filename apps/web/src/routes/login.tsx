import axios from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Navigate, createRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useForm, type Resolver } from "react-hook-form";
import { z } from "zod";
import { Button, Card, FieldGroup, Input, useToast } from "@/components/ui";
import { useMe, meQueryKey } from "@/hooks/use-me";
import { AuthService, type TenantChoice } from "@/services/auth.service";
import { rootRoute } from "./root";

const loginSchema = z.object({
  email: z.string().email("Valid email is required"),
  password: z.string().min(1, "Password is required")
});

type LoginForm = z.infer<typeof loginSchema>;

const loginResolver: Resolver<LoginForm> = async (values) => {
  const parsed = loginSchema.safeParse(values);
  if (parsed.success) {
    return { values: parsed.data, errors: {} };
  }

  const errors = parsed.error.issues.reduce<Record<string, { type: string; message: string }>>(
    (acc, issue) => {
      const fieldName = String(issue.path[0] ?? "root");
      acc[fieldName] = { type: "manual", message: issue.message };
      return acc;
    },
    {}
  );

  return { values: {}, errors: errors as never };
};

export const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/login",
  component: LoginPage
});

function LoginPage() {
  const navigate = useNavigate();
  const toast = useToast();
  const queryClient = useQueryClient();
  const meQuery = useMe(true);
  const [loginToken, setLoginToken] = useState("");
  const [tenants, setTenants] = useState<TenantChoice[]>([]);
  const [selectedTenantId, setSelectedTenantId] = useState("");

  const form = useForm<LoginForm>({
    resolver: loginResolver,
    defaultValues: {
      email: "",
      password: ""
    }
  });

  const loginMutation = useMutation({
    mutationFn: ({ email, password }: LoginForm) => AuthService.login(email, password),
    onSuccess: async (response) => {
      if (response.mode === "LOGGED_IN") {
        await queryClient.invalidateQueries({ queryKey: meQueryKey });
        await navigate({ to: "/" });
        return;
      }

      setLoginToken(response.loginToken);
      setTenants(response.tenants);
      setSelectedTenantId(response.tenants[0]?.tenantId ?? "");
    },
    onError: (error) => {
      const message =
        axios.isAxiosError(error) && typeof error.response?.data?.message === "string"
          ? error.response.data.message
          : "Unable to login";
      toast.error("Login failed", message);
    }
  });

  const selectTenantMutation = useMutation({
    mutationFn: () => AuthService.selectTenant(loginToken, selectedTenantId),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: meQueryKey });
      await navigate({ to: "/" });
    },
    onError: (error) => {
      const message =
        axios.isAxiosError(error) && typeof error.response?.data?.message === "string"
          ? error.response.data.message
          : "Unable to select tenant";
      toast.error("Tenant selection failed", message);
    }
  });

  useEffect(() => {
    if (meQuery.data) {
      navigate({ to: "/" });
    }
  }, [meQuery.data, navigate]);

  if (meQuery.data) {
    return <Navigate to="/" />;
  }

  const inTenantSelectionMode = Boolean(loginToken);

  return (
    <div className="grid min-h-screen place-items-center bg-neutral-20 p-4">
      <Card className="w-full max-w-md">
        <Card.Header
          title={inTenantSelectionMode ? "Select Tenant" : "Sign In"}
          subtitle={
            inTenantSelectionMode
              ? "Choose a tenant to continue."
              : "Use your account credentials to continue."
          }
          iconName="user"
          iconClassName="bg-primary-soft text-primary"
        />
        <Card.Body>
          {!inTenantSelectionMode ? (
            <form className="space-y-4" onSubmit={form.handleSubmit((values) => loginMutation.mutate(values))}>
              <FieldGroup id="email" label="Email" error={form.formState.errors.email?.message}>
                <Input
                  id="email"
                  type="email"
                  placeholder="user@clinic.com"
                  invalid={Boolean(form.formState.errors.email)}
                  {...form.register("email")}
                />
              </FieldGroup>
              <FieldGroup id="password" label="Password" error={form.formState.errors.password?.message}>
                <Input
                  id="password"
                  type="password"
                  placeholder="Password"
                  invalid={Boolean(form.formState.errors.password)}
                  {...form.register("password")}
                />
              </FieldGroup>
              <Button type="submit" className="w-full" disabled={loginMutation.isPending}>
                Continue
              </Button>
            </form>
          ) : (
            <div className="space-y-3">
              <div className="space-y-2">
                {tenants.map((tenant) => (
                  <button
                    key={tenant.tenantId}
                    type="button"
                    onClick={() => setSelectedTenantId(tenant.tenantId)}
                    className={`w-full rounded-lg border px-4 py-3 text-left transition-colors ${
                      selectedTenantId === tenant.tenantId
                        ? "border-primary bg-primary-soft text-primary"
                        : "border-neutral-variant-80 text-neutral-95 hover:border-neutral-variant-70"
                    }`}
                  >
                    {tenant.tenantName}
                  </button>
                ))}
              </div>
              <Button
                type="button"
                className="w-full"
                disabled={!selectedTenantId || selectTenantMutation.isPending}
                onClick={() => selectTenantMutation.mutate()}
              >
                Enter Tenant
              </Button>
              <Button
                type="button"
                intent="ghost"
                className="w-full"
                onClick={() => {
                  setLoginToken("");
                  setTenants([]);
                  setSelectedTenantId("");
                }}
              >
                Back
              </Button>
            </div>
          )}
        </Card.Body>
      </Card>
    </div>
  );
}
