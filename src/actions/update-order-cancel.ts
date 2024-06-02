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
  let skus = [];

  try {
    await db.runTransaction(async (transaction) => {
      for (const detail of result.data.details) {
        const orderDetailRef = orderRef
          .collection("orderDetails")
          .doc(detail.id);
        const orderDetailDoc = await transaction.get(orderDetailRef);
        const orderDetail = orderDetailDoc.data() as OrderDetail;
        const skuRef = orderDetail.skuRef as any;
        skus.push({ skuRef, orderQuantity: detail.orderQuantity });
      }
      for (const sku of skus) {
        transaction.update(sku.skuRef, {
          orderQuantity: FieldValue.increment(-sku.orderQuantity),
        });
      }
      transaction.delete(orderRef);
    });
  } catch (e: unknown) {
    return {
      status: "error",
      message: e instanceof Error ? e.message : "登録が失敗しました"
    };
  }

  return {
    status: "success",
    message: "キャンセルしました",
  };
}
