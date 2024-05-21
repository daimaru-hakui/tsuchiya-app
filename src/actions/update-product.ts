"use server";
import { auth } from "@/auth";
import { db } from "@/lib/firebase/server";
import { UpdateProduct, UpdateProductSchema } from "@/types";
import { FieldValue } from "firebase-admin/firestore";

export async function updateProduct(
  data: UpdateProduct,
  productId: string
): Promise<{ status: string; message: string }> {
  const result = UpdateProductSchema.safeParse({
    productNumber: data.productNumber,
    productName: data.productName,
    displayName: data.displayName,
    isInseam: data.isInseam,
    isMark: data.isMark,
    gender: data.gender,
  });

  if (!result.success) {
    console.log(result.error.flatten().formErrors.join(","));
    return {
      status: "error",
      message: result.error.flatten().formErrors.join(","),
    };
  }

  const session = await auth();
  if (!session) {
    console.log("no session");
    return {
      status: "error",
      message: "認証エラー",
    };
  }

  try {
    const productRef = db.collection("products").doc(productId);
    productRef.update({
      ...result.data,
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
    if (e instanceof Error) {
      console.error(e.message);
      return {
        status: "error",
        message: e.message,
      };
    } else {
      return {
        status: "error",
        message: "更新が失敗しました",
      };
    }
  }
  return {
    status: "success",
    message: "更新しました",
  };
}
