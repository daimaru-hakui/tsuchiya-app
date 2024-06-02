"use server";
import { auth } from "@/auth";
import { db } from "@/lib/firebase/server";
import { CreateProduct, CreateProductSchema } from "@/types/product.type";
import { validateWithZodSchema } from "@/utils/schemas";
import { FieldValue } from "firebase-admin/firestore";

export async function createProduct(data: CreateProduct):
  Promise<{ status: string, message: string; }> {
  try {
    const result = validateWithZodSchema(CreateProductSchema, data);

    const session = await auth();
    if (!session) {
      throw new Error("認証エラー");
    }

    const batch = db.batch();
    const productRef = db.collection("products").doc();
    batch.set(productRef, {
      id: productRef.id,
      productNumber: result.productNumber,
      productName: result.productName,
      displayName: result.displayName,
      isInseam: result.isInseam,
      isMark: result.isMark,
      gender: result.gender,
      sortNum: 0,
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    });
    data.skus.forEach((sku, idx) => {
      const docRef = db.collection("products")
        .doc(productRef.id).collection("skus").doc();
      batch.set(docRef, {
        id: docRef.id,
        size: sku.size,
        salePrice: sku.salePrice,
        costPrice: sku.costPrice,
        stock: sku.stock,
        parentId: productRef.id,
        parentRef: productRef,
        sortNum: idx + 1,

        productNumber: result.productNumber,
        productName: result.productName,
        displayName: result.displayName,
        isInseam: result.isInseam,
        isMark: result.isMark,
        gender: result.gender,
        createdAt: FieldValue.serverTimestamp(),
        updatedAt: FieldValue.serverTimestamp(),
      });
    });
    await batch.commit();
  } catch (e: unknown) {
    return {
      status: "error",
      message: e instanceof Error ? e.message : "登録が失敗しました"
    };
  }
  return {
    status: "success",
    message: "登録しました"
  };
}