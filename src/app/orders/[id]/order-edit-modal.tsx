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
import { Form } from "@/components/ui/form";
import {
  Order,
  OrderDetail,
  UpdateOrder,
  UpdateOrderSchema,
} from "@/types/order.type";
import { Edit, Loader2 } from "lucide-react";
import React, { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import OrderEditHeader from "./order-edit-header";
import OrderEditTable from "./order-edit-talbe";
import { zodResolver } from "@hookform/resolvers/zod";
import * as actions from "@/actions/update-order";
import { useToast } from "@/hooks/useToast";

interface Props {
  order: Order;
  orderDetails: OrderDetail[];
}

export default function OrderEditModal({ order, orderDetails }: Props) {
  const [isPending, startTransition] = useTransition();
  const [open, setOpen] = useState(false);
  const toast = useToast();
  const form = useForm<UpdateOrder>({
    resolver: zodResolver(UpdateOrderSchema),
  });

  const onSubmit = (data: UpdateOrder) => {
    console.log(data);
    startTransition(async () => {
      const result = await actions.updateOrder(data);
      toast(result);
    });
  };

  const isError = (data: any) => {
    console.log(data);
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
      <DialogContent className="w-full overflow-auto max-h-screen  md:min-w-[800px] lg:min-w-[1050px] 2xl:min-w-[1400px]">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit, isError)}
            className="w-full overflow-auto"
          >
            <input
              className="hidden"
              {...form.register("orderId")}
              defaultValue={order.id}
            />
            <DialogHeader className="mb-6">
              <DialogTitle>編集</DialogTitle>
            </DialogHeader>
            <OrderEditHeader order={order} form={form} />
            <div className="mt-4">
              <OrderEditTable
                order={order}
                orderDetails={orderDetails}
                form={form}
              />
            </div>
            <DialogFooter className="mt-3 sm:justify-end gap-2">
              <>
                <DialogClose asChild>
                  <Button type="button" variant="secondary">
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
