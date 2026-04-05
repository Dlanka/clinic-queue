import { readFile } from "node:fs/promises";
import path from "node:path";
import { isValidObjectId } from "mongoose";
import { z } from "zod";
import { connectToDatabase, disconnectFromDatabase } from "../config/database";
import { MedicineModel } from "../models/medicine.model";
import { TenantModel } from "../models/tenant.model";

const medicineItemSchema = z.object({
  name: z.string().trim().min(1),
  category: z.string().trim().optional(),
  unit: z.string().trim().optional(),
  stockQty: z.number().int().min(0).default(0),
  reorderLevel: z.number().int().min(0).default(0),
  price: z.number().min(0).optional(),
  status: z.enum(["ACTIVE", "INACTIVE"]).default("ACTIVE")
});

const medicineListSchema = z.array(medicineItemSchema).min(1);

function resolveMasterDataFilePath() {
  if (process.env.MASTER_DATA_FILE?.trim()) {
    return path.resolve(process.cwd(), process.env.MASTER_DATA_FILE.trim());
  }

  return path.resolve(__dirname, "master-data.medicines.json");
}

function normalizeString(value?: string) {
  return value?.trim() || undefined;
}

async function run() {
  const tenantId = process.env.MASTER_DATA_TENANT_ID?.trim();
  if (!tenantId || !isValidObjectId(tenantId)) {
    throw new Error(
      "MASTER_DATA_TENANT_ID is required and must be a valid Mongo ObjectId."
    );
  }

  const sourceFile = resolveMasterDataFilePath();
  const fileRaw = await readFile(sourceFile, "utf8");
  const parsed = medicineListSchema.parse(JSON.parse(fileRaw));

  await connectToDatabase();

  const tenant = await TenantModel.findById(tenantId).lean();
  if (!tenant) {
    throw new Error(`Tenant not found for id: ${tenantId}`);
  }

  const operations = parsed.map((item) => ({
    updateOne: {
      filter: { tenantId, name: item.name.trim() },
      update: {
        $set: {
          name: item.name.trim(),
          category: normalizeString(item.category),
          unit: normalizeString(item.unit),
          stockQty: item.stockQty,
          reorderLevel: item.reorderLevel,
          price: item.price,
          status: item.status
        }
      },
      upsert: true
    }
  }));

  const result = await MedicineModel.bulkWrite(operations, { ordered: false });

  console.log("Master data upsert completed");
  console.log(`Tenant: ${tenant.name} (${tenantId})`);
  console.log(`Source file: ${sourceFile}`);
  console.log(`Requested rows: ${parsed.length}`);
  console.log(`Matched: ${result.matchedCount}`);
  console.log(`Modified: ${result.modifiedCount}`);
  console.log(`Upserted: ${result.upsertedCount}`);
}

run()
  .catch((error) => {
    console.error("Master data upsert failed", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await disconnectFromDatabase();
  });
