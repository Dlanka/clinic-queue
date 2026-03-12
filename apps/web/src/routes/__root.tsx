import { Navigate, Outlet, createRootRoute, useRouterState } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { useMe } from "@/hooks/use-me";

export const Route = createRootRoute({
  component: RootLayout
});

function RootLayout() {
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  const isLoginRoute = pathname === "/login";
  const meQuery = useMe(!isLoginRoute);

  if (isLoginRoute) {
    return <Outlet />;
  }

  if (meQuery.isLoading) {
    return (
      <div className="grid min-h-screen place-items-center bg-neutral-20 text-neutral-90">
        Loading session...
      </div>
    );
  }

  if (meQuery.error) {
    return <Navigate to="/login" />;
  }

  return (
    <AppShell>
      <Outlet />
    </AppShell>
  );
}
