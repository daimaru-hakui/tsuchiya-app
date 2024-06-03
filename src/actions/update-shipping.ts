"use server";
import { auth } from "@/auth";
import { db } from "@/lib/firebase/server";
import { UpdateShipping, UpdateShippingSchema } from "@/types/shipping.type";
import { validateWithZodSchema } from "@/utils/schemas";
import { FieldValue } from "firebase-admin/firestore";

export async function updateShipping(
  data: UpdateShipping,
  shippingId: string
): Promise<{ status: string; message: string }> {
  try {
    const result = validateWithZodSchema(UpdateShippingSchema, data);

    const session = await auth();
    if (!session) {
      throw new Error("認証エラー");
    }

    const shippingRef = db.collection("shippings").doc(shippingId);
    await shippingRef.update({
      shippingDate: result.shippingDate.toString(),
      updatedAt: FieldValue.serverTimestamp(),
    });
    for (const detail of result.details) {
      const shippingDetailRef = db
        .collection("shippings")
        .doc(shippingId)
        .collection("shippingDetails")
        .doc(detail.id);
      await shippingDetailRef.update({
        salePrice: detail.salePrice,
        updatedAt: FieldValue.serverTimestamp(),
      });
    }
  } catch (e: unknown) {
    return {
      status: "error",
      message: e instanceof Error ? e.message : "登録が失敗しました",
    };
  }
  return {
    status: "success",
    message: "更新に成功しました",
  };
}
