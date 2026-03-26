type SettingsPlaceholderSectionProps = {
  label?: string;
};

export function SettingsPlaceholderSection({ label }: SettingsPlaceholderSectionProps) {
  return (
    <div className="rounded-md border border-subtle bg-neutral-20 px-4 py-3 text-sm text-neutral-70">
      Section scaffold is ready. Next I can implement the full {label ?? "section"} form using this
      same layout.
    </div>
  );
}

