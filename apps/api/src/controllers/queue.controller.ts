import type { RequestHandler } from "express";
import { QueueService } from "../services/queue.service";
import { HttpError } from "../utils/http-error";

export const QueueController = {
  list: (async (req, res, next) => {
    try {
      if (!req.auth) {
        throw new HttpError(401, "Unauthenticated");
      }

      const status = req.query.status as "WAITING" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED" | undefined;
      const date = req.query.date as string | undefined;
      const doctorId = req.query.doctorId as string | undefined;
      const allDates = req.query.allDates === "1" || req.query.allDates === "true";

      const entries = await QueueService.list(req.auth.tenantId, {
        status,
        date,
        doctorId,
        allDates
      });

      return res.status(200).json({ entries });
    } catch (error) {
      return next(error);
    }
  }) as RequestHandler,

  create: (async (req, res, next) => {
    try {
      if (!req.auth) {
        throw new HttpError(401, "Unauthenticated");
      }

      const entry = await QueueService.create({
        tenantId: req.auth.tenantId,
        patientId: req.body.patientId,
        doctorId: req.body.doctorId,
        queuedAt: req.body.queuedAt,
        isPriority: req.body.isPriority,
        notes: req.body.notes,
        createdByMemberId: req.auth.memberId
      });

      return res.status(201).json({ entry });
    } catch (error) {
      return next(error);
    }
  }) as RequestHandler,

  getById: (async (req, res, next) => {
    try {
      if (!req.auth) {
        throw new HttpError(401, "Unauthenticated");
      }

      const entry = await QueueService.getById(req.auth.tenantId, String(req.params.id));
      return res.status(200).json({ entry });
    } catch (error) {
      return next(error);
    }
  }) as RequestHandler,

  start: (async (req, res, next) => {
    try {
      if (!req.auth) {
        throw new HttpError(401, "Unauthenticated");
      }

      const entry = await QueueService.start({
        tenantId: req.auth.tenantId,
        queueEntryId: String(req.params.id),
        actorMemberId: req.auth.memberId,
        actorRoles: req.auth.roles
      });

      return res.status(200).json({ entry });
    } catch (error) {
      return next(error);
    }
  }) as RequestHandler,

  complete: (async (req, res, next) => {
    try {
      if (!req.auth) {
        throw new HttpError(401, "Unauthenticated");
      }

      const entry = await QueueService.complete({
        tenantId: req.auth.tenantId,
        queueEntryId: String(req.params.id),
        actorMemberId: req.auth.memberId,
        actorRoles: req.auth.roles
      });

      return res.status(200).json({ entry });
    } catch (error) {
      return next(error);
    }
  }) as RequestHandler,

  cancel: (async (req, res, next) => {
    try {
      if (!req.auth) {
        throw new HttpError(401, "Unauthenticated");
      }

      const entry = await QueueService.cancel({
        tenantId: req.auth.tenantId,
        queueEntryId: String(req.params.id),
        actorMemberId: req.auth.memberId,
        actorRoles: req.auth.roles
      });

      return res.status(200).json({ entry });
    } catch (error) {
      return next(error);
    }
  }) as RequestHandler
};
