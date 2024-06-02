"use server";
import { auth } from "@/auth";
import { db } from "@/lib/firebase/server";
import { UpdateProduct, UpdateProductSchema } from "@/types/product.type";
import { validateWithZodSchema } from "@/utils/schemas";
import { FieldValue } from "firebase-admin/firestore";

export async function updateProduct(
  data: UpdateProduct,
  productId: string
): Promise<{ status: string; message: string; }> {

  try {
    const result = validateWithZodSchema(UpdateProductSchema, data);

    const session = await auth();
    if (!session) {
      throw new Error("認証エラー");
    }

    const productRef = db.collection("products").doc(productId);
    productRef.update({
      ...result,
      updatedAt: FieldValue.serverTimestamp(),
    });

    const skuDocs = await db
      .collectionGroup("skus")
      .orderBy("sortNum", "asc")
      .where("parentId", "==", productId)
      .get();

    for (const doc of skuDocs.docs) {
      await doc.ref.update({
        productNumber: data.productNumber,
        productName: data.productName,
        displayName: data.displayName,
        isInseam: data.isInseam,
        isMark: data.isMark,
        gender: data.gender,
        productId: productId,
        productRef: productRef,
        updatedAt: FieldValue.serverTimestamp(),
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
    message: "更新しました",
  };
}
