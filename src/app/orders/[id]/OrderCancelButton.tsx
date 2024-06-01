"use client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/useToast";
import { OrderDetail } from "@/types/order.type";
import { useRouter } from "next/navigation";
import * as actions from "@/actions";
import { useFormState, useFormStatus } from "react-dom";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";

interface Props {
  orderId: string;
  orderDetails: OrderDetail[];
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" size="xs" variant="outline" className="flex items-center" disabled={pending}>
      {pending ? (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      ) : (
        "キャンセル"
      )}
    </Button>
  );
}

export default function OrderCancelButton({ orderId, orderDetails }: Props) {
  const toast = useToast();
  const router = useRouter();

  const details = orderDetails.map(detail => (
    {
      id: detail.id,
      quantity: detail.quantity,
      orderQuantity: detail.orderQuantity,
      salePrice: detail.salePrice,
      inseam: detail.inseam || undefined
    }
  ));

  const cancelOrder = actions.updateOrderCancel.bind(null, { orderId, details });
  const [result, formDispatch] = useFormState(cancelOrder, {
    status: "",
    message: "",
  });

  useEffect(() => {
    if (result.status) {
      toast(result);
      if (result.status === "success") {
        router.push("/orders");
      }
    }
  }, [result, toast, router]);

  return (
    <form action={formDispatch}>
      <SubmitButton />
    </form>
  );
}