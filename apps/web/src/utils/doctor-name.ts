export function formatDoctorDisplayName(name: string) {
  const trimmed = name.trim();
  if (!trimmed) {
    return "Dr.";
  }

  const withoutPrefix = trimmed.replace(/^dr\.?\s*/i, "").trim();
  return `Dr. ${withoutPrefix}`;
}

