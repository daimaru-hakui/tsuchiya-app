"use server";

import { auth } from "@/auth";
import { db } from "@/lib/firebase/server";
import paths from "@/paths";
import { UpdateSku, UpdateSkuSchema } from "@/types";
import { redirect } from "next/navigation";

export async function updateSku(
  data: UpdateSku,
  productId: string,
  skuId: string
): Promise<{ message: string | undefined; }> {
  console.log(data)
  const result = UpdateSkuSchema.safeParse({
    size: data.size,
    salePrice: data.salePrice,
    costPrice: data.costPrice,
    stock: data.stock,
    orderQuantity: data.orderQuantity,
    sortNum: data.sortNum,
  });

  if (!result.success) {
    console.log(result.error.formErrors.fieldErrors);
    return {
      message: "zod error",
    };
  }

  const session = await auth();
  if (!session) {
    console.log("no session");
    return {
      message: "session error",
    };
  }

  const productDoc = await db.collection("products").doc(productId).get();
  const product = productDoc.data();

  console.log(product);
  console.log(skuId);

  try {
    const skuRef = db
      .collection("products")
      .doc(productId)
      .collection("skus")
      .doc(skuId);
    await skuRef.update({
      ...product,
      id: skuRef.id,
      size: result.data.size,
      salePrice: result.data.salePrice,
      costPrice: result.data.costPrice,
      stock: result.data.stock,
      orderQuantity: result.data.orderQuantity,
      sortNum: result.data.sortNum,
    });
  } catch (e: any) {
    console.error(e);
    return {
      message: e.message,
    };
  }
  redirect(paths.productShow(productId));
}
