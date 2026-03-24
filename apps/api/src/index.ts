import cookieParser from "cookie-parser";
import express from "express";
import { appointmentRouter } from "./routes/appointment.routes";
import { connectToDatabase } from "./config/database";
import { env } from "./config/env";
import { csrfGuard } from "./middlewares/csrf-guard";
import { errorHandler } from "./middlewares/error-handler";
import { rateLimit } from "./middlewares/rate-limit";
import { requestLogger } from "./middlewares/request-logger";
import { resolveTenant } from "./middlewares/resolve-tenant";
import { securityHeaders } from "./middlewares/security-headers";
import { authRouter } from "./routes/auth.routes";
import { doctorRouter } from "./routes/doctor.routes";
import { healthRouter } from "./routes/health.routes";
import { memberRouter } from "./routes/member.routes";
import { medicineRouter } from "./routes/medicine.routes";
import { patientRouter } from "./routes/patient.routes";
import { prescriptionRouter } from "./routes/prescription.routes";
import { queueRouter } from "./routes/queue.routes";
import { visitRouter } from "./routes/visit.routes";

const app = express();

app.use(requestLogger);
app.use(securityHeaders);
app.use(rateLimit);
app.use(express.json());
app.use(cookieParser());
app.use(resolveTenant);
app.use(csrfGuard);

app.use(healthRouter);
app.use("/auth", authRouter);
app.use("/members", memberRouter);
app.use("/doctors", doctorRouter);
app.use("/appointments", appointmentRouter);
app.use("/medicines", medicineRouter);
app.use("/patients", patientRouter);
app.use("/queue", queueRouter);
app.use(visitRouter);
app.use(prescriptionRouter);

app.use(errorHandler);

async function start() {
  await connectToDatabase();

  app.listen(env.PORT, () => {
    console.log(`API listening on http://localhost:${env.PORT}`);
  });
}

start().catch((error) => {
  console.error("Failed to start API", error);
  process.exit(1);
});
