import { SettingsModel } from "../models/settings.model";
import { TenantModel } from "../models/tenant.model";

type SettingsPatch = {
  general?: Record<string, unknown>;
  access?: Record<string, unknown>;
  queue?: Record<string, unknown>;
  clinical?: Record<string, unknown>;
  pharmacy?: Record<string, unknown>;
  security?: Record<string, unknown>;
  system?: Record<string, unknown>;
};

export class SettingsService {
  static async getByTenantId(tenantId: string) {
    const settings = await SettingsModel.findOneAndUpdate(
      { tenantId },
      {},
      { upsert: true, returnDocument: "after", setDefaultsOnInsert: true }
    ).lean();

    return settings;
  }

  static async updateByTenantId(tenantId: string, patch: SettingsPatch) {
    const setPayload: Record<string, unknown> = {};

    if (patch.general) {
      for (const [key, value] of Object.entries(patch.general)) {
        setPayload[`general.${key}`] = value;
      }
    }
    if (patch.access) {
      for (const [key, value] of Object.entries(patch.access)) {
        setPayload[`access.${key}`] = value;
      }
    }
    if (patch.queue) {
      for (const [key, value] of Object.entries(patch.queue)) {
        setPayload[`queue.${key}`] = value;
      }
    }
    if (patch.clinical) {
      for (const [key, value] of Object.entries(patch.clinical)) {
        setPayload[`clinical.${key}`] = value;
      }
    }
    if (patch.pharmacy) {
      for (const [key, value] of Object.entries(patch.pharmacy)) {
        setPayload[`pharmacy.${key}`] = value;
      }
    }
    if (patch.security) {
      for (const [key, value] of Object.entries(patch.security)) {
        setPayload[`security.${key}`] = value;
      }
    }
    if (patch.system) {
      for (const [key, value] of Object.entries(patch.system)) {
        setPayload[`system.${key}`] = value;
      }
    }

    const settings = await SettingsModel.findOneAndUpdate(
      { tenantId },
      Object.keys(setPayload).length > 0 ? { $set: setPayload } : {},
      { upsert: true, returnDocument: "after", setDefaultsOnInsert: true }
    ).lean();

    const clinicName = patch.general?.clinicName;
    if (typeof clinicName === "string" && clinicName.trim()) {
      await TenantModel.updateOne({ _id: tenantId }, { $set: { name: clinicName.trim() } });
    }

    return settings;
  }
}
