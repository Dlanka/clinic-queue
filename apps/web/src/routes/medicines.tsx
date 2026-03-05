import { createRoute } from "@tanstack/react-router";
import { PlaceholderPage } from "../components/placeholder-page";
import { rootRoute } from "./root";

export const medicinesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "medicines",
  component: () => (
    <PlaceholderPage
      title="Medicines"
      description="Manage medicine catalog, stock levels, and related metadata."
    />
  )
});
