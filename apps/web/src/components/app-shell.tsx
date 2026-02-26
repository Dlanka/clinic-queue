import type { PropsWithChildren } from "react";

const navItems = [
  "Dashboard",
  "Queue",
  "Appointments",
  "Patients",
  "Doctors",
  "Medicines",
  "Prescriptions",
  "Users"
] as const;

export function AppShell({ children }: PropsWithChildren) {
  return (
    <div className="min-h-screen">
      <header className="border-b border-slate-200 bg-white px-6 py-4">
        <h1 className="text-lg font-semibold">Clinic Queue SaaS</h1>
      </header>
      <div className="mx-auto flex max-w-7xl gap-6 px-6 py-6">
        <aside className="hidden w-64 shrink-0 rounded-xl border border-slate-200 bg-white p-4 md:block">
          <nav className="space-y-1">
            {navItems.map((item) => (
              <div key={item} className="rounded-md px-3 py-2 text-sm text-slate-700 hover:bg-slate-100">
                {item}
              </div>
            ))}
          </nav>
        </aside>
        <main className="min-h-[60vh] flex-1 rounded-xl border border-slate-200 bg-white p-6">{children}</main>
      </div>
    </div>
  );
}
