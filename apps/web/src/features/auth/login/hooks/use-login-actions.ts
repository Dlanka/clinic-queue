import axios from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { useNavigate } from "@tanstack/react-router";
import { meQueryKey } from "@/hooks/use-me";
import { AuthService } from "@/services/auth.service";
import { useToast } from "@/components/ui";
import type { TenantChoice } from "@/services/auth.service";
import type { LoginFormValues } from "../schemas/login.schema";

type UseLoginActionsParams = {
  navigate: ReturnType<typeof useNavigate>;
  loginToken: string;
  selectedTenantId: string;
  startTenantSelection: (loginToken: string, tenants: TenantChoice[]) => void;
};

export function useLoginActions({
  navigate,
  loginToken,
  selectedTenantId,
  startTenantSelection
}: UseLoginActionsParams) {
  const toast = useToast();
  const queryClient = useQueryClient();

  const loginMutation = useMutation({
    mutationFn: ({ email, password }: LoginFormValues) => AuthService.login(email, password),
    onSuccess: async (response) => {
      if (response.mode === "LOGGED_IN") {
        await queryClient.invalidateQueries({ queryKey: meQueryKey });
        await navigate({ to: "/" });
        return;
      }

      startTenantSelection(response.loginToken, response.tenants);
    },
    onError: (error) => {
      const message =
        axios.isAxiosError(error) && typeof error.response?.data?.message === "string"
          ? error.response.data.message
          : "Unable to login";
      toast.error("Login failed", message);
    }
  });

  const selectTenantMutation = useMutation({
    mutationFn: () => AuthService.selectTenant(loginToken, selectedTenantId),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: meQueryKey });
      await navigate({ to: "/" });
    },
    onError: (error) => {
      const message =
        axios.isAxiosError(error) && typeof error.response?.data?.message === "string"
          ? error.response.data.message
          : "Unable to select tenant";
      toast.error("Tenant selection failed", message);
    }
  });

  return {
    loginMutation,
    selectTenantMutation
  };
}
