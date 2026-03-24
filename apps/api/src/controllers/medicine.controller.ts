import type { RequestHandler } from "express";
import { MedicineService } from "../services/medicine.service";
import { HttpError } from "../utils/http-error";

export const MedicineController = {
  listCategories: (async (req, res, next) => {
    try {
      if (!req.auth) {
        throw new HttpError(401, "Unauthenticated");
      }

      const categories = await MedicineService.listCategories(req.auth.tenantId);
      return res.status(200).json({ categories });
    } catch (error) {
      return next(error);
    }
  }) as RequestHandler,

  list: (async (req, res, next) => {
    try {
      if (!req.auth) {
        throw new HttpError(401, "Unauthenticated");
      }

      const medicines = await MedicineService.list(req.auth.tenantId);
      return res.status(200).json({ medicines });
    } catch (error) {
      return next(error);
    }
  }) as RequestHandler,

  listUnits: (async (req, res, next) => {
    try {
      if (!req.auth) {
        throw new HttpError(401, "Unauthenticated");
      }

      const units = await MedicineService.listUnits(req.auth.tenantId);
      return res.status(200).json({ units });
    } catch (error) {
      return next(error);
    }
  }) as RequestHandler,

  create: (async (req, res, next) => {
    try {
      if (!req.auth) {
        throw new HttpError(401, "Unauthenticated");
      }

      const medicine = await MedicineService.create({
        tenantId: req.auth.tenantId,
        name: req.body.name,
        category: req.body.category,
        unit: req.body.unit,
        stockQty: req.body.stockQty,
        reorderLevel: req.body.reorderLevel,
        price: req.body.price,
        status: req.body.status
      });

      return res.status(201).json({ medicine });
    } catch (error) {
      return next(error);
    }
  }) as RequestHandler,

  getById: (async (req, res, next) => {
    try {
      if (!req.auth) {
        throw new HttpError(401, "Unauthenticated");
      }

      const medicine = await MedicineService.getById(req.auth.tenantId, String(req.params.id));
      return res.status(200).json({ medicine });
    } catch (error) {
      return next(error);
    }
  }) as RequestHandler,

  update: (async (req, res, next) => {
    try {
      if (!req.auth) {
        throw new HttpError(401, "Unauthenticated");
      }

      const medicine = await MedicineService.update({
        tenantId: req.auth.tenantId,
        medicineId: String(req.params.id),
        name: req.body.name,
        category: req.body.category,
        unit: req.body.unit,
        stockQty: req.body.stockQty,
        reorderLevel: req.body.reorderLevel,
        price: req.body.price,
        status: req.body.status
      });

      return res.status(200).json({ medicine });
    } catch (error) {
      return next(error);
    }
  }) as RequestHandler,

  remove: (async (req, res, next) => {
    try {
      if (!req.auth) {
        throw new HttpError(401, "Unauthenticated");
      }

      await MedicineService.remove(req.auth.tenantId, String(req.params.id));
      return res.status(204).send();
    } catch (error) {
      return next(error);
    }
  }) as RequestHandler
};
