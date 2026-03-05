import bcrypt from "bcryptjs";
import { connectToDatabase, disconnectFromDatabase } from "../config/database";
import { AccountModel } from "../models/account.model";
import { TenantMemberModel } from "../models/tenant-member.model";
import { TenantModel } from "../models/tenant.model";

const seedConfig = {
  tenantAName: process.env.SEED_TENANT_A_NAME ?? "Tenant A Clinic",
  tenantBName: process.env.SEED_TENANT_B_NAME ?? "Tenant B Clinic",
  memberName: process.env.SEED_MEMBER_NAME ?? "Multi Tenant User",
  memberEmail: (process.env.SEED_MEMBER_EMAIL ?? "admin@demo.com").toLowerCase(),
  memberPassword: process.env.SEED_MEMBER_PASSWORD ?? "Admin123!"
};

async function run() {
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

  const [tenantA, tenantB] = await Promise.all([
    TenantModel.findOneAndUpdate(
      { name: seedConfig.tenantAName },
      { name: seedConfig.tenantAName, status: "ACTIVE" },
      { upsert: true, returnDocument: "after", setDefaultsOnInsert: true }
    ),
    TenantModel.findOneAndUpdate(
      { name: seedConfig.tenantBName },
      { name: seedConfig.tenantBName, status: "ACTIVE" },
      { upsert: true, returnDocument: "after", setDefaultsOnInsert: true }
    )
  ]);

  const passwordHash = await bcrypt.hash(seedConfig.memberPassword, 12);
  const account = await AccountModel.findOneAndUpdate(
    { email: seedConfig.memberEmail },
    {
      email: seedConfig.memberEmail,
      name: seedConfig.memberName,
      passwordHash,
      status: "ACTIVE"
    },
    { upsert: true, returnDocument: "after", setDefaultsOnInsert: true }
  );

  await Promise.all([
    TenantMemberModel.findOneAndUpdate(
      { tenantId: tenantA._id, accountId: account._id },
      {
        tenantId: tenantA._id,
        accountId: account._id,
        roles: ["ADMIN"],
        status: "ACTIVE"
      },
      { upsert: true, returnDocument: "after", setDefaultsOnInsert: true }
    ),
    TenantMemberModel.findOneAndUpdate(
      { tenantId: tenantB._id, accountId: account._id },
      {
        tenantId: tenantB._id,
        accountId: account._id,
        roles: ["DOCTOR"],
        status: "ACTIVE"
      },
      { upsert: true, returnDocument: "after", setDefaultsOnInsert: true }
    )
  ]);

  console.log("Seed completed");
  console.log(`Account Email: ${seedConfig.memberEmail}`);
  console.log(`Tenant A ID: ${tenantA._id.toString()} roles: ADMIN`);
  console.log(`Tenant B ID: ${tenantB._id.toString()} roles: DOCTOR`);
}

run()
  .catch((error) => {
    console.error("Seed failed", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await disconnectFromDatabase();
  });
