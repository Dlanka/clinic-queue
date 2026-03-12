export function Pill({ label }: { label: string }) {
  return (
    <span className="rounded-full border border-neutral-variant-80 bg-neutral-20/75 px-5 py-1 text-xs font-semibold text-neutral-80">
      {label}
    </span>
  );
}
