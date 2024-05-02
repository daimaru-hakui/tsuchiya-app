"use server";
import { auth } from "@/auth";
import { db } from "@/lib/firebase/server";
import { CreateOrder, CreateOrderSchema } from "@/types";

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

  const serialRef = db.collection("serialNumbers").doc("orderNumber");
  const orderRef = db.collection("orders").doc();
  await db.runTransaction(async (transaction) => {

    const [serialDoc, ordersDocs] = await Promise.all([
      serialRef.get(),
      orderRef.get()
    ]);

    const newCount = serialDoc.data()?.count + 1;
    console.log(newCount);
    transaction.update(serialRef, {
      count: newCount
    });

    transaction.set(orderRef, {
      id: orderRef.id,
      serialNumber: newCount,
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
      createdAt: ""
    });

    for (const product of result.data.products) {
      transaction.set(orderRef.collection('orderDetails').doc(), {
        id: product.id
      });
    }
  });

  return;
}
