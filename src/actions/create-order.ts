"use server";
import { auth } from "@/auth";
import { db } from "@/lib/firebase/server";
import { CreateOrder, CreateOrderSchema } from "@/types";
import { FieldValue } from "firebase-admin/firestore";
import { serverTimestamp } from "firebase/firestore";

export async function createOrder(
  data: CreateOrder
): Promise<string | undefined> {
  const result = CreateOrderSchema.safeParse({
    section: data.section,
    employeeCode: data.employeeCode,
    initial: data.initial,
    username: data.username,
    position: data.position,
    products: data.products,
    siteCode: data.siteCode,
    siteName: data.siteName,
    zipCode: data.zipCode,
    address: data.address,
    tel: data.tel,
  });

  if (!result.success) {
    return "error";
  }

  const session = await auth();

  if (!session) {
    return "error";
  }

  const seralRef = db.collection("serialNumbers").doc("orderNumber");
  const ordersRef = db.collection("orders")
  await db.runTransaction(async (transaction) => {
    seralRef.update("id", FieldValue.increment(1));
    
   
     transaction.set(seralRef, {
      section: result.data.section,
      employeeCode: result.data.employeeCode,
      initial: result.data.initial,
      username: result.data.username,
      position: result.data.position,
      siteCode: result.data.siteCode,
      siteName: result.data.siteName,
      zipCode: result.data.zipCode,
      address: result.data.address,
      tel: result.data.tel,
      createdAt: serverTimestamp(),
    });
  });

  return;
}
