import type { RequestHandler } from "express";
import { PrescriptionService } from "../services/prescription.service";
import { HttpError } from "../utils/http-error";

export const PrescriptionController = {
  list: (async (req, res, next) => {
    try {
      if (!req.auth) {
        throw new HttpError(401, "Unauthenticated");
      }

      const status = req.query.status as "PRESCRIBED" | "DISPENSED" | undefined;
      const visitId = req.query.visitId as string | undefined;
      const prescriptions = await PrescriptionService.list(req.auth.tenantId, status, visitId);
      return res.status(200).json({ prescriptions });
    } catch (error) {
      return next(error);
    }
  }) as RequestHandler,

  createForVisit: (async (req, res, next) => {
    try {
      if (!req.auth) {
        throw new HttpError(401, "Unauthenticated");
      }

      const prescription = await PrescriptionService.createForVisit({
        tenantId: req.auth.tenantId,
        visitId: String(req.params.visitId),
        prescribedByMemberId: req.auth.memberId,
        items: req.body.items
      });

      return res.status(201).json({ prescription });
    } catch (error) {
      return next(error);
    }
  }) as RequestHandler,

  getById: (async (req, res, next) => {
    try {
      if (!req.auth) {
        throw new HttpError(401, "Unauthenticated");
      }

      const prescription = await PrescriptionService.getById(
        req.auth.tenantId,
        String(req.params.id)
      );
      return res.status(200).json({ prescription });
    } catch (error) {
      return next(error);
    }
  }) as RequestHandler,

  update: (async (req, res, next) => {
    try {
      if (!req.auth) {
        throw new HttpError(401, "Unauthenticated");
      }

      const prescription = await PrescriptionService.update({
        tenantId: req.auth.tenantId,
        prescriptionId: String(req.params.id),
        prescribedByMemberId: req.auth.memberId,
        items: req.body.items
      });

      return res.status(200).json({ prescription });
    } catch (error) {
      return next(error);
    }
  }) as RequestHandler,

  dispense: (async (req, res, next) => {
    try {
      if (!req.auth) {
        throw new HttpError(401, "Unauthenticated");
      }

      const prescription = await PrescriptionService.dispense(
        req.auth.tenantId,
        String(req.params.id),
        req.auth.memberId
      );
      return res.status(200).json({ prescription });
    } catch (error) {
      return next(error);
    }
  }) as RequestHandler
};
