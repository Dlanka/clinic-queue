import * as React from "react";
import { ghostButtonClassName, inputClassName, primaryButtonClassName } from "@/components/ui/class-names";
import { login, selectTenant } from "../services/auth.service";

type LoginScreenProps = {
  onSuccess: () => Promise<void>;
};

export function LoginScreen({ onSuccess }: LoginScreenProps) {
  const [email, setEmail] = React.useState("superadmin@yourapp.com");
  const [password, setPassword] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState("");
  const [tenantSelection, setTenantSelection] = React.useState<{
    loginToken: string;
    tenants: Array<{ tenantId: string; tenantName: string }>;
  } | null>(null);

  async function handleLogin(event: React.FormEvent) {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await login(email, password);

      if (result.mode === "SELECT_TENANT") {
        setTenantSelection({
          loginToken: result.loginToken,
          tenants: result.tenants
        });
      } else {
        await onSuccess();
      }
    } catch {
      setError("Login failed. Check your credentials.");
    } finally {
      setLoading(false);
    }
  }

  async function handleSelectTenant(tenantId: string) {
    if (!tenantSelection) {
      return;
    }

    setError("");
    setLoading(true);
    try {
      await selectTenant(tenantSelection.loginToken, tenantId);
      await onSuccess();
    } catch {
      setError("Tenant selection failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="grid min-h-screen place-items-center px-5 py-8">
      <div className="w-full max-w-md rounded-xl border border-admin-border bg-admin-panel/90 p-5 shadow-[0_10px_40px_rgba(4,20,20,0.45)] backdrop-blur">
        <h1 className="text-xl font-bold text-neutral-100">Clinic Queue Super Admin</h1>
        <p className="mt-1 text-sm text-admin-muted">Sign in to manage tenants</p>

        {!tenantSelection ? (
          <form className="mt-4 grid gap-3" onSubmit={handleLogin}>
            <label className="grid gap-1.5 text-sm text-neutral-300">
              <span>Email</span>
              <input
                className={inputClassName}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                required
              />
            </label>
            <label className="grid gap-1.5 text-sm text-neutral-300">
              <span>Password</span>
              <input
                className={inputClassName}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                required
              />
            </label>
            {error ? <p className="text-sm text-red-300">{error}</p> : null}
            <button type="submit" disabled={loading} className={primaryButtonClassName}>
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </form>
        ) : (
          <div className="mt-4 grid gap-3">
            <p className="text-sm text-admin-muted">Select tenant for this session:</p>
            <div className="grid gap-2">
              {tenantSelection.tenants.map((tenant) => (
                <button
                  key={tenant.tenantId}
                  type="button"
                  onClick={() => void handleSelectTenant(tenant.tenantId)}
                  disabled={loading}
                  className={ghostButtonClassName}
                >
                  {tenant.tenantName}
                </button>
              ))}
            </div>
            {error ? <p className="text-sm text-red-300">{error}</p> : null}
          </div>
        )}
      </div>
    </div>
  );
}
