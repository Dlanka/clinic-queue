import { useEffect } from "react";
import {
  Navigate,
  Outlet,
  createRootRoute,
  createRoute,
  createRouter,
  useNavigate,
  useRouterState
} from "@tanstack/react-router";
import { LoginScreen } from "@/features/auth/components/login-screen";
import { useAuth } from "@/features/auth/hooks/use-auth";
import { logout } from "@/features/auth/services/auth.service";
import { TenantsScreen } from "@/features/tenants/components/tenants-screen";

function RootLayout() {
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  const { user, isLoading, refreshUser } = useAuth();

  useEffect(() => {
    void refreshUser();
  }, [refreshUser]);

  if (isLoading) {
    return (
      <div className="grid min-h-screen place-items-center px-6 text-sm text-neutral-400">
        Loading session...
      </div>
    );
  }

  if (!user && pathname !== "/login") {
    return <Navigate to="/login" />;
  }

  if (user && pathname === "/login") {
    return <Navigate to="/" />;
  }

  return <Outlet />;
}

function LoginPage() {
  const navigate = useNavigate();
  const { refreshUser } = useAuth();

  return (
    <LoginScreen
      onSuccess={async () => {
        await refreshUser();
        await navigate({ to: "/" });
      }}
    />
  );
}

function TenantsPage() {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();

  return (
    <TenantsScreen
      userName={user?.account.name ?? "Super Admin"}
      onLogout={async () => {
        await logout();
        setUser(null);
        await navigate({ to: "/login" });
      }}
    />
  );
}

const rootRoute = createRootRoute({ component: RootLayout });

const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/login",
  component: LoginPage
});

const tenantsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: TenantsPage
});

const routeTree = rootRoute.addChildren([loginRoute, tenantsRoute]);

export const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}
