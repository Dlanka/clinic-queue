import { createRouter } from "@tanstack/react-router";
import { appointmentsRoute } from "./routes/appointments";
import { doctorsRoute } from "./routes/doctors";
import { indexRoute } from "./routes/index";
import { loginRoute } from "./routes/login";
import { medicinesRoute } from "./routes/medicines";
import { patientsRoute } from "./routes/patients";
import { prescriptionsRoute } from "./routes/prescriptions";
import { queueRoute } from "./routes/queue";
import { rootRoute } from "./routes/root";
import { usersRoute } from "./routes/users";

const routeTree = rootRoute.addChildren([
  loginRoute,
  indexRoute,
  queueRoute,
  appointmentsRoute,
  patientsRoute,
  doctorsRoute,
  medicinesRoute,
  prescriptionsRoute,
  usersRoute
]);

export const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}
