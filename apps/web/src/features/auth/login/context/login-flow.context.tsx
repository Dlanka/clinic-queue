import type { ReactNode } from "react";
import { createContext, useContext, useMemo, useState } from "react";
import type { TenantChoice } from "@/services/auth.service";
import {
  createInitialLoginFlowState,
  createTenantSelectionState,
  type LoginFlowState
} from "../store/login-flow.store";

type LoginFlowContextValue = LoginFlowState & {
  inTenantSelectionMode: boolean;
  setSelectedTenantId: (tenantId: string) => void;
  startTenantSelection: (loginToken: string, tenants: TenantChoice[]) => void;
  resetTenantSelection: () => void;
};

const LoginFlowContext = createContext<LoginFlowContextValue | null>(null);

export function LoginFlowProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<LoginFlowState>(createInitialLoginFlowState);

  const value = useMemo<LoginFlowContextValue>(
    () => ({
      ...state,
      inTenantSelectionMode: Boolean(state.loginToken),
      setSelectedTenantId: (tenantId: string) =>
        setState((previousState) => ({ ...previousState, selectedTenantId: tenantId })),
      startTenantSelection: (loginToken: string, tenants: TenantChoice[]) =>
        setState(createTenantSelectionState(loginToken, tenants)),
      resetTenantSelection: () => setState(createInitialLoginFlowState())
    }),
    [state]
  );

  return <LoginFlowContext.Provider value={value}>{children}</LoginFlowContext.Provider>;
}

export function useLoginFlow() {
  const context = useContext(LoginFlowContext);
  if (!context) {
    throw new Error("useLoginFlow must be used within LoginFlowProvider");
  }

  return context;
}
