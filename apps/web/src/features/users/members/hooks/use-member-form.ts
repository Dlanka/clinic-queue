import { useEffect } from "react";
import { useForm, type Resolver } from "react-hook-form";
import type { Member } from "@/services/member.service";
import { memberFormSchema, type MemberFormValues } from "../schemas/member-form.schema";

const memberFormResolver: Resolver<MemberFormValues> = async (values) => {
  const parsed = memberFormSchema.safeParse(values);

  if (parsed.success) {
    return { values: parsed.data, errors: {} };
  }

  const errors = parsed.error.issues.reduce<Record<string, { type: string; message: string }>>(
    (accumulator, issue) => {
      const fieldName = String(issue.path[0] ?? "root");
      accumulator[fieldName] = { type: "manual", message: issue.message };
      return accumulator;
    },
    {}
  );

  return { values: {}, errors: errors as never };
};

export function useMemberForm(open: boolean, member: Member | null) {
  const form = useForm<MemberFormValues>({
    resolver: memberFormResolver,
    defaultValues: {
      email: member?.email ?? "",
      roles: member?.roles ?? ["RECEPTION"],
      status: member?.status === "ACTIVE" ? "ACTIVE" : "DISABLED"
    }
  });

  useEffect(() => {
    if (!open) {
      return;
    }

    form.reset({
      email: member?.email ?? "",
      roles: member?.roles ?? ["RECEPTION"],
      status: member?.status === "ACTIVE" ? "ACTIVE" : "DISABLED"
    });
  }, [form, member, open]);

  return form;
}
