import bcrypt from "bcryptjs";
import { connectToDatabase, disconnectFromDatabase } from "../config/database";
import { AccountModel } from "../models/account.model";
import { TenantMemberModel } from "../models/tenant-member.model";
import { TenantModel } from "../models/tenant.model";

const seedConfig = {
  tenantName: process.env.SEED_TENANT_NAME ?? "Demo Clinic",
  tenantSlug: (process.env.SEED_TENANT_SLUG ?? "demo-clinic").toLowerCase(),
  adminName: process.env.SEED_ADMIN_NAME ?? "Admin User",
  adminEmail: (process.env.SEED_ADMIN_EMAIL ?? "admin@demo.com").toLowerCase(),
  adminPassword: process.env.SEED_ADMIN_PASSWORD ?? "Admin123!"
};

async function run() {
  await connectToDatabase();

  const tenant = await TenantModel.findOneAndUpdate(
    { slug: seedConfig.tenantSlug },
    { name: seedConfig.tenantName, slug: seedConfig.tenantSlug },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );

  const passwordHash = await bcrypt.hash(seedConfig.adminPassword, 12);
  const account = await AccountModel.findOneAndUpdate(
    { email: seedConfig.adminEmail },
    {
      email: seedConfig.adminEmail,
      name: seedConfig.adminName,
      passwordHash,
      isActive: true
    },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );

  await TenantMemberModel.findOneAndUpdate(
    { tenantId: tenant._id, accountId: account._id },
    {
      tenantId: tenant._id,
      accountId: account._id,
      roles: ["ADMIN"],
      isActive: true
    },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );

  console.log("Seed completed");
  console.log(`Tenant ID: ${tenant._id.toString()}`);
  console.log(`Admin Email: ${seedConfig.adminEmail}`);
  console.log("Admin Roles: ADMIN");
}

run()
  .catch((error) => {
    console.error("Seed failed", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await disconnectFromDatabase();
  });
