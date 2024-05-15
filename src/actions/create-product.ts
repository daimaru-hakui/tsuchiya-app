"use server";
import { auth } from "@/auth";
import { db } from "@/lib/firebase/server";
import { CreateProduct, CreateProductSchema } from "@/types";
import { FieldValue } from "firebase-admin/firestore";

export async function createProduct(data: CreateProduct):
  Promise<{ status: string, message: string; }> {

  const result = CreateProductSchema.safeParse({
    productNumber: data.productNumber,
    productName: data.productName,
    displayName: data.displayName,
    isInseam: data.isInseam,
    isMark: data.isMark,
    gender: data.gender,
    skus: data.skus
  });

  if (!result.success) {
    console.log(result.error);
    return {
      status: "error",
      message: "バリデーション エラー"
    };
  }

  const session = await auth();
  if (!session) {
    console.log("no session");
    return {
      status: "error",
      message: "認証エラー"
    };
  }

  try {
    const batch = db.batch();
    const productRef = db.collection("products").doc();
    batch.set(productRef, {
      id: productRef.id,
      productNumber: result.data.productNumber,
      productName: result.data.productName,
      displayName: result.data.displayName,
      isInseam: result.data.isInseam,
      isMark: result.data.isMark,
      gender: result.data.gender,
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

        productNumber: result.data.productNumber,
        productName: result.data.productName,
        displayName: result.data.displayName,
        isInseam: result.data.isInseam,
        isMark: result.data.isMark,
        gender: result.data.gender,
        createdAt: FieldValue.serverTimestamp(),
        updatedAt: FieldValue.serverTimestamp(),
      });
    });
    await batch.commit();
  } catch (e: unknown) {
    if (e instanceof Error) {
      console.log(e.message);
      return {
        status: "error",
        message: e.message
      };
    } else {
      return {
        status: "error",
        message: "登録が失敗しました"
      };
    }
  }
  return {
    status: "success",
    message: "登録しました"
  };
}