import { Button } from "@/components/ui";
import type { TenantChoice } from "@/services/auth.service";

type TenantSelectionFormProps = {
  tenants: TenantChoice[];
  selectedTenantId: string;
  isPending: boolean;
  onSelectTenantId: (tenantId: string) => void;
  onContinue: () => void;
  onBack: () => void;
};

export function TenantSelectionForm({
  tenants,
  selectedTenantId,
  isPending,
  onSelectTenantId,
  onContinue,
  onBack
}: TenantSelectionFormProps) {
  return (
    <>
      <p className="inline-flex rounded-full bg-primary-soft px-3 py-1 text-xs font-bold uppercase tracking-[0.08em] text-primary">
        Tenant
      </p>
      <h1 className="mt-5 text-2xl font-extrabold tracking-tight text-neutral-95">Select tenant</h1>
      <p className="mt-1 max-w-2/3 text-xs text-neutral-70">
        This account belongs to multiple clinics. Choose one to continue.
      </p>

      <div className="mt-8 space-y-3">
        {tenants.map((tenant) => (
          <button
            key={tenant.tenantId}
            type="button"
            onClick={() => onSelectTenantId(tenant.tenantId)}
            className={`w-full cursor-pointer rounded-md border px-4 py-3 text-left text-sm transition-colors ${
              selectedTenantId === tenant.tenantId
                ? "border-primary/40 bg-primary-soft font-bold text-primary"
                : "border-neutral-variant-80 text-neutral-95 hover:border-neutral-variant-70"
            }`}
          >
            {tenant.tenantName}
          </button>
        ))}
      </div>

      <div className="mt-4 space-y-2">
        <Button
          type="button"
          size="lg"
          className="w-full"
          disabled={!selectedTenantId || isPending}
          onClick={onContinue}
        >
          Continue
        </Button>

        <Button type="button" intent="ghost" className="w-full" onClick={onBack}>
          Back
        </Button>
      </div>
    </>
  );
}
