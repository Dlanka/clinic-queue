import type { SectionNavigationItem } from "@/components/ui";

export type ProfileSection = "account" | "preferences" | "security" | "sessions";

export const profileSections: SectionNavigationItem<ProfileSection>[] = [
  {
    value: "account",
    label: "Account",
    subtitle: "Profile details",
    iconName: "user"
  },
  {
    value: "preferences",
    label: "Preferences",
    subtitle: "Locale & notifications",
    iconName: "settings"
  },
  {
    value: "security",
    label: "Security",
    subtitle: "Password settings",
    iconName: "lock"
  },
  {
    value: "sessions",
    label: "Active Sessions",
    subtitle: "Signed-in devices",
    iconName: "clock3"
  }
];

