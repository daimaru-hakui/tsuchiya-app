"use server";

import { auth } from "@/auth";
import { db } from "@/lib/firebase/server";
import {
  OrderDetail,
  UpdateOrderCancel,
  UpdateOrderCancelSchema,
} from "@/types/order.type";
import { FieldValue } from "firebase-admin/firestore";

export async function updateOrderCancel(data: UpdateOrderCancel): Promise<{
  status: string;
  message: string;
}> {
  const result = UpdateOrderCancelSchema.safeParse({
    orderId: data.orderId,
    details: data.details,
  });

  if (!result.success) {
    return {
      status: "error",
      message: result.error.errors.join(","),
    };
  }

  const session = await auth();
  if (!session) {
    return {
      status: "error",
      message: "認証エラー",
    };
  }

  const orderRef = db.collection("orders").doc(result.data.orderId);

  try {
    await db.runTransaction(async (transaction) => {
      for (const detail of result.data.details) {
        const orderDetailRef = orderRef
          .collection("orderDetails")
          .doc(detail.id);
        const orderDetailDoc = await transaction.get(orderDetailRef);
        const orderDetail = orderDetailDoc.data() as OrderDetail;
        const skuRef = orderDetail.skuRef as any;
        transaction.update(skuRef, {
          orderQuantity: FieldValue.increment(-detail.orderQuantity),
        });
      }
      transaction.delete(orderRef);
    });
  } catch (e) {
    if (e instanceof Error) {
      return {
        status: "error",
        message: e.message,
      };
    } else {
      return {
        status: "error",
        message: "エラーが発生しました",
      };
    }
  }

  return {
    status: "success",
    message: "キャンセルしました",
  };
}
