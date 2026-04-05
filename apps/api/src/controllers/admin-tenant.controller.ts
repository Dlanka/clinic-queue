import type { RequestHandler } from "express";
import { AdminTenantService } from "../services/admin-tenant.service";

export const AdminTenantController = {
  list: (async (req, res, next) => {
    try {
      const tenants = await AdminTenantService.list({
        search: req.query.search ? String(req.query.search) : undefined,
        status: req.query.status ? (String(req.query.status) as "ACTIVE" | "INACTIVE") : undefined
      });

      return res.status(200).json({ tenants });
    } catch (error) {
      return next(error);
    }
  }) as RequestHandler,

  create: (async (req, res, next) => {
    try {
      const tenant = await AdminTenantService.create({
        name: req.body.name,
        adminEmail: req.body.adminEmail,
        adminName: req.body.adminName,
        adminPassword: req.body.adminPassword,
        adminRoles: req.body.adminRoles
      });

      return res.status(201).json({ tenant });
    } catch (error) {
      return next(error);
    }
  }) as RequestHandler,

  update: (async (req, res, next) => {
    try {
      const tenant = await AdminTenantService.update({
        tenantId: String(req.params.id),
        name: req.body.name,
        status: req.body.status
      });

      return res.status(200).json({ tenant });
    } catch (error) {
      return next(error);
    }
  }) as RequestHandler,

  activate: (async (req, res, next) => {
    try {
      const tenant = await AdminTenantService.update({
        tenantId: String(req.params.id),
        status: "ACTIVE"
      });

      return res.status(200).json({ tenant });
    } catch (error) {
      return next(error);
    }
  }) as RequestHandler,

  deactivate: (async (req, res, next) => {
    try {
      const tenant = await AdminTenantService.update({
        tenantId: String(req.params.id),
        status: "INACTIVE"
      });

      return res.status(200).json({ tenant });
    } catch (error) {
      return next(error);
    }
  }) as RequestHandler
};
