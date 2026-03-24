import type { RequestHandler } from "express";
import { VisitService } from "../services/visit.service";
import { HttpError } from "../utils/http-error";

export const VisitController = {
  getByQueueEntry: (async (req, res, next) => {
    try {
      if (!req.auth) {
        throw new HttpError(401, "Unauthenticated");
      }

      const visit = await VisitService.getByQueueEntry(req.auth.tenantId, String(req.params.queueEntryId));
      return res.status(200).json({ visit });
    } catch (error) {
      return next(error);
    }
  }) as RequestHandler,

  listByPatient: (async (req, res, next) => {
    try {
      if (!req.auth) {
        throw new HttpError(401, "Unauthenticated");
      }

      const visits = await VisitService.listByPatient(req.auth.tenantId, String(req.params.patientId));
      return res.status(200).json({ visits });
    } catch (error) {
      return next(error);
    }
  }) as RequestHandler,

  create: (async (req, res, next) => {
    try {
      if (!req.auth) {
        throw new HttpError(401, "Unauthenticated");
      }

      const visit = await VisitService.create({
        tenantId: req.auth.tenantId,
        patientId: String(req.params.patientId),
        doctorId: req.body.doctorId,
        queueEntryId: req.body.queueEntryId,
        createdByMemberId: req.auth.memberId,
        visitedAt: req.body.visitedAt,
        symptoms: req.body.symptoms,
        diagnosis: req.body.diagnosis,
        notes: req.body.notes,
        bloodPressure: req.body.bloodPressure,
        pulse: req.body.pulse,
        temperature: req.body.temperature,
        weight: req.body.weight
      });

      return res.status(201).json({ visit });
    } catch (error) {
      return next(error);
    }
  }) as RequestHandler,

  update: (async (req, res, next) => {
    try {
      if (!req.auth) {
        throw new HttpError(401, "Unauthenticated");
      }

      const visit = await VisitService.update({
        tenantId: req.auth.tenantId,
        patientId: String(req.params.patientId),
        visitId: String(req.params.visitId),
        visitedAt: req.body.visitedAt,
        symptoms: req.body.symptoms,
        diagnosis: req.body.diagnosis,
        notes: req.body.notes,
        bloodPressure: req.body.bloodPressure,
        pulse: req.body.pulse,
        temperature: req.body.temperature,
        weight: req.body.weight
      });

      return res.status(200).json({ visit });
    } catch (error) {
      return next(error);
    }
  }) as RequestHandler
};
