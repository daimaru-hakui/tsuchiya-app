import { CalendarIcon, Loader2, Package } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import OrderShippingTable from "./order-shipping-table";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { Order, OrderDetail, CreateShipping } from "@/types";
import { useState, useTransition } from "react";
import * as actions from "@/actions";
import { useToast } from "@/hooks/useToast";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { DocumentReference, getDoc } from "firebase/firestore";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Props {
  order: Order;
  orderDetails: (OrderDetail & { stock: number; })[];
}

export default function OrderShippingModal({
  order,
  orderDetails,
}: Props) {
  const form = useForm<CreateShipping>();
  const [page, setPage] = useState(1);
  const [open, setOpen] = useState(false);
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const toast = useToast();

  const onSubmit = (data: CreateShipping) => {
    startTransition(async () => {
      const d = { ...order, ...data, createdAt: "", updatedAt: "", shippingCharge: Number(data.shippingCharge || 0) };
      const result = await actions.createShipping(d, order.id);
      toast(result, { reset, setOpen });
      setPage(1);
    });
  };

  const reset = () => {
    form.reset();
  };

  const handleRemainingOrderChange = () => {
    const details = form.getValues("details");
    details.forEach((detail, idx: number) => {
      form.setValue(`details.${idx}`, {
        id: detail.id,
        skuId: detail.skuId,
        quantity: detail.quantity,
        shippingQuantity: detail.shippingQuantity,
        salePrice: detail.salePrice
      });
    });
  };

  const getSkuStock = async (skuRef: DocumentReference): Promise<number> => {
    const snapShot = await getDoc(skuRef);
    const stock = snapShot.data()?.stock as number;
    return stock;
  };

  return (
    <Dialog open={open} onOpenChange={() => {
      setOpen(!open);
      setPage(1);
      reset();
    }}>
      <DialogTrigger asChild>
        <Package size={20} className="cursor-pointer" />
      </DialogTrigger>
      <DialogContent className="w-full md:min-w-[800px] lg:min-w-[1000px] 2xl:min-w-[1300px]">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-full overflow-auto"
          >
            <DialogHeader className="mb-6">
              <DialogTitle>出荷処理</DialogTitle>
            </DialogHeader>
            <div className="flex gap-3 my-3 mx-2">
              <input className="hidden"
                defaultValue={Number(order.orderNumber)}
                {...form.register("orderNumber", { valueAsNumber: true })}
              />
              <FormField
                control={form.control}
                name="shippingDate"
                defaultValue={new Date()?.toString()}
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>出荷日</FormLabel>
                    <Popover
                      open={calendarOpen}
                      onOpenChange={() => {
                        setCalendarOpen(!calendarOpen);
                      }}>
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
                              <span>{field.value}</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          numberOfMonths={1}
                          selected={new Date(field.value)}
                          onSelect={field.onChange}
                          initialFocus

                        />
                        <div className="w-full text-center">
                          <Button
                            size="xs"
                            variant="outline"
                            className="mb-2"
                            onClick={() => setCalendarOpen(!calendarOpen)}>
                            閉じる
                          </Button>
                        </div>
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="shippingCharge"
                render={({ field }) => (
                  <FormItem className="flex flex-col w-[150px]">
                    <FormLabel>送料</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={"0"}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue
                            placeholder={field.value} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="w-[200px]">
                        <SelectItem value={"0"}>{0}円</SelectItem>
                        <SelectItem value={"500"}>大阪 {500}円</SelectItem>
                        <SelectItem value={"600"}>大阪 {600}円</SelectItem>
                        <SelectItem value={"700"}>大阪 {700}円</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <OrderShippingTable
              orderDetails={orderDetails}
              form={form}
              getSkuStock={getSkuStock}
              page={page}
            />
            <DialogFooter className="mt-3 sm:justify-end gap-2">
              <>
                <DialogClose asChild>
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => setPage(1)}
                  >
                    閉じる
                  </Button>
                </DialogClose>
                <Button type="submit" disabled={isPending}>
                  {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  確定
                </Button>
              </>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
