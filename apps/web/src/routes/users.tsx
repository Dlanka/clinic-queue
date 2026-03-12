import { createFileRoute } from "@tanstack/react-router";
import { MembersPage } from "@/features/users/members";

export const Route = createFileRoute("/users")({
  component: MembersPage
});
