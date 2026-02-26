import cookieParser from "cookie-parser";
import express from "express";
import { connectToDatabase } from "./config/database";
import { env } from "./config/env";
import { csrfGuard } from "./middlewares/csrf-guard";
import { errorHandler } from "./middlewares/error-handler";
import { resolveTenant } from "./middlewares/resolve-tenant";
import { authRouter } from "./routes/auth.routes";
import { healthRouter } from "./routes/health.routes";

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(resolveTenant);
app.use(csrfGuard);

app.use(healthRouter);
app.use("/auth", authRouter);

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
