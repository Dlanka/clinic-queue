import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { AuthService } from "@/services/auth.service";
import { setTenantIdHeader } from "@/services/http";

export const meQueryKey = ["auth", "me"];

export function useMe(enabled = true) {
  const query = useQuery({
    queryKey: meQueryKey,
    queryFn: AuthService.me,
    retry: false,
    enabled
  });

  useEffect(() => {
    if (query.data?.tenant.id) {
      setTenantIdHeader(query.data.tenant.id);
    }
  }, [query.data?.tenant.id]);

  return query;
}
