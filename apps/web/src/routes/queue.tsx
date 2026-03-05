import { createRoute } from "@tanstack/react-router";
import { PlaceholderPage } from "../components/placeholder-page";
import { rootRoute } from "./root";

export const queueRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "queue",
  component: () => (
    <PlaceholderPage
      title="Queue"
      description="Track waiting patients and current serving flow for each doctor."
    />
  )
});
