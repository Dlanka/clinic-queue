import type { RequestHandler } from "express";
import { AppointmentService } from "../services/appointment.service";
import { HttpError } from "../utils/http-error";

export const AppointmentController = {
  list: (async (req, res, next) => {
    try {
      if (!req.auth) {
        throw new HttpError(401, "Unauthenticated");
      }

      const status = req.query.status as "SCHEDULED" | "COMPLETED" | "CANCELLED" | undefined;
      const appointments = await AppointmentService.list(req.auth.tenantId, { status });
      return res.status(200).json({ appointments });
    } catch (error) {
      return next(error);
    }
  }) as RequestHandler,

  create: (async (req, res, next) => {
    try {
      if (!req.auth) {
        throw new HttpError(401, "Unauthenticated");
      }

      const appointment = await AppointmentService.create({
        tenantId: req.auth.tenantId,
        patientId: req.body.patientId,
        doctorId: req.body.doctorId,
        scheduledAt: req.body.scheduledAt,
        status: req.body.status,
        notes: req.body.notes
      });

      return res.status(201).json({ appointment });
    } catch (error) {
      return next(error);
    }
  }) as RequestHandler,

  getById: (async (req, res, next) => {
    try {
      if (!req.auth) {
        throw new HttpError(401, "Unauthenticated");
      }

      const appointment = await AppointmentService.getById(req.auth.tenantId, String(req.params.id));
      return res.status(200).json({ appointment });
    } catch (error) {
      return next(error);
    }
  }) as RequestHandler,

  update: (async (req, res, next) => {
    try {
      if (!req.auth) {
        throw new HttpError(401, "Unauthenticated");
      }

      const appointment = await AppointmentService.update({
        tenantId: req.auth.tenantId,
        appointmentId: String(req.params.id),
        patientId: req.body.patientId,
        doctorId: req.body.doctorId,
        scheduledAt: req.body.scheduledAt,
        status: req.body.status,
        notes: req.body.notes
      });

      return res.status(200).json({ appointment });
    } catch (error) {
      return next(error);
    }
  }) as RequestHandler,

  remove: (async (req, res, next) => {
    try {
      if (!req.auth) {
        throw new HttpError(401, "Unauthenticated");
      }

      await AppointmentService.remove(req.auth.tenantId, String(req.params.id));
      return res.status(204).send();
    } catch (error) {
      return next(error);
    }
  }) as RequestHandler
};
