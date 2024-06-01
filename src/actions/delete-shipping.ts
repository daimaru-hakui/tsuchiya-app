"use server";

import { auth } from "@/auth";
import { db } from "@/lib/firebase/server";
import { DeleteShippingSchema, ShippingDetail } from "@/types/shipping.type";
import { FieldValue } from "firebase-admin/firestore";

export async function deleteShipping(data: {
  shippingId: string;
  orderId: string;
}): Promise<{ status: string; message: string; }> {
  const result = DeleteShippingSchema.safeParse({
    shippingId: data.shippingId,
    orderId: data.orderId,
  });

  if (!result.success) {
    console.log(result.error.errors);
    return {
      status: "error",
      message: result.error.errors.join(","),
    };
  }

  const session = await auth();
  if (!session) {
    console.log("認証エラー");
    return {
      status: "error",
      message: "認証エラー",
    };
  }

  const orderRef = db.collection("orders").doc(result.data.orderId);
  const shippingRef = db.collection("shippings").doc(result.data.shippingId);
  const shippingDetailsRef = db
    .collection("shippings")
    .doc(result.data.shippingId)
    .collection("shippingDetails")
    .where("shippingId", "==", result.data.shippingId);

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
            orderQuantity: FieldValue.increment(stock.quantity), // 追加
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
            .doc(result.data.shippingId)
            .collection("shippingDetails")
            .doc(detail.id)
            .delete();
        }
      });
  } catch (e) {
    if (e instanceof Error) {
      console.error(e.message);
      return {
        status: "error",
        message: e.message,
      };
    } else {
      console.error(e);
      return {
        status: "error",
        message: "エラーが発生しました",
      };
    }
  }

  return {
    status: "success",
    message: "削除しました",
  };
}
