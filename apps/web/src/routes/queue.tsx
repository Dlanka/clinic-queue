import { createFileRoute } from "@tanstack/react-router";
import { PlaceholderPage } from "../components/placeholder-page";

export const Route = createFileRoute("/queue")({
  component: () => (
    <PlaceholderPage
      title="Queue"
      description="Track waiting patients and current serving flow for each doctor."
    />
  )
});
