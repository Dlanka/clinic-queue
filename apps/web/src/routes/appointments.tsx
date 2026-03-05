import { createRoute } from "@tanstack/react-router";
import { PlaceholderPage } from "../components/placeholder-page";
import { rootRoute } from "./root";

export const appointmentsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "appointments",
  component: () => (
    <PlaceholderPage
      title="Appointments"
      description="Schedule and manage clinic appointments from this module."
    />
  )
});
