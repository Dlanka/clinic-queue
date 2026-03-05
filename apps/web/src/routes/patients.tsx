import { createRoute } from "@tanstack/react-router";
import { PlaceholderPage } from "../components/placeholder-page";
import { rootRoute } from "./root";

export const patientsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "patients",
  component: () => (
    <PlaceholderPage
      title="Patients"
      description="Maintain patient profiles, status, and longitudinal history."
    />
  )
});
