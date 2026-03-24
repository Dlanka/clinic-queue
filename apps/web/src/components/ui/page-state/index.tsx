import { iconMap, type IconName } from "@/config/icons";
import { cn } from "@/lib/cn";
import { Badge } from "../badge";
import { Button } from "../button";
import { pageStateStyles } from "./page-state.tv";
import type { PageStatePreset, PageStateProps, PageStateTone } from "./types";

const presetConfig: Record<
  PageStatePreset,
  {
    iconName: IconName;
    tone: PageStateTone;
    badgeLabel: string;
  }
> = {
  accessDenied: { iconName: "lock", tone: "danger", badgeLabel: "403 - ACCESS DENIED" },
  wrongRole: { iconName: "user", tone: "warning", badgeLabel: "ROLE REQUIRED" },
  notFound: { iconName: "search", tone: "info", badgeLabel: "404" },
  serverError: { iconName: "activity", tone: "danger", badgeLabel: "500" },
  empty: { iconName: "clipboardList", tone: "info", badgeLabel: "EMPTY" },
  offline: { iconName: "ellipsis", tone: "warning", badgeLabel: "OFFLINE" },
  sessionExpired: { iconName: "clock3", tone: "info", badgeLabel: "SESSION" },
  loading: { iconName: "refreshCcw", tone: "info", badgeLabel: "LOADING" },
  success: { iconName: "check", tone: "success", badgeLabel: "SUCCESS" }
};

export function PageState({
  preset,
  title,
  description,
  badgeLabel,
  iconName,
  tone,
  primaryAction,
  secondaryAction,
  footnote,
  fullPage = false,
  className
}: PageStateProps) {
  const presetValues = preset ? presetConfig[preset] : undefined;

  const resolvedTone = tone ?? presetValues?.tone ?? "info";
  const resolvedIconName = iconName ?? presetValues?.iconName ?? "activity";
  const resolvedBadgeLabel = badgeLabel ?? presetValues?.badgeLabel;

  const Icon = iconMap[resolvedIconName];
  const styles = pageStateStyles({ tone: resolvedTone });

  const content = (
    <section className={cn(styles.root(), className)}>
      <div className={styles.glow()} />
      <div className={styles.grid()} />

      <div className={styles.content()}>
        <div className={styles.iconWrap()}>
          <Icon size={40} />
        </div>

        {resolvedBadgeLabel ? (
          <div>
            <Badge
              tone={resolvedTone === "danger" ? "danger" : resolvedTone}
              className={styles.badge()}
            >
              {resolvedBadgeLabel}
            </Badge>
          </div>
        ) : null}

        <h1 className={styles.title()}>{title}</h1>

        {description ? <p className={styles.description()}>{description}</p> : null}

        {primaryAction || secondaryAction ? (
          <div className={styles.actions()}>
            {primaryAction ? (
              <Button
                startIconName={primaryAction.startIconName}
                variant={primaryAction.variant ?? "fill"}
                intent={primaryAction.intent ?? "primary"}
                onClick={primaryAction.onClick}
              >
                {primaryAction.label}
              </Button>
            ) : null}

            {secondaryAction ? (
              <Button
                startIconName={secondaryAction.startIconName}
                variant={secondaryAction.variant ?? "outlined"}
                intent={secondaryAction.intent ?? "neutral"}
                onClick={secondaryAction.onClick}
              >
                {secondaryAction.label}
              </Button>
            ) : null}
          </div>
        ) : null}

        {footnote ? <p className={styles.footnote()}>{footnote}</p> : null}
      </div>
    </section>
  );

  if (fullPage) {
    return <div className={styles.fullPageWrap()}>{content}</div>;
  }

  return content;
}

export type { PageStateAction, PageStatePreset, PageStateProps, PageStateTone } from "./types";
