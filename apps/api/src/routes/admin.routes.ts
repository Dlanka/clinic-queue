import { Router } from "express";
import { z } from "zod";
import { APP_ROLES } from "../constants/roles";
import { AdminTenantController } from "../controllers/admin-tenant.controller";
import { requireAuth } from "../middlewares/require-auth";
import { requireSuperAdmin } from "../middlewares/require-super-admin";
import { validateBody, validateParams, validateQuery } from "../middlewares/validate-request";

const tenantIdParamsSchema = z.object({
  id: z.string().regex(/^[a-f0-9]{24}$/i, "Invalid tenant id")
});

const listTenantsQuerySchema = z.object({
  search: z.string().trim().optional(),
  status: z.enum(["ACTIVE", "INACTIVE"]).optional()
});

const createTenantSchema = z.object({
  name: z.string().trim().min(2).max(120),
  adminEmail: z.string().trim().email(),
  adminName: z.string().trim().min(2).max(120).optional(),
  adminPassword: z.string().min(8).max(128),
  adminRoles: z.array(z.enum(APP_ROLES)).min(1).optional()
});

const updateTenantSchema = z
  .object({
    name: z.string().trim().min(2).max(120).optional(),
    status: z.enum(["ACTIVE", "INACTIVE"]).optional()
  })
  .refine((body) => Object.keys(body).length > 0, {
    message: "Provide at least one field to update"
  });

const adminRouter = Router();

adminRouter.use(requireAuth, requireSuperAdmin);

adminRouter.get(
  "/tenants",
  validateQuery(listTenantsQuerySchema),
  AdminTenantController.list
);
adminRouter.post("/tenants", validateBody(createTenantSchema), AdminTenantController.create);
adminRouter.patch(
  "/tenants/:id",
  validateParams(tenantIdParamsSchema),
  validateBody(updateTenantSchema),
  AdminTenantController.update
);
adminRouter.post(
  "/tenants/:id/activate",
  validateParams(tenantIdParamsSchema),
  AdminTenantController.activate
);
adminRouter.post(
  "/tenants/:id/deactivate",
  validateParams(tenantIdParamsSchema),
  AdminTenantController.deactivate
);

export { adminRouter };
