import type { RequestHandler } from "express";
import { PatientService } from "../services/patient.service";
import { HttpError } from "../utils/http-error";

export const PatientController = {
  list: (async (req, res, next) => {
    try {
      if (!req.auth) {
        throw new HttpError(401, "Unauthenticated");
      }

      const patients = await PatientService.list(req.auth.tenantId);
      return res.status(200).json({ patients });
    } catch (error) {
      return next(error);
    }
  }) as RequestHandler,

  create: (async (req, res, next) => {
    try {
      if (!req.auth) {
        throw new HttpError(401, "Unauthenticated");
      }

      const patient = await PatientService.create({
        tenantId: req.auth.tenantId,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        dateOfBirth: req.body.dateOfBirth,
        gender: req.body.gender,
        phone: req.body.phone,
        email: req.body.email,
        address: req.body.address,
        status: req.body.status
      });

      return res.status(201).json({ patient });
    } catch (error) {
      return next(error);
    }
  }) as RequestHandler,

  getById: (async (req, res, next) => {
    try {
      if (!req.auth) {
        throw new HttpError(401, "Unauthenticated");
      }

      const patient = await PatientService.getById(req.auth.tenantId, String(req.params.id));
      return res.status(200).json({ patient });
    } catch (error) {
      return next(error);
    }
  }) as RequestHandler,

  update: (async (req, res, next) => {
    try {
      if (!req.auth) {
        throw new HttpError(401, "Unauthenticated");
      }

      const patient = await PatientService.update({
        tenantId: req.auth.tenantId,
        patientId: String(req.params.id),
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        dateOfBirth: req.body.dateOfBirth,
        gender: req.body.gender,
        phone: req.body.phone,
        email: req.body.email,
        address: req.body.address,
        status: req.body.status
      });

      return res.status(200).json({ patient });
    } catch (error) {
      return next(error);
    }
  }) as RequestHandler,

  remove: (async (req, res, next) => {
    try {
      if (!req.auth) {
        throw new HttpError(401, "Unauthenticated");
      }

      await PatientService.remove(req.auth.tenantId, String(req.params.id));
      return res.status(204).send();
    } catch (error) {
      return next(error);
    }
  }) as RequestHandler
};
