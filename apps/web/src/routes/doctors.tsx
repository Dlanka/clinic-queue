import { createRoute } from "@tanstack/react-router";
import { PlaceholderPage } from "../components/placeholder-page";
import { rootRoute } from "./root";

export const doctorsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "doctors",
  component: () => (
    <PlaceholderPage
      title="Doctors"
      description="Configure doctors and doctor-specific availability data."
    />
  )
});
