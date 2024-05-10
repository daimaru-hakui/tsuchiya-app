"use server";
import { auth } from "@/auth";
import { db } from "@/lib/firebase/server";
import { CreateOrder, CreateOrderSchema, Sku } from "@/types";
import { format } from "date-fns";

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

  let products: (Sku & {
    id: string;
    quantity: number;
    hem?: number;
  })[] = [];

  const filterProducts = result.data.products.filter(
    (product) => product.id && product.quantity >= 0
  );

  for (const product of  result.data.products) {
    const docSnap = await db
      .collectionGroup("skus")
      .where("id", "==", product.id)
      .orderBy("id", "asc")
      .orderBy("sortNum", "asc")
      .get();
    const data = { ...docSnap.docs[0]?.data(), ...product } as Sku & {
      id: string;
      quantity: number;
      hem?: number;
    };
    products.push(data);
  }

  console.log(products)

  const serialRef = db.collection("serialNumbers").doc("orderNumber");
  const orderRef = db.collection("orders").doc();
  await db.runTransaction(async (transaction) => {
    const [serialDoc, ordersDocs] = await Promise.all([
      serialRef.get(),
      orderRef.get(),
    ]);

    const newCount = serialDoc.data()?.count + 1;
    transaction.update(serialRef, {
      count: newCount,
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
      // createdAt: serverTimestamp(),
    });

    for (const product of products) {
      transaction.set(orderRef.collection("orderDetails").doc(), {
        orderId: orderRef.id,
        serialNumber: newCount,
        skuId: product.id,
        productNumber: product.productNumber || "",
        productName: product.productName || "",
        salePrice: product.salePrice || 0,
        costPrice: product.costPrice || 0,
        size: product.size || "",
        orderQuantity: product.quantity,
        createdAt: format(new Date(), "yyyy-MM-dd"),
        updatedAt: format(new Date(), "yyyy-MM-dd"),
      });
    }
  });

  return;
}
