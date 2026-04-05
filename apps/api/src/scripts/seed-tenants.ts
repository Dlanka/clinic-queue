import bcrypt from "bcryptjs";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { z } from "zod";
import { APP_ROLES } from "../constants/roles";
import { connectToDatabase, disconnectFromDatabase } from "../config/database";
import { AccountModel } from "../models/account.model";
import { TenantMemberModel } from "../models/tenant-member.model";
import { TenantModel } from "../models/tenant.model";

const roleSchema = z.enum(APP_ROLES);

const tenantSeedRowSchema = z.object({
  tenantName: z.string().trim().min(2),
  adminEmail: z.string().trim().email(),
  adminName: z.string().trim().min(2).optional(),
  adminPassword: z.string().min(8).optional(),
  roles: z.array(roleSchema).min(1).default(["ADMIN"])
});

const tenantSeedSchema = z.array(tenantSeedRowSchema).min(1);

function resolveSeedFilePath() {
  if (process.env.SEED_TENANTS_FILE?.trim()) {
    return path.resolve(process.cwd(), process.env.SEED_TENANTS_FILE.trim());
  }

  return path.resolve(__dirname, "seed-tenants.json");
}

function getDefaultPassword() {
  return process.env.SEED_DEFAULT_PASSWORD?.trim() || "Admin123!";
}

function shouldResetExistingPassword() {
  return process.env.SEED_RESET_EXISTING_PASSWORDS === "true";
}

function defaultNameFromEmail(email: string) {
  return email.split("@")[0] || "Tenant Admin";
}

async function run() {
  const seedFile = resolveSeedFilePath();
  const rowsRaw = await readFile(seedFile, "utf8");
  const rows = tenantSeedSchema.parse(JSON.parse(rowsRaw));
  const resetExistingPasswords = shouldResetExistingPassword();

  await connectToDatabase();

  try {
    await TenantModel.collection.dropIndex("slug_1");
    console.log("Dropped legacy tenants.slug_1 index");
  } catch (error) {
    const message = error instanceof Error ? error.message : "";
    if (!message.includes("index not found")) {
      throw error;
    }
  }

  const createdTenantIds: string[] = [];
  const createdMemberIds: string[] = [];
  const createdAccounts: string[] = [];
  const updatedAccounts: string[] = [];

  for (const row of rows) {
    const tenantName = row.tenantName.trim();
    const adminEmail = row.adminEmail.toLowerCase();
    const adminName = row.adminName?.trim() || defaultNameFromEmail(adminEmail);
    const adminPassword = row.adminPassword || getDefaultPassword();
    const passwordHash = await bcrypt.hash(adminPassword, 12);

    const tenant = await TenantModel.findOneAndUpdate(
      { name: tenantName },
      { name: tenantName, status: "ACTIVE" },
      { upsert: true, returnDocument: "after", setDefaultsOnInsert: true }
    );

    if (!tenant) {
      throw new Error(`Failed to upsert tenant: ${tenantName}`);
    }

    let account = await AccountModel.findOne({ email: adminEmail });

    if (!account) {
      account = await AccountModel.create({
        email: adminEmail,
        name: adminName,
        passwordHash,
        status: "ACTIVE"
      });
      createdAccounts.push(adminEmail);
    } else {
      const updatePayload: {
        name?: string;
        status?: "ACTIVE";
        passwordHash?: string;
      } = {};

      if (account.name !== adminName) {
        updatePayload.name = adminName;
      }

      if (account.status !== "ACTIVE") {
        updatePayload.status = "ACTIVE";
      }

      if (resetExistingPasswords) {
        updatePayload.passwordHash = passwordHash;
      }

      if (Object.keys(updatePayload).length > 0) {
        await AccountModel.updateOne({ _id: account._id }, { $set: updatePayload });
        updatedAccounts.push(adminEmail);
      }
    }

    const membership = await TenantMemberModel.findOneAndUpdate(
      { tenantId: tenant._id, accountId: account._id },
      {
        tenantId: tenant._id,
        accountId: account._id,
        roles: row.roles,
        status: "ACTIVE"
      },
      { upsert: true, returnDocument: "after", setDefaultsOnInsert: true }
    );

    if (!membership) {
      throw new Error(`Failed to upsert membership for ${adminEmail} in ${tenantName}`);
    }

    createdTenantIds.push(tenant._id.toString());
    createdMemberIds.push(membership._id.toString());

    console.log(
      `Seeded tenant "${tenantName}" with user "${adminEmail}" roles=[${row.roles.join(", ")}]`
    );
  }

  console.log("Tenant seed completed");
  console.log(`Source file: ${seedFile}`);
  console.log(`Rows processed: ${rows.length}`);
  console.log(`Tenant records touched: ${createdTenantIds.length}`);
  console.log(`Membership records touched: ${createdMemberIds.length}`);
  console.log(`Accounts created: ${createdAccounts.length}`);
  console.log(`Accounts updated: ${updatedAccounts.length}`);
}

run()
  .catch((error) => {
    console.error("Tenant seed failed", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await disconnectFromDatabase();
  });
