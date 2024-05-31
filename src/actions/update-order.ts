"use server";
import { auth } from "@/auth";
import { db } from "@/lib/firebase/server";
import {
  Order,
  OrderDetail,
  UpdateOrder,
  UpdateOrderSchema,
} from "@/types/order.type";
import { FieldValue } from "firebase-admin/firestore";

export async function updateOrder(
  data: UpdateOrder
): Promise<{ status: string; message: string }> {
  const result = UpdateOrderSchema.safeParse({
    orderId: data.orderId,
    section: data.section,
    employeeCode: data.employeeCode,
    initial: data.initial,
    username: data.username,
    companyName: data.companyName,
    position: data.position,
    details: data.details,
    siteCode: data.siteCode,
    siteName: data.siteName,
    zipCode: data.zipCode,
    address: data.address,
    tel: data.tel,
    applicant: data.applicant,
    memo: data.memo,
  });

  if (!result.success) {
    console.log(result.error);
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
  const orderDetailsRef = db
    .collection("orders")
    .doc(result.data.orderId)
    .collection("orderDetails");
  try {
    await db.runTransaction(async (transaction) => {
      const orderSnap = await transaction.get(orderRef);
      const order = orderSnap.data() as Order;

      for (const detail of result.data.details) {
        const ref = orderDetailsRef.doc(detail.id);
        const orderDetailDoc = await transaction.get(ref);
        const orderDetail = orderDetailDoc.data() as OrderDetail;
        const skuRef = orderDetail.skuRef as any;

        transaction.update(skuRef, {
          orderQuantity: FieldValue.increment(
            detail.orderQuantity - orderDetail.orderQuantity
          ),
        });
      }

      transaction.update(orderRef, {
        orderId: result.data.orderId,
        section: result.data.section,
        employeeCode: result.data.employeeCode,
        initial: result.data.initial,
        username: result.data.username,
        companyName: result.data.companyName,
        position: result.data.position,
        details: result.data.details,
        siteCode: result.data.siteCode,
        siteName: result.data.siteName,
        zipCode: result.data.zipCode,
        address: result.data.address,
        tel: result.data.tel,
        applicant: result.data.applicant,
        memo: result.data.memo,
      });
      for (const detail of result.data.details) {
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
    if (e instanceof Error) {
      console.log(e.message);
      return {
        status: "error",
        message: e.message,
      };
    } else {
      console.log(e);
      return {
        status: "error",
        message: "更新に失敗しました",
      };
    }
  }

  return {
    status: "success",
    message: "更新に成功しました",
  };
}
