import { Package } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import OrderShippingTable from "./order-shipping-table";
import { Form } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { Order, OrderDetail, CreateShipping } from "@/types";
import { useState, useTransition } from "react";
import OrderRemainingTable from "./order-remaining-table";
import { useShipping } from "@/hooks/useShipping";

interface Props {
  order: Order;
  orderDetails: OrderDetail[];
}

export default function OrderShippingModal({ order, orderDetails }: Props) {
  const form = useForm<CreateShipping>();
  const [page, setPage] = useState(1);
  const [isPending, startTransition] = useTransition();
  const { createShipping } = useShipping();

  const onSubmit = (data: CreateShipping) => {
    startTransition(async () => {
      const a = { ...order, ...orderDetails, ...data };
      console.log(a);
      await createShipping(a, order.id);
    });
    console.log(data);
  };

  const handleRemainingOrderChange = () => {
    const details = form.getValues("details");
    details.forEach((detail, idx: number) => {
      form.setValue(`details.${idx}`, {
        id: detail.id,
        skuId: detail.skuId,
        quantity: detail.quantity,
        shippingQuantity: detail.shippingQuantity,
        remainingQuantity: Number(detail.quantity) - Number(detail.shippingQuantity)
      });
    });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Package size={20} className="cursor-pointer" />
      </DialogTrigger>
      <DialogContent className="w-full md:min-w-[900px]">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="w-full overflow-auto">
            <DialogHeader>
              <DialogTitle>出荷処理</DialogTitle>
              <DialogDescription>
                出荷数量を入力してください。
              </DialogDescription>
            </DialogHeader>
            {page === 1 && (
              <OrderShippingTable
                orderDetails={orderDetails}
                form={form}
              />
            )}
            {page === 2 && (
              <OrderRemainingTable
                orderDetails={orderDetails}
                form={form}
              />
            )}
            <DialogFooter className="mt-3 sm:justify-end">
              {page === 1 && (
                <>
                  <DialogClose asChild>
                    <Button type="button" variant="secondary" onClick={() => setPage(1)}>
                      閉じる
                    </Button>
                  </DialogClose>
                  <Button
                    key="next"
                    type="button"
                    onClick={() => {
                      setPage(2);
                      handleRemainingOrderChange();
                    }}
                  >
                    次へ
                  </Button>
                </>
              )}
              {page === 2 && (
                <>
                  <Button key="prev" variant="secondary" type="button" onClick={() => setPage(1)}>戻る</Button>
                  <Button type="submit">確定</Button>
                </>
              )}
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}