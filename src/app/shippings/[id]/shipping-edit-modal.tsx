import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import {
  Shipping,
  ShippingDetail,
  UpdateShipping,
  UpdateShippingSchema,
} from "@/types/shipping.type";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { CalendarIcon, Edit, Loader2 } from "lucide-react";
import React, { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import ShippingEditTable from "./shipping-edit-table";
import * as actions from "@/actions";
import { useToast } from "@/hooks/useToast";

interface Props {
  shipping: Shipping;
  shippingDetails: ShippingDetail[];
}

export default function ShippingEditModal({
  shipping,
  shippingDetails,
}: Props) {
  const [open, setOpen] = useState(false);
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const toast = useToast();
  const form = useForm<UpdateShipping>({
    resolver: zodResolver(UpdateShippingSchema),
  });

  const onSubmit = (data: UpdateShipping) => {
    startTransition(async () => {
      const result = await actions.updateShipping(data, shipping.id);
      toast(result);
      setOpen(false);
    });
  };

  return (
    <Dialog
      open={open}
      onOpenChange={() => {
        setOpen(!open);
        form.reset();
      }}
    >
      <DialogTrigger asChild>
        <Edit size={20} className="cursor-pointer" />
      </DialogTrigger>
      <DialogContent className="w-full max-h-screen overflow-auto md:min-w-[800px] lg:min-w-[1100px]">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-full overflow-auto"
          >
            <DialogHeader className="mb-6">
              <DialogTitle>出荷処理</DialogTitle>
            </DialogHeader>
            <div className="flex gap-3 mx-2 my-3">
              <FormField
                control={form.control}
                name="shippingDate"
                defaultValue={shipping.shippingDate}
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>出荷日</FormLabel>
                    <Popover
                      open={calendarOpen}
                      onOpenChange={() => {
                        setCalendarOpen(!calendarOpen);
                      }}
                    >
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-[240px] pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "yyyy-MM-dd")
                            ) : (
                              <span>{format(field.value, "yyyy")}</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          numberOfMonths={1}
                          selected={field.value}
                          onSelect={field.onChange}
                          initialFocus
                        />
                        <div className="w-full text-center">
                          <Button
                            size="xs"
                            variant="outline"
                            className="mb-2"
                            onClick={() => setCalendarOpen(!calendarOpen)}
                          >
                            閉じる
                          </Button>
                        </div>
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <ShippingEditTable form={form} shippingDetails={shippingDetails} />
            <DialogFooter className="mt-3 sm:justify-end gap-2">
              <>
                <DialogClose asChild>
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => form.reset()}
                  >
                    閉じる
                  </Button>
                </DialogClose>
                <Button type="submit" disabled={isPending}>
                  {isPending && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  更新
                </Button>
              </>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
