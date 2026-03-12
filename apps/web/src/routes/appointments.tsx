import { createFileRoute } from "@tanstack/react-router";
import { PlaceholderPage } from "../components/placeholder-page";

export const Route = createFileRoute("/appointments")({
  component: () => (
    <PlaceholderPage
      title="Appointments"
      description="Schedule and manage clinic appointments from this module."
    />
  )
});
