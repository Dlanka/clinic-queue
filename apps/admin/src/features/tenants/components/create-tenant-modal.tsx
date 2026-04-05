import * as React from "react";
import { ghostButtonClassName, inputClassName, primaryButtonClassName } from "@/components/ui/class-names";
import { createTenant } from "../services/tenant.service";

type CreateTenantModalProps = {
  onClose: () => void;
  onCreated: () => Promise<void>;
};

export function CreateTenantModal({ onClose, onCreated }: CreateTenantModalProps) {
  const [name, setName] = React.useState("");
  const [adminEmail, setAdminEmail] = React.useState("");
  const [adminName, setAdminName] = React.useState("");
  const [adminPassword, setAdminPassword] = React.useState("");
  const [saving, setSaving] = React.useState(false);
  const [error, setError] = React.useState("");

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError("");
    setSaving(true);

    try {
      await createTenant({
        name,
        adminEmail,
        adminName: adminName || undefined,
        adminPassword,
        adminRoles: ["ADMIN"]
      });
      await onCreated();
    } catch {
      setError("Failed to create tenant.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 grid place-items-center bg-black/70 px-4" role="dialog" aria-modal="true">
      <div className="w-full max-w-lg rounded-xl border border-admin-border bg-admin-panel p-5 shadow-[0_18px_60px_rgba(4,18,18,0.7)]">
        <div className="flex items-center justify-between gap-2">
          <h2 className="text-lg font-semibold text-neutral-100">Create Tenant</h2>
          <button type="button" className={ghostButtonClassName} onClick={onClose}>
            Close
          </button>
        </div>

        <form className="mt-4 grid gap-3" onSubmit={handleSubmit}>
          <label className="grid gap-1.5 text-sm text-neutral-300">
            <span>Tenant Name</span>
            <input className={inputClassName} value={name} onChange={(event) => setName(event.target.value)} required />
          </label>
          <label className="grid gap-1.5 text-sm text-neutral-300">
            <span>Admin Email</span>
            <input
              className={inputClassName}
              type="email"
              value={adminEmail}
              onChange={(event) => setAdminEmail(event.target.value)}
              required
            />
          </label>
          <label className="grid gap-1.5 text-sm text-neutral-300">
            <span>Admin Name</span>
            <input className={inputClassName} value={adminName} onChange={(event) => setAdminName(event.target.value)} />
          </label>
          <label className="grid gap-1.5 text-sm text-neutral-300">
            <span>Admin Password</span>
            <input
              className={inputClassName}
              type="password"
              value={adminPassword}
              onChange={(event) => setAdminPassword(event.target.value)}
              required
            />
          </label>
          {error ? <p className="text-sm text-red-300">{error}</p> : null}
          <div className="mt-1 flex justify-end gap-2">
            <button type="button" className={ghostButtonClassName} onClick={onClose}>
              Cancel
            </button>
            <button type="submit" disabled={saving} className={primaryButtonClassName}>
              {saving ? "Creating..." : "Create Tenant"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
