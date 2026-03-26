import { useQuery } from "@tanstack/react-query";
import { SettingsService } from "@/services/settings.service";

export const settingsQueryKey = ["settings"] as const;

export function useTenantSettings(enabled = true) {
  return useQuery({
    queryKey: settingsQueryKey,
    queryFn: SettingsService.get,
    enabled
  });
}

