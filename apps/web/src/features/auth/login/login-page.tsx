import { Navigate, useNavigate } from "@tanstack/react-router";
import { ShieldCheck } from "lucide-react";
import { useEffect } from "react";
import { Chip } from "@/components/ui";
import { useMe } from "@/hooks/use-me";
import { LoginFlowProvider, useLoginFlow } from "./context/login-flow.context";
import { LoginCredentialsForm, LoginMarketingPanel, TenantSelectionForm } from "./components";
import { useLoginActions, useLoginForm } from "./hooks";

export function LoginPage() {
  return (
    <LoginFlowProvider>
      <LoginPageContent />
    </LoginFlowProvider>
  );
}

function LoginPageContent() {
  const navigate = useNavigate();
  const meQuery = useMe(true);
  const form = useLoginForm();
  const {
    loginToken,
    tenants,
    selectedTenantId,
    inTenantSelectionMode,
    setSelectedTenantId,
    startTenantSelection,
    resetTenantSelection
  } = useLoginFlow();
  const { loginMutation, selectTenantMutation } = useLoginActions({
    navigate,
    loginToken,
    selectedTenantId,
    startTenantSelection
  });

  useEffect(() => {
    if (meQuery.isSuccess && meQuery.data) {
      navigate({ to: "/" });
    }
  }, [meQuery.data, meQuery.isSuccess, navigate]);

  if (meQuery.isSuccess && meQuery.data) {
    return <Navigate to="/" />;
  }

  return (
    <div className="h-screen bg-neutral-10">
      <div className="relative grid h-full overflow-hidden rounded-2xl border border-neutral-variant-90/50 bg-neutral-20 lg:grid-cols-[minmax(0,1fr)_520px]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,color-mix(in_srgb,var(--color-primary)_24%,transparent),transparent_45%),radial-gradient(circle_at_70%_80%,color-mix(in_srgb,var(--color-tertiary)_22%,transparent),transparent_40%)] opacity-30" />

        <LoginMarketingPanel />

        <section className="relative flex min-h-[calc(100vh-24px)] items-center justify-center bg-neutral-20/95 p-6 md:p-10">
          <div className="absolute right-8 top-8 hidden md:block">
            <Chip tone="success" label="System Online" />
          </div>

          <div className="w-full max-w-sm">
            {!inTenantSelectionMode ? (
              <LoginCredentialsForm
                form={form}
                isPending={loginMutation.isPending}
                onSubmit={(values) => loginMutation.mutate(values)}
              />
            ) : (
              <TenantSelectionForm
                tenants={tenants}
                selectedTenantId={selectedTenantId}
                isPending={selectTenantMutation.isPending}
                onSelectTenantId={setSelectedTenantId}
                onContinue={() => selectTenantMutation.mutate()}
                onBack={resetTenantSelection}
              />
            )}

            <p className="mt-8 flex items-center justify-center gap-2 text-sm text-neutral-70">
              <ShieldCheck size={15} className="text-success" />
              Secured with TLS 1.3 · HIPAA compliant
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
