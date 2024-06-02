"use server";
import { auth } from "@/auth";
import { db } from "@/lib/firebase/server";
import { UpdateShipping, UpdateShippingSchema } from "@/types/shipping.type";

export async function updateShipping(
  data: UpdateShipping,
  shippingId: string
): Promise<{ status: string; message: string; }> {
  const result = UpdateShippingSchema.safeParse({
    details: data.details,
    shippingDate: data.shippingDate,
  });

  console.log(result.data);

  if (!result.success) {
    console.log(result.error);
    return {
      status: "error",
      message: result.error.message,
    };
  }

  const session = await auth();
  if (!session) {
    console.log("認証エラー");
    return {
      status: "error",
      message: "認証に失敗しました",
    };
  }

  try {
    const shippingRef = db.collection("shippings").doc(shippingId);
    await shippingRef.update({
      shippingDate: result.data.shippingDate.toString(),
    });
    for (const detail of result.data.details) {
      const shippingDetailRef = db
        .collection("shippings")
        .doc(shippingId)
        .collection("shippingDetails")
        .doc(detail.id);
      await shippingDetailRef.update({
        salePrice: detail.salePrice,
      });
    }
  } catch (e: unknown) {
    return {
      status: "error",
      message: e instanceof Error ? e.message : "登録が失敗しました"
    };
  }

  return {
    status: "success",
    message: "更新に成功しました",
  };
}
