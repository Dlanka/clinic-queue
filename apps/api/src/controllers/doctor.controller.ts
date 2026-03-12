import type { RequestHandler } from "express";
import { DoctorService } from "../services/doctor.service";
import { HttpError } from "../utils/http-error";

export const DoctorController = {
  list: (async (req, res, next) => {
    try {
      if (!req.auth) {
        throw new HttpError(401, "Unauthenticated");
      }

      const doctors = await DoctorService.list(req.auth.tenantId);
      return res.status(200).json({ doctors });
    } catch (error) {
      return next(error);
    }
  }) as RequestHandler,

  create: (async (req, res, next) => {
    try {
      if (!req.auth) {
        throw new HttpError(401, "Unauthenticated");
      }

      const doctor = await DoctorService.create({
        tenantId: req.auth.tenantId,
        memberId: req.body.memberId,
        name: req.body.name,
        specialization: req.body.specialization,
        licenseNumber: req.body.licenseNumber,
        status: req.body.status
      });

      return res.status(201).json({ doctor });
    } catch (error) {
      return next(error);
    }
  }) as RequestHandler,

  getById: (async (req, res, next) => {
    try {
      if (!req.auth) {
        throw new HttpError(401, "Unauthenticated");
      }

      const doctor = await DoctorService.getById(req.auth.tenantId, String(req.params.id));
      return res.status(200).json({ doctor });
    } catch (error) {
      return next(error);
    }
  }) as RequestHandler,

  update: (async (req, res, next) => {
    try {
      if (!req.auth) {
        throw new HttpError(401, "Unauthenticated");
      }

      const doctor = await DoctorService.update({
        tenantId: req.auth.tenantId,
        doctorId: String(req.params.id),
        memberId: req.body.memberId,
        name: req.body.name,
        specialization: req.body.specialization,
        licenseNumber: req.body.licenseNumber,
        status: req.body.status
      });

      return res.status(200).json({ doctor });
    } catch (error) {
      return next(error);
    }
  }) as RequestHandler,

  remove: (async (req, res, next) => {
    try {
      if (!req.auth) {
        throw new HttpError(401, "Unauthenticated");
      }

      await DoctorService.remove(req.auth.tenantId, String(req.params.id));
      return res.status(204).send();
    } catch (error) {
      return next(error);
    }
  }) as RequestHandler
};
