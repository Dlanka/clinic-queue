import * as React from "react";
import { ghostButtonClassName, inputClassName, primaryButtonClassName } from "@/components/ui/class-names";
import { CreateTenantModal } from "./create-tenant-modal";
import { listTenants, updateTenantStatus } from "../services/tenant.service";
import type { TenantItem } from "../types";

type TenantsScreenProps = {
  userName: string;
  onLogout: () => Promise<void>;
};

export function TenantsScreen({ userName, onLogout }: TenantsScreenProps) {
  const [rows, setRows] = React.useState<TenantItem[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState("");
  const [search, setSearch] = React.useState("");
  const [status, setStatus] = React.useState<"" | "ACTIVE" | "INACTIVE">("");
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  async function loadTenants(nextSearch = search, nextStatus = status) {
    setLoading(true);
    setError("");

    try {
      const result = await listTenants(nextSearch, nextStatus || undefined);
      setRows(result);
    } catch {
      setError("Failed to load tenants");
    } finally {
      setLoading(false);
    }
  }

  React.useEffect(() => {
    void loadTenants();
  }, []);

  async function handleToggleStatus(row: TenantItem) {
    const nextStatus = row.status === "ACTIVE" ? "INACTIVE" : "ACTIVE";
    try {
      await updateTenantStatus(row.id, nextStatus);
      await loadTenants();
    } catch {
      setError("Failed to update tenant status");
    }
  }

  return (
    <div className="mx-auto grid min-h-screen w-full max-w-6xl content-start gap-4 px-5 py-6">
      <header className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-admin-border bg-admin-panel/90 px-5 py-4">
        <div>
          <h1 className="text-2xl font-bold text-neutral-100">Tenant Management</h1>
          <p className="mt-1 text-sm text-admin-muted">Create and manage clinic tenants</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full border border-neutral-700 px-3 py-1 text-xs text-neutral-300">
            {userName}
          </span>
          <button type="button" onClick={() => setIsModalOpen(true)} className={primaryButtonClassName}>
            New Tenant
          </button>
          <button type="button" className={ghostButtonClassName} onClick={() => void onLogout()}>
            Logout
          </button>
        </div>
      </header>

      <section className="rounded-xl border border-admin-border bg-admin-panel/90 p-4">
        <div className="mb-3 grid gap-2 md:grid-cols-[1fr_180px_auto]">
          <input
            className={inputClassName}
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search tenant..."
          />
          <select
            className={inputClassName}
            value={status}
            onChange={(event) => setStatus(event.target.value as typeof status)}
          >
            <option value="">All</option>
            <option value="ACTIVE">Active</option>
            <option value="INACTIVE">Inactive</option>
          </select>
          <button type="button" onClick={() => void loadTenants(search, status)} className={primaryButtonClassName}>
            Filter
          </button>
        </div>

        {error ? <p className="mb-2 text-sm text-red-300">{error}</p> : null}

        {loading ? (
          <p className="text-sm text-admin-muted">Loading tenants...</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="border-b border-neutral-700/30">
                  <th className="px-2 py-2 text-left text-xs uppercase tracking-wide text-neutral-400">Name</th>
                  <th className="px-2 py-2 text-left text-xs uppercase tracking-wide text-neutral-400">Status</th>
                  <th className="px-2 py-2 text-left text-xs uppercase tracking-wide text-neutral-400">Members</th>
                  <th className="px-2 py-2 text-left text-xs uppercase tracking-wide text-neutral-400">Action</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={row.id} className="border-b border-neutral-700/20">
                    <td className="px-2 py-3 text-neutral-100">{row.name}</td>
                    <td className="px-2 py-3">
                      <span
                        className={
                          row.status === "ACTIVE"
                            ? "rounded-full bg-emerald-400/15 px-2 py-1 text-xs font-semibold text-emerald-300"
                            : "rounded-full bg-rose-400/15 px-2 py-1 text-xs font-semibold text-rose-300"
                        }
                      >
                        {row.status}
                      </span>
                    </td>
                    <td className="px-2 py-3 text-neutral-300">{row.memberCount}</td>
                    <td className="px-2 py-3">
                      <button
                        type="button"
                        className={ghostButtonClassName}
                        onClick={() => void handleToggleStatus(row)}
                      >
                        {row.status === "ACTIVE" ? "Deactivate" : "Activate"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {isModalOpen ? (
        <CreateTenantModal
          onClose={() => setIsModalOpen(false)}
          onCreated={async () => {
            setIsModalOpen(false);
            await loadTenants();
          }}
        />
      ) : null}
    </div>
  );
}
