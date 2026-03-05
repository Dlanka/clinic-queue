import { Toaster, toast } from "sonner";
import { cn } from "../../../lib/cn";
import { toastCardStyles, toastToneStyles } from "./toast.tv";

export function AppToaster() {
  return <Toaster position="top-right" toastOptions={{ className: toastCardStyles() }} />;
}

export function useToast() {
  return {
    success: (message: string, description?: string) => {
      toast.success(message, {
        description,
        className: cn(toastCardStyles(), toastToneStyles({ tone: "success" }))
      });
    },
    error: (message: string, description?: string) => {
      toast.error(message, {
        description,
        className: cn(toastCardStyles(), toastToneStyles({ tone: "error" }))
      });
    }
  };
}
