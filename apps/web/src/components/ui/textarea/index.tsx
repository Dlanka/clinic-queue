import type { TextareaHTMLAttributes } from "react";
import type { VariantProps } from "tailwind-variants";
import { cn } from "../../../lib/cn";
import { textareaStyles } from "./textarea.tv";

type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & VariantProps<typeof textareaStyles>;

export function Textarea({ invalid, className, ...props }: TextareaProps) {
  return <textarea className={cn(textareaStyles({ invalid }), className)} {...props} />;
}
