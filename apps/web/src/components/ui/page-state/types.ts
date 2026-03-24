import type { ReactNode } from "react";
import type { IconName } from "@/config/icons";

export type PageStateTone = "info" | "warning" | "danger" | "success" | "neutral";

export type PageStatePreset =
  | "accessDenied"
  | "wrongRole"
  | "notFound"
  | "serverError"
  | "empty"
  | "offline"
  | "sessionExpired"
  | "loading"
  | "success";

export interface PageStateAction {
  label: string;
  onClick: () => void;
  startIconName?: IconName;
  variant?: "fill" | "tonal" | "outlined" | "text";
  intent?: "primary" | "secondary" | "neutral" | "success" | "warning" | "error" | "info" | "ghost";
}

export interface PageStateProps {
  preset?: PageStatePreset;
  title: string;
  description?: ReactNode;
  badgeLabel?: string;
  iconName?: IconName;
  tone?: PageStateTone;
  primaryAction?: PageStateAction;
  secondaryAction?: PageStateAction;
  footnote?: ReactNode;
  fullPage?: boolean;
  className?: string;
}
