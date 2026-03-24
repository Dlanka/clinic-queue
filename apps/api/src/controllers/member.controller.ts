import type { RequestHandler } from "express";
import { MemberService } from "../services/member.service";
import { HttpError } from "../utils/http-error";

export const MemberController = {
  list: (async (req, res, next) => {
    try {
      if (!req.auth) {
        throw new HttpError(401, "Unauthenticated");
      }

      const members = await MemberService.list(req.auth.tenantId);
      return res.status(200).json({ members });
    } catch (error) {
      return next(error);
    }
  }) as RequestHandler,

  create: (async (req, res, next) => {
    try {
      if (!req.auth) {
        throw new HttpError(401, "Unauthenticated");
      }

      const result = await MemberService.create({
        tenantId: req.auth.tenantId,
        email: req.body.email,
        name: req.body.name,
        roles: req.body.roles,
        isActive: req.body.isActive
      });

      return res.status(201).json(result);
    } catch (error) {
      return next(error);
    }
  }) as RequestHandler,

  getById: (async (req, res, next) => {
    try {
      if (!req.auth) {
        throw new HttpError(401, "Unauthenticated");
      }

      const member = await MemberService.getById(req.auth.tenantId, String(req.params.id));
      return res.status(200).json({ member });
    } catch (error) {
      return next(error);
    }
  }) as RequestHandler,

  update: (async (req, res, next) => {
    try {
      if (!req.auth) {
        throw new HttpError(401, "Unauthenticated");
      }

      const member = await MemberService.update({
        tenantId: req.auth.tenantId,
        memberId: String(req.params.id),
        roles: req.body.roles,
        isActive: req.body.isActive
      });

      return res.status(200).json({ member });
    } catch (error) {
      return next(error);
    }
  }) as RequestHandler,

  remove: (async (req, res, next) => {
    try {
      if (!req.auth) {
        throw new HttpError(401, "Unauthenticated");
      }

      await MemberService.remove(req.auth.tenantId, String(req.params.id));
      return res.status(204).send();
    } catch (error) {
      return next(error);
    }
  }) as RequestHandler,

  resetPassword: (async (req, res, next) => {
    try {
      if (!req.auth) {
        throw new HttpError(401, "Unauthenticated");
      }

      const result = await MemberService.resetPassword(req.auth.tenantId, String(req.params.id));
      return res.status(200).json(result);
    } catch (error) {
      return next(error);
    }
  }) as RequestHandler
};
