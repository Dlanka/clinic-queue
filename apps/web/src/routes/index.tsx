import { createRoute } from "@tanstack/react-router";
import { rootRoute } from "./root";

export const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: () => (
    <div className="space-y-3">
      <h2 className="text-2xl font-semibold">Dashboard</h2>
      <p className="text-sm text-slate-600">
        Milestone 1 scaffold is active. Router and React Query providers are configured.
      </p>
    </div>
  )
});
