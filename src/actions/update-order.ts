"use server";
import { auth } from "@/auth";
import { db } from "@/lib/firebase/server";
import {
  Order,
  OrderDetail,
  UpdateOrder,
  UpdateOrderSchema,
} from "@/types/order.type";
import { validateWithZodSchema } from "@/utils/schemas";
import { FieldValue } from "firebase-admin/firestore";

export async function updateOrder(
  data: UpdateOrder
): Promise<{ status: string; message: string; }> {
  try {
    const result = validateWithZodSchema(UpdateOrderSchema, data);

    const session = await auth();
    if (!session) {
      throw new Error("認証エラー");
    }

    const orderRef = db.collection("orders").doc(result.orderId);
    const orderDetailsRef = db
      .collection("orders")
      .doc(result.orderId)
      .collection("orderDetails");

    let skus = [];

    await db.runTransaction(async (transaction) => {
      const orderSnap = await transaction.get(orderRef);
      const order = orderSnap.data() as Order;

      for (const detail of result.details) {
        const ref = orderDetailsRef.doc(detail.id);
        const orderDetailDoc = await transaction.get(ref);
        const orderDetail = orderDetailDoc.data() as OrderDetail;
        const skuRef = orderDetail.skuRef as any;
        skus.push({
          skuRef,
          inputOrderQuantity: detail.orderQuantity,
          orderQuantity: orderDetail.orderQuantity
        });
      }

      for (const sku of skus) {
        transaction.update(sku.skuRef, {
          orderQuantity: FieldValue.increment(
            sku.inputOrderQuantity - sku.orderQuantity
          ),
        });
      }

      transaction.update(orderRef, {
        orderId: result.orderId,
        section: result.section,
        employeeCode: result.employeeCode,
        initial: result.initial,
        username: result.username,
        companyName: result.companyName,
        position: result.position,
        details: result.details,
        siteCode: result.siteCode,
        siteName: result.siteName,
        zipCode: result.zipCode,
        address: result.address,
        tel: result.tel,
        applicant: result.applicant,
        memo: result.memo,
      });
      for (const detail of result.details) {
        transaction.update(orderDetailsRef.doc(detail.id), {
          orderQuantity: detail.orderQuantity,
          quantity:
            order.status === "pending" ? detail.orderQuantity : detail.quantity,
          salePrice: detail.salePrice,
          inseam: detail.inseam || null,
        });
      }
    });
  } catch (e: unknown) {
    return {
      status: "error",
      message: e instanceof Error ? e.message : "更新が失敗しました"
    };
  }
  return {
    status: "success",
    message: "更新に成功しました",
  };
}
