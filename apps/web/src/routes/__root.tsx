import { Navigate, Outlet, createRootRoute, useRouterState } from "@tanstack/react-router";
import { AppErrorFallback } from "@/components/app-error-fallback";
import { AppShell } from "@/components/app-shell";
import { Button, Card } from "@/components/ui";
import { useMe } from "@/hooks/use-me";

export const Route = createRootRoute({
  component: RootLayout,
  errorComponent: ({ error, reset }) => <AppErrorFallback error={error} reset={reset} />, 
  notFoundComponent: () => (
    <div className="grid min-h-screen place-items-center bg-neutral-20 p-4 md:p-6">
      <Card className="w-full max-w-2xl">
        <Card.Body className="space-y-4 p-6 text-center">
          <h1 className="text-2xl font-bold text-neutral-99">Page Not Found</h1>
          <p className="text-sm text-neutral-70">The page you are looking for does not exist.</p>
          <div className="flex justify-center gap-2">
            <Button startIconName="home" onClick={() => window.location.assign("/")}>Go to Dashboard</Button>
            <Button variant="outlined" intent="neutral" startIconName="arrowRight" onClick={() => window.history.back()}>
              Go Back
            </Button>
          </div>
        </Card.Body>
      </Card>
    </div>
  )
});

function RootLayout() {
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  const isLoginRoute = pathname === "/login";
  const meQuery = useMe(!isLoginRoute);

  if (isLoginRoute) {
    return <Outlet />;
  }

  if (meQuery.isLoading) {
    return <div className="py-10 text-center text-sm text-neutral-70">Loading session...</div>;
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
