"use server";
import { auth } from "@/auth";
import { db } from "@/lib/firebase/server";
import { UpdateSku, UpdateSkuSchema } from "@/types/product.type";

export async function updateSku(
  data: UpdateSku,
  productId: string,
  skuId: string
): Promise<{ status: string; message: string }> {
  const result = UpdateSkuSchema.safeParse({
    size: data.size,
    salePrice: data.salePrice,
    costPrice: data.costPrice,
    stock: data.stock,
    orderQuantity: data.orderQuantity,
    sortNum: data.sortNum,
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

  const productDoc = await db.collection("products").doc(productId).get();
  const product = productDoc.data();

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
      orderQuantity:result.data.orderQuantity,
      sortNum: result.data.sortNum,
    });
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
