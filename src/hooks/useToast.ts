import { toast as shadcnToast } from "@/components/ui/use-toast";
import { format } from "date-fns";

export function useToast() {

  const toast = (
    result: {
      status: string, message: string;
    },
    options?: {
      setOpen?: React.Dispatch<React.SetStateAction<boolean>>,
      reset?: (() => void | undefined);
      remove?: (() => void | undefined);
      setValue?: void;
    }
  ) => {
    if (result.status === "success") {
      shadcnToast({
        title: result.message,
        variant: "success",
        description: format(new Date(), "PPpp"),
      });
      options?.setOpen && options.setOpen(false);
      options?.reset && options.reset();
      options?.remove && options.remove();
      options?.setValue && options.setValue;
    } else if (result.status === "error") {
      shadcnToast({
        title: result?.message,
        variant: "destructive",
        description: format(new Date(), "PPpp"),
      });
    }
  };

  return toast;
}