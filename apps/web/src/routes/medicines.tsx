import { createFileRoute } from "@tanstack/react-router";
import { MedicinesPage } from "@/features/medicines";

export const Route = createFileRoute("/medicines")({
  component: MedicinesPage
});
