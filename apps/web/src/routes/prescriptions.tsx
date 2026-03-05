import { createRoute } from "@tanstack/react-router";
import { PlaceholderPage } from "../components/placeholder-page";
import { rootRoute } from "./root";

export const prescriptionsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "prescriptions",
  component: () => (
    <PlaceholderPage
      title="Prescriptions"
      description="Issue and review prescriptions tied to visits and doctors."
    />
  )
});
