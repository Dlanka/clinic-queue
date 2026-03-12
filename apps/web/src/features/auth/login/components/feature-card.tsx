import { Activity } from "lucide-react";

type FeatureCardTone = "primary" | "tertiary" | "success";

export function FeatureCard({
  title,
  subtitle,
  value,
  tone,
  className
}: {
  title: string;
  subtitle: string;
  value: string;
  tone: FeatureCardTone;
  className?: string;
}) {
  const toneStyles = {
    primary: {
      iconWrap: "bg-primary-soft",
      iconColor: "text-primary",
      valueColor: "text-primary"
    },
    tertiary: {
      iconWrap: "bg-tertiary-soft",
      iconColor: "text-tertiary",
      valueColor: "text-tertiary"
    },
    success: {
      iconWrap: "bg-success-soft",
      iconColor: "text-success",
      valueColor: "text-success"
    }
  }[tone];

  return (
    <article
      className={`flex items-center gap-4 rounded-xl border border-neutral-70/40 px-5 py-4 backdrop-blur-sm transition-all hover:translate-x-2 ${className || ""}`}
    >
      <div className={`grid h-10 w-10 place-items-center rounded-lg ${toneStyles.iconWrap}`}>
        <Activity size={16} className={toneStyles.iconColor} />
      </div>
      <div>
        <p className="text-sm font-bold text-neutral-95">{title}</p>
        <p className="text-xs text-neutral-70">{subtitle}</p>
      </div>
      <p className={`ml-auto text-lg font-extrabold ${toneStyles.valueColor}`}>{value}</p>
    </article>
  );
}
