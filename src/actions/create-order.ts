"use server";
import { auth } from "@/auth";
import { db } from "@/lib/firebase/server";
import { CreateOrder, CreateOrderSchema, OrderDetail } from "@/types";
import { FieldValue } from "firebase-admin/firestore";
import { revalidatePath } from "next/cache";

export async function createOrder(
  data: CreateOrder
): Promise<{ status: string; message: string }> {
  const result = CreateOrderSchema.safeParse({
    section: data.section,
    employeeCode: data.employeeCode,
    initial: data.initial,
    username: data.username,
    companyName: data.companyName,
    position: data.position,
    skus: data.skus,
    siteCode: data.siteCode,
    siteName: data.siteName,
    zipCode: data.zipCode,
    address: data.address,
    applicant: data.applicant,
    tel: data.tel,
    nemo: data.memo || "",
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

  const filterSkus = result.data.skus
    .filter((product) => product.id && product.quantity > 0)
    .map((sku, idx) => ({ ...sku, sortNum: idx + 1 }));

  if (filterSkus.length === 0) {
    return {
      status: "error",
      message: "数量を入力してください",
    };
  }

  const serialRef = db.collection("serialNumbers").doc("orderNumber");
  const orderRef = db.collection("orders").doc();

  try {
    await db.runTransaction(async (transaction) => {
      const serialDoc = await transaction.get(serialRef);

      let details: OrderDetail[] = [];
      let skuItems = [];
      for (const sku of filterSkus) {
        const collRef = db
          .collectionGroup("skus")
          .where("id", "==", sku.id)
          .orderBy("id", "asc")
          .orderBy("sortNum", "asc");

        const snapShot = await transaction.get(collRef);
        const skuDoc = snapShot.docs[0].data();
        const skuRef = db
          .collection("products")
          .doc(skuDoc.parentId)
          .collection("skus")
          .doc(sku.id);
        const data = { ...snapShot.docs[0]?.data(), ...sku, skuRef } as any;
        skuItems.push({
          ref: skuRef,
          doc: skuDoc,
          sku,
        });
        details.push(data);
      }

      for (const { ref, doc, sku } of skuItems) {
        transaction.update(ref, {
          orderQuantity: (await doc.orderQuantity) + sku.quantity,
        });
      }

      const newCount = serialDoc.data()?.count + 1;
      transaction.update(serialRef, {
        count: newCount,
      });

      transaction.set(orderRef, {
        id: orderRef.id,
        orderNumber: newCount,
        section: result.data.section,
        employeeCode: result.data.employeeCode,
        initial: result.data.initial,
        username: result.data.username,
        position: result.data.position,
        companyName: result.data.companyName,
        siteCode: result.data.siteCode,
        siteName: result.data.siteName,
        zipCode: result.data.zipCode,
        address: result.data.address,
        tel: result.data.tel,
        applicant: result.data.applicant,
        memo: result.data.memo || "",
        status: "pending",
        uid: session.user.uid,
        createdAt: FieldValue.serverTimestamp(),
        updatedAt: FieldValue.serverTimestamp(),
      });

      for (const detail of details) {
        transaction.set(orderRef.collection("orderDetails").doc(), {
          orderId: orderRef.id,
          orderRef: orderRef,
          serialNumber: newCount,
          skuId: detail.id,
          skuRef: detail.skuRef,
          productNumber: detail.productNumber,
          productName: detail.productName,
          salePrice: detail.salePrice || 0,
          costPrice: detail.costPrice || 0,
          size: detail.size,
          orderQuantity: detail.quantity,
          quantity: detail.quantity,
          inseam: detail.inseam || null,
          sortNum: detail.sortNum,
          uid: session.user.uid,
          createdAt: FieldValue.serverTimestamp(),
          updatedAt: FieldValue.serverTimestamp(),
        });
      }
    });
  } catch (e: unknown) {
    if (e instanceof Error) {
      console.error(e.message);
      return {
        status: "error",
        message: e.message,
      };
    } else {
      console.error(e)
      return {
        status: "error",
        message: "登録が失敗しました",
      };
    }
  }
  return {
    status: "success",
    message: "登録しました",
  };
}
