import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/hooks/useToast";
import { db } from "@/lib/firebase/client";
import { doc, updateDoc } from "firebase/firestore";
import { Loader2 } from "lucide-react";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";

interface Props {
  shippingId: string;
  courier: string,
  trackingNumber: string;
}

interface Inputs {
  trackingNumber: string, courier: string;
}

export default function ShippingInvoiceModal({ courier, trackingNumber, shippingId }: Props) {
  const form = useForm<Inputs>();
  const [isPending, startTransaction] = useTransition();
  const [open, setOpen] = useState(false);
  const toast = useToast();

  const onSubmit = async (data: Inputs) => {
    startTransaction(async () => {
      try {
        const shippingRef = doc(db, "shippings", shippingId);
        await updateDoc(shippingRef, {
          trackingNumber: data.trackingNumber,
          courier: data.courier,
          status: data.trackingNumber ? "finished" : "picking"
        });
        toast({ status: "success", message: trackingNumber ? "更新しました" : "登録しました" });
        setOpen(false);
      } catch (e: unknown) {
        if (e instanceof Error) {
          const result = { status: "error", message: e.message };
          toast(result);
        }
      };
    });
  };

  return (
    <Dialog open={open} onOpenChange={() => setOpen(!open)}>
      <DialogTrigger asChild>
        <Button size="xs"> {trackingNumber ? "送状更新" : "送状登録"}</Button>
      </DialogTrigger>
      <DialogContent className="w-full overflow-auto max-h-screen md:w-[350px]">
        <DialogHeader>
          <DialogTitle>送状登録</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="trackingNumber"
              defaultValue={trackingNumber || ""}
              render={({ field }) => (
                <FormItem id="noAllow" >
                  <FormLabel>送状No.</FormLabel>
                  <FormControl id="noAllow" >
                    <Input type="number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="courier"
              defaultValue={courier || "seino"}
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>運送便</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex flex-col space-y-1"
                    >
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="seino" />
                        </FormControl>
                        <FormLabel className="font-normal">
                          西濃運輸
                        </FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="sagawa" />
                        </FormControl>
                        <FormLabel className="font-normal">
                          佐川急便
                        </FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="fukuyama" />
                        </FormControl>
                        <FormLabel className="font-normal">
                          福山通運
                        </FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button disabled={isPending} type="submit" className="w-full">
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {trackingNumber ? "更新" : "登録"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}