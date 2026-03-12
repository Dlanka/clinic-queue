import type { AppRole } from "@/config/roles";
import { APP_ROLES } from "@/config/roles";
import type { Member } from "@/services/member.service";

export const membersQueryKey = ["members"] as const;

export const roleOptions = APP_ROLES.map((role) => ({
  value: role,
  label: role.replaceAll("_", " ")
}));

export type MembersUiState = {
  modalOpen: boolean;
  editingMember: Member | null;
};

export const createInitialMembersUiState = (): MembersUiState => ({
  modalOpen: false,
  editingMember: null
});

export type RoleOption = {
  value: AppRole;
  label: string;
};
