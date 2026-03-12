import type { ReactNode } from "react";
import { createContext, useContext, useMemo, useState } from "react";
import type { Member } from "@/services/member.service";
import {
  createInitialMembersUiState,
  type MembersUiState
} from "../store/members.store";

type MembersPageContextValue = MembersUiState & {
  openCreateModal: () => void;
  openEditModal: (member: Member) => void;
  closeModal: () => void;
};

const MembersPageContext = createContext<MembersPageContextValue | null>(null);

export function MembersPageProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<MembersUiState>(createInitialMembersUiState);

  const value = useMemo<MembersPageContextValue>(
    () => ({
      ...state,
      openCreateModal: () =>
        setState({
          modalOpen: true,
          editingMember: null
        }),
      openEditModal: (member: Member) =>
        setState({
          modalOpen: true,
          editingMember: member
        }),
      closeModal: () => setState(createInitialMembersUiState())
    }),
    [state]
  );

  return <MembersPageContext.Provider value={value}>{children}</MembersPageContext.Provider>;
}

export function useMembersPageContext() {
  const context = useContext(MembersPageContext);
  if (!context) {
    throw new Error("useMembersPageContext must be used within MembersPageProvider");
  }

  return context;
}
