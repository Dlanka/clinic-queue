import { SectionDivider } from "@/components/ui";

type PatientVisitTextSectionProps = {
  title: string;
  iconName: "activity" | "clipboardList" | "menu";
  value?: string;
};

export function PatientVisitTextSection({
  title,
  iconName,
  value
}: PatientVisitTextSectionProps) {
  return (
    <div className="space-y-1.5">
      <SectionDivider
        label={title}
        iconName={iconName}
        showLeadingLine={false}
        showTrailingLine={false}
        className="w-full"
      />
      <div className="rounded-md border border-subtle bg-neutral-20/70 px-4 py-3 text-sm text-neutral-90">
        {value?.trim() ? value : "-"}
      </div>
    </div>
  );
}
