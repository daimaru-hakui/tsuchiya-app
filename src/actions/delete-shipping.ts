"use server";

import { auth } from "@/auth";
import { db } from "@/lib/firebase/server";
import { DeleteShippingSchema, ShippingDetail } from "@/types/shipping.type";
import { validateWithZodSchema } from "@/utils/schemas";
import { FieldValue } from "firebase-admin/firestore";

export async function deleteShipping(data: {
  shippingId: string;
  orderId: string;
}): Promise<{ status: string; message: string; }> {
  const result = validateWithZodSchema(DeleteShippingSchema, data);

  const session = await auth();
  if (!session) {
    throw new Error("認証エラー");
  }

  const orderRef = db.collection("orders").doc(result.orderId);
  const shippingRef = db.collection("shippings").doc(result.shippingId);
  const shippingDetailsRef = db
    .collection("shippings")
    .doc(result.shippingId)
    .collection("shippingDetails")
    .where("shippingId", "==", result.shippingId);

  try {
    await db
      .runTransaction(async (transaction) => {
        const shippingDetailsSnap = await transaction.get(shippingDetailsRef);
        const shippingDetails = shippingDetailsSnap.docs.map(
          (doc) =>
          ({
            ...doc.data(),
          } as ShippingDetail)
        );

        for (const detail of shippingDetails) {
          const ref = detail.skuRef as any;
          transaction.update(ref, {
            orderQuantity: FieldValue.increment(detail.quantity), // 追加
          });
        }

        const quantities = shippingDetails.filter(
          (detail) => detail.orderDetailRef
        );
        for (const detail of quantities) {
          const ref = detail.orderDetailRef as any;
          transaction.update(ref, {
            quantity: FieldValue.increment(detail.quantity),
          });
        }

        const stocks = shippingDetails.filter((detail) => detail.isStock);
        for (const stock of stocks) {
          const ref = stock.skuRef as any;
          transaction.update(ref, {
            stock: FieldValue.increment(stock.quantity),
          });
        }

        transaction.delete(shippingRef);

        transaction.update(orderRef, {
          status: "processing",
        });
      })
      .then(async () => {
        const shippingDetailsSnap = await shippingDetailsRef.get();
        const shippingDetails = shippingDetailsSnap.docs;
        for (const detail of shippingDetails) {
          db.collection("shippings")
            .doc(result.shippingId)
            .collection("shippingDetails")
            .doc(detail.id)
            .delete();
        }
      });
  } catch (e: unknown) {
    return {
      status: "error",
      message: e instanceof Error ? e.message : "登録が失敗しました"
    };
  }

  return {
    status: "success",
    message: "削除しました",
  };
}
