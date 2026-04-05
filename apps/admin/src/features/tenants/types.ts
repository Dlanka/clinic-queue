export type TenantItem = {
  id: string;
  name: string;
  status: "ACTIVE" | "INACTIVE";
  memberCount: number;
};
