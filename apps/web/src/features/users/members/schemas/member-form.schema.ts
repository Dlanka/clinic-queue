import { z } from "zod";
import { APP_ROLES } from "@/config/roles";

export const memberFormSchema = z.object({
  email: z.string().email("Valid email is required"),
  roles: z.array(z.enum(APP_ROLES)).min(1, "Select at least one role"),
  status: z.enum(["ACTIVE", "DISABLED"])
});

export type MemberFormValues = z.infer<typeof memberFormSchema>;
