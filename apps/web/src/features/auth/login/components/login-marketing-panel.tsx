import { Activity } from "lucide-react";
import { FeatureCard } from "./feature-card";
import { Pill } from "./pill";

export function LoginMarketingPanel() {
  return (
    <section className="relative hidden border-r border-neutral-variant-90/40 lg:block">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,color-mix(in_srgb,var(--color-primary)_12%,transparent)_1px,transparent_1px),linear-gradient(to_bottom,color-mix(in_srgb,var(--color-primary)_10%,transparent)_1px,transparent_1px)] bg-[size:42px_42px] opacity-35" />
      <div className="relative flex h-full flex-col justify-between p-10">
        <div>
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-linear-to-br from-primary to-tertiary text-on-primary shadow-[0_10px_40px_color-mix(in_srgb,var(--color-primary)_35%,transparent)]">
              <Activity size={18} />
            </div>
            <div>
              <p className="text-xl font-extrabold leading-none text-neutral-95">Queue</p>
              <p className="text-xs text-neutral-70">Milestone 3 · SaaS Platform</p>
            </div>
          </div>

          <div className="relative mt-20 flex h-80 flex-col gap-4">
            <FeatureCard
              className="w-75"
              title="Live Queue Management"
              subtitle="Real-time patient tracking"
              value="5"
              tone="primary"
            />
            <div className="ml-10">
              <FeatureCard
                className="w-75"
                title="Smart Appointments"
                subtitle="Auto-routing and scheduling"
                value="12"
                tone="tertiary"
              />
            </div>
            <div className="ml-5">
              <FeatureCard
                className="w-75"
                title="Patient Records"
                subtitle="Secure health data hub"
                value="148"
                tone="success"
              />
            </div>
          </div>
        </div>

        <div>
          <div className="max-w-1/3">
            <h2 className="max-w-md text-2xl font-extrabold tracking-tight text-neutral-95">
              Modern clinic operations, simplified.
            </h2>
            <p className="mt-2 max-w-lg text-sm text-neutral-70">
              Manage your queue, appointments, and patient records in one place.
            </p>
          </div>
          <div className="mt-8 flex flex-wrap gap-2">
            <Pill label="Multi-tenant" />
            <Pill label="Role-based access" />
            <Pill label="Real-time sync" />
          </div>
        </div>
      </div>
    </section>
  );
}
