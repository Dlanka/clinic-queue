import { Outlet, createRootRoute } from "@tanstack/react-router";
import { AppShell } from "../components/app-shell";

export const rootRoute = createRootRoute({
  component: () => (
    <AppShell>
      <Outlet />
    </AppShell>
  )
});
