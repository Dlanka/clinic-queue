import type { ReactNode } from "react";
import { useNavigate } from "@tanstack/react-router";
import { PageState } from "@/components/ui";
import { useMe } from "@/hooks/use-me";

interface RoleGateProps {
  allowedRoles: string[];
  children: ReactNode;
}

export function RoleGate({ allowedRoles, children }: RoleGateProps) {
  const meQuery = useMe();
  const navigate = useNavigate();

  if (meQuery.isLoading) {
    return (
      <div className="py-10 text-center text-sm text-neutral-70">Checking access permissions...</div>
    );
  }

  const memberRoles = meQuery.data?.member.roles ?? [];
  const allowed = memberRoles.some((role) => allowedRoles.includes(role));

  if (!allowed) {
    return (
      <PageState
        preset="accessDenied"
        title="You don't have permission"
        description={
          <>
            Your account role doesn&apos;t have access to this page.
            <br />
            Contact your administrator to request access.
          </>
        }
        primaryAction={{
          label: "Go to Dashboard",
          startIconName: "home",
          onClick: () => navigate({ to: "/" })
        }}
        secondaryAction={{
          label: "Contact Admin",
          startIconName: "mail",
          variant: "outlined",
          intent: "neutral",
          onClick: () => window.location.assign("mailto:admin@demo.com")
        }}
        footnote={
          <>
            Logged in as{" "}
            <span className="font-semibold text-neutral-95">{memberRoles.join(", ") || "none"}</span>{" "}
            - insufficient role
          </>
        }
      />
    );
  }

  return <>{children}</>;
}
