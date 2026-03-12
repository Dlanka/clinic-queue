import { useForm, type Resolver } from "react-hook-form";
import { loginSchema, type LoginFormValues } from "../schemas/login.schema";

const loginResolver: Resolver<LoginFormValues> = async (values) => {
  const parsed = loginSchema.safeParse(values);
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

export function useLoginForm() {
  return useForm<LoginFormValues>({
    resolver: loginResolver,
    defaultValues: {
      email: "",
      password: ""
    }
  });
}
