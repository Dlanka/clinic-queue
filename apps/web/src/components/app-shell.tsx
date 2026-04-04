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
  Users,
  type LucideIcon
} from "lucide-react";
import { useMemo, useState, type PropsWithChildren } from "react";
import { meQueryKey, useMe } from "@/hooks/use-me";
import { AuthService } from "@/services/auth.service";
import { Sidebar, Toolbar } from "./layout";
import { useToast } from "./ui";

type AppRole = "ADMIN" | "RECEPTION" | "DOCTOR" | "NURSE" | "PHARMACY_STAFF";

type NavItemConfig = {
  label: string;
  to: string;
  icon: LucideIcon;
  badge?: string;
  roles?: AppRole[];
};

type NavGroupConfig = {
  label: string;
  items: NavItemConfig[];
};

const navGroups: NavGroupConfig[] = [
  {
    label: "Overview",
    items: [
      { label: "Dashboard", to: "/", icon: LayoutDashboard },
      { label: "Consultation", to: "/consultation", icon: Stethoscope, roles: ["DOCTOR"] },
      {
        label: "Queue",
        to: "/queue",
        icon: ClipboardList,
        roles: ["ADMIN", "RECEPTION", "DOCTOR", "NURSE"]
      },
      {
        label: "Appointments",
        to: "/appointments",
        icon: CalendarClock,
        roles: ["ADMIN", "RECEPTION", "DOCTOR", "NURSE"]
      }
    ]
  },
  {
    label: "Records",
    items: [
      {
        label: "Patients",
        to: "/patients",
        icon: Users,
        roles: ["ADMIN", "RECEPTION", "DOCTOR", "NURSE"]
      },
      { label: "Doctors", to: "/doctors", icon: Stethoscope, roles: ["ADMIN"] },
      {
        label: "Medicines",
        to: "/medicines",
        icon: FlaskConical,
        roles: ["ADMIN", "NURSE", "PHARMACY_STAFF"]
      },
      {
        label: "Prescriptions",
        to: "/prescriptions",
        icon: Pill,
        roles: ["ADMIN", "DOCTOR", "NURSE", "PHARMACY_STAFF"]
      }
    ]
  },
  {
    label: "Admin",
    items: [{ label: "Users", to: "/users", icon: ShieldPlus, roles: ["ADMIN"] }]
  },
  {
    label: "System",
    items: [{ label: "Settings", to: "/settings", icon: Settings, roles: ["ADMIN"] }]
  }
];

function filterNavGroups(memberRoles: string[] | undefined) {
  if (!memberRoles) {
    return [];
  }

  return navGroups
    .map((group) => ({
      ...group,
      items: group.items.filter((item) => {
        if (!item.roles || item.roles.length === 0) {
          return true;
        }

        return memberRoles.some((role) => item.roles?.includes(role as AppRole));
      })
    }))
    .filter((group) => group.items.length > 0);
}

export function AppShell({ children }: PropsWithChildren) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const toast = useToast();
  const meQuery = useMe();

  const filteredNavGroups = useMemo(
    () => filterNavGroups(meQuery.data?.member.roles),
    [meQuery.data?.member.roles]
  );
  const profileLabel = useMemo(() => {
    const source = meQuery.data?.account.name?.trim() || meQuery.data?.account.email?.trim();
    if (!source) {
      return "ME";
    }

    const parts = source.split(/\s+/).filter(Boolean);
    if (parts.length >= 2) {
      const firstInitial = parts[0]?.charAt(0) ?? "";
      const secondInitial = parts[1]?.charAt(0) ?? "";
      return `${firstInitial}${secondInitial}`.toUpperCase();
    }

    return (parts[0]?.slice(0, 2) ?? "ME").toUpperCase();
  }, [meQuery.data?.account.email, meQuery.data?.account.name]);

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
        onOpenProfile={() => navigate({ to: "/profile" })}
        profileLabel={profileLabel}
        tenantName={meQuery.data?.tenant.name ?? "Clinic"}
      />

      <div className="pt-toolbar">
        <Sidebar
          navGroups={filteredNavGroups}
          isItemActive={isItemActive}
          mobileOpen={mobileOpen}
          onCloseMobile={() => setMobileOpen(false)}
          onLogout={() => logoutMutation.mutate()}
          logoutPending={logoutMutation.isPending}
        />

        <motion.main
          className="border border-neutral-40 ml-0 mr-6 h-[calc(100vh-74px)] max-h-[calc(100vh-74px)] overflow-hidden rounded-xl bg-neutral-10 md:ml-sidebar-collapsed scrollbar-thin-minimal"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.24, delay: 0.05 }}
        >
          <div className="h-full w-full overflow-auto p-4 md:p-8 ">{children}</div>
        </motion.main>
      </div>
    </div>
  );
}
