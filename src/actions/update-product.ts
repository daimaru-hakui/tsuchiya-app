"use server";
import { auth } from "@/auth";
import { db } from "@/lib/firebase/server";
import paths from "@/paths";
import { UpdateProduct, UpdateProductSchema } from "@/types";
import { redirect } from "next/navigation";

export async function updateProduct(data: UpdateProduct, productId: string) {

  const result = UpdateProductSchema.safeParse({
    productNumber: data.productNumber,
    productName: data.productName,
    displayName: data.displayName,
    isInseam: data.isInseam,
    gender: data.gender
  });

  if (!result.success) {
    return {
      message: "error"
    };
  }

  const session = await auth();

  if (!session) {
    return {
      message: "no session"
    };
  }

  try {
    const productRef = db.collection("products").doc(productId);
    productRef.update({
      ...result.data
    });
  } catch (e: any) {
    console.log(e);
    return {
      message: e.message
    };
  }

  redirect(paths.productShow(productId));
}