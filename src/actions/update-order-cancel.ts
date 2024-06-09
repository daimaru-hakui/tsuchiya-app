"use server";

import { auth } from "@/auth";
import { db } from "@/lib/firebase/server";
import {
  OrderDetail,
  UpdateOrderCancel,
  UpdateOrderCancelSchema,
} from "@/types/order.type";
import { validateWithZodSchema } from "@/utils/schemas";
import { FieldValue } from "firebase-admin/firestore";

export async function updateOrderCancel(data: UpdateOrderCancel): Promise<{
  status: string;
  message: string;
}> {
  try {
    const result = validateWithZodSchema(UpdateOrderCancelSchema, data);

    const session = await auth();
    if (!session) {
      throw new Error("認証エラー");
    }

    const orderRef = db.collection("orders").doc(result.orderId);
    let skus = [];

    await db.runTransaction(async (transaction) => {
      for (const detail of result.details) {
        const orderDetailRef = orderRef
          .collection("orderDetails")
          .doc(detail.id);
        const orderDetailDoc = await transaction.get(orderDetailRef);
        const orderDetail = orderDetailDoc.data() as OrderDetail;

        const skusRef = db
          .collectionGroup("skus")
          .where("id", "==", orderDetail.skuId)
          .orderBy("id", "asc")
          .orderBy("sortNum", "asc");

        const skuDocs = await transaction.get(skusRef);
        const skuRef = skuDocs.docs[0].ref;

        skus.push({ skuRef, orderQuantity: detail.orderQuantity });
      }
      for (const sku of skus) {
        transaction.update(sku.skuRef, {
          orderQuantity: FieldValue.increment(-sku.orderQuantity),
          updatedAt: FieldValue.serverTimestamp(),
        });
      }
      transaction.update(orderRef,{
        status:"canceled"
      });
    });
  } catch (e: unknown) {
    console.log(e);
    return {
      status: "error",
      message: e instanceof Error ? e.message : "登録が失敗しました",
    };
  }
  return {
    status: "success",
    message: "キャンセルしました",
  };
}
