import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useRouterState } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  CalendarClock,
  ClipboardList,
  FlaskConical,
  LayoutDashboard,
  Pill,
  Settings,
  ShieldPlus,
  Stethoscope,
  Users
} from "lucide-react";
import { useState, type PropsWithChildren } from "react";
import { meQueryKey } from "@/hooks/use-me";
import { AuthService } from "@/services/auth.service";
import { Sidebar, Toolbar } from "./layout";
import { useToast } from "./ui";

const navGroups = [
  {
    label: "Overview",
    items: [
      { label: "Dashboard", to: "/", icon: LayoutDashboard },
      { label: "Queue", to: "/queue", icon: ClipboardList, badge: "5" },
      { label: "Appointments", to: "/appointments", icon: CalendarClock, badge: "2" }
    ]
  },
  {
    label: "Records",
    items: [
      { label: "Patients", to: "/patients", icon: Users },
      { label: "Doctors", to: "/doctors", icon: Stethoscope },
      { label: "Medicines", to: "/medicines", icon: FlaskConical },
      { label: "Prescriptions", to: "/prescriptions", icon: Pill }
    ]
  },
  {
    label: "Admin",
    items: [
      { label: "Users", to: "/users", icon: ShieldPlus },
      { label: "Settings", to: "/users", icon: Settings }
    ]
  }
] as const;

export function AppShell({ children }: PropsWithChildren) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const toast = useToast();

  const logoutMutation = useMutation({
    mutationFn: AuthService.logout,
    onSuccess: async () => {
      queryClient.removeQueries({ queryKey: meQueryKey });
      await navigate({ to: "/login" });
      toast.success("Logged out");
    },
    onError: () => {
      toast.error("Logout failed", "Please try again.");
    }
  });

  const isItemActive = (to: string) => {
    if (to === "/") {
      return pathname === "/";
    }

    return pathname === to || pathname.startsWith(`${to}/`);
  };

  return (
    <div className="min-h-screen bg-neutral-20">
      <Toolbar
        onOpenMenu={() => setMobileOpen(true)}
        onLogout={() => logoutMutation.mutate()}
        logoutPending={logoutMutation.isPending}
      />

      <div className="pt-toolbar">
        <Sidebar
          navGroups={navGroups}
          isItemActive={isItemActive}
          mobileOpen={mobileOpen}
          onCloseMobile={() => setMobileOpen(false)}
        />

        <motion.main
          className="ml-0 h-[calc(100vh-62px)] max-h-[calc(100vh-62px)]  overflow-hidden rounded-xl bg-neutral-10 md:ml-sidebar"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.24, delay: 0.05 }}
        >
          <div className="h-full w-full overflow-auto p-4 md:p-8">{children}</div>
        </motion.main>
      </div>
    </div>
  );
}
