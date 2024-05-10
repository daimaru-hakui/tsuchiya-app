"use server";

import { auth } from "@/auth";
import { db } from "@/lib/firebase/server";
import paths from "@/paths";
import { CreateProduct, CreateProductSchema } from "@/types";
import { redirect } from "next/navigation";

export async function createProduct(data: CreateProduct):
  Promise<{ message: string | undefined; }> {

  const result = CreateProductSchema.safeParse({
    productNumber: data.productNumber,
    productName: data.productName,
    displayName: data.displayName,
    isHem: data.isHem,
    gender: data.gender,
    skus: data.skus
  });

  if (!result.success) {
    console.log(result.error);
    return {
      message: "バリデーション エラー"
    };
  }

  const session = await auth();
  if (!session) {
    console.log("no session");
    return {
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
      isHem: result.data.isHem,
      gender: result.data.gender,
      sortNum: 0,
      // createdAt: serverTimestamp(),
      // updatedAt: serverTimestamp(),
    });
    data.skus.forEach((sku, idx) => {
      const docRef = db.collection("products").doc(productRef.id).collection("skus").doc();
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
        isHem: result.data.isHem,
        gender: result.data.gender,
        // createdAt: serverTimestamp(),
        // updatedAt: serverTimestamp(),
      });
    });
    await batch.commit();
  } catch (e) {
    console.log(e);
    return {
      message: "error"
    };
  }
  redirect(paths.productNew());
}