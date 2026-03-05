type ClassValue = string | false | null | undefined;

export function classes(...args: ClassValue[]) {
  return args.filter(Boolean).join(" ");
}
