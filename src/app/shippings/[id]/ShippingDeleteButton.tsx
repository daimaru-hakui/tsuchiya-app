"use client";
import { Loader2, Trash2Icon } from "lucide-react";
import React, { useEffect } from "react";
import * as actions from "@/actions";
import { useFormState, useFormStatus } from "react-dom";
import { useToast } from "@/hooks/useToast";
import { useRouter } from "next/navigation";

interface Props {
  shippingId: string;
  orderId: string;
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" className="flex items-center" disabled={pending}>
      {pending ? (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      ) : (
        <Trash2Icon />
      )}
    </button>
  );
}

export default function ShippingDeleteButton({ shippingId, orderId }: Props) {
  const toast = useToast();
  const router = useRouter();
  const deleteShipping = actions.deleteShipping.bind(null, {shippingId,orderId});
  const [result, formDispatch] = useFormState(deleteShipping, {
    status: "",
    message: "",
  });

  useEffect(() => {
    if (result.status) {
      toast(result);
      if (result.status === "success") {
        router.push("/shippings");
      }
    }
  }, [result, toast, router]);

  return (
    <form action={formDispatch}>
      <SubmitButton />
    </form>
  );
}
