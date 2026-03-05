import { useQuery } from "@tanstack/react-query";
import { AuthService } from "@/services/auth.service";

export const meQueryKey = ["auth", "me"];

export function useMe(enabled = true) {
  return useQuery({
    queryKey: meQueryKey,
    queryFn: AuthService.me,
    retry: false,
    enabled
  });
}
