"use server";
import { auth } from "@/auth";
import { db } from "@/lib/firebase/server";
import { CreateShipping, CreateShippingShema, OrderDetail, Sku } from "@/types";
import { DocumentData, DocumentReference, FieldValue } from "firebase-admin/firestore";

export async function createShipping(data: CreateShipping, orderId: string): Promise<{ status: string, message: string; }> {

  const result = CreateShippingShema.safeParse({
    orderId: orderId,
    section: data.section,
    employeeCode: data.employeeCode,
    initial: data.initial,
    username: data.username,
    companyName: data.companyName,
    position: data.position,
    details: data.details,
    siteCode: data.siteCode,
    siteName: data.siteName,
    zipCode: data.zipCode,
    address: data.address,
    tel: data.tel,
    nemo: data.memo || "",
  });

  if (!result.success) {
    return {
      status: "error",
      message: result.error.flatten().formErrors.join()
    };
  }

  const session = await auth();
  if (!session) {
    return {
      status: "error",
      message: "認証エラー"
    };
  }

  const filterDetails = result.data.details.filter(detail => (
    detail.shippingQuantity > 0
  ));

  if (filterDetails.length === 0) {
    return {
      status: "error",
      message: "出荷数量を入力してください"
    };
  }

  const serialRef = db.collection("serialNumbers").doc("shippingNumber");
  const shippingRef = db.collection("shippings").doc();
  const orderRef = db.collection("orders").doc(orderId);

  let details: ({
    id: string;
    skuId: string;
    skuRef: DocumentReference<DocumentData, DocumentData>;
    quantity: number;
    shippingQuantity: number;
    remainingQuantity: number;
    inseam?: number | undefined;
  } & Sku)[] = [];

  let orderDetails: (OrderDetail & {
    orderDetailRef:
    DocumentReference<DocumentData, DocumentData>;
    remainingQuantity: number;
  })[] = [];

  let skus = [];

  await db.runTransaction(async transaction => {
    const serialDoc = await transaction.get(serialRef);

    for (const detail of filterDetails) {
      const orderDetailRef = orderRef.collection("orderDetails").doc(detail.id);
      const orderDetailDoc = await transaction.get(orderDetailRef);

      orderDetails.push({
        ...orderDetailDoc.data(),
        orderDetailRef: orderDetailDoc.ref,
        remainingQuantity: detail.remainingQuantity
      } as OrderDetail & {
        orderDetailRef: DocumentReference<DocumentData, DocumentData>;
        remainingQuantity: number;
      });

      const skusRef = db.collectionGroup("skus")
        .where("id", "==", detail.skuId)
        .orderBy("id", "asc")
        .orderBy("sortNum", "asc");

      const skuDocs = await transaction.get(skusRef);

      const skuDoc = skuDocs.docs[0].data() as Sku;
      const skuRef = skuDocs.docs[0].ref;

      const data = {
        skuRef,
        ...skuDoc,
        ...detail
      };

      skus.push({
        skuRef,
        doc: skuDoc,
        detail
      });

      details.push(data);
    }

    const newCount = serialDoc.data()?.count + 1;
    transaction.update(serialRef, {
      count: newCount
    });

    for (const { skuRef, doc, detail } of skus) {
      if (doc.stock < detail.shippingQuantity) {
        return {
          status: "error",
          message: "在庫がありません"
        };
      }
      transaction.update(skuRef, {
        orderQuantity: doc.orderQuantity - detail.shippingQuantity,
        stock: doc.stock - detail.shippingQuantity
      });
    }

    for (const { orderDetailRef, remainingQuantity } of orderDetails) {
      transaction.update(orderDetailRef, {
        quantity: remainingQuantity
      });
    }

    transaction.set(shippingRef, {
      id: shippingRef.id,
      serialNumber: newCount,
      orderId: orderId,
      orderRef: orderRef,
      section: result.data.section,
      employeeCode: result.data.employeeCode,
      initial: result.data.initial,
      username: result.data.username,
      companyName: result.data.companyName,
      position: result.data.position,
      siteCode: result.data.siteCode,
      siteName: result.data.siteName,
      zipCode: result.data.zipCode,
      address: result.data.address,
      tel: result.data.tel,
      memo: result.data.memo || "",
      uid: session.user.uid,
      status: "",
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    });

    for (const detail of details) {
      transaction.set(shippingRef.collection("shippingDetails").doc(), {
        serialNumber: newCount,
        shippingId: shippingRef.id,
        shippingRef: shippingRef,
        orderId: orderId,
        orderRef: orderRef,
        skuId: detail.id,
        skuRef: detail.skuRef,
        productNumber: detail.productNumber,
        productName: detail.productName,
        salePrice: detail.salePrice || 0,
        costPrice: detail.costPrice || 0,
        size: detail.size,
        quantity: detail.quantity || 0,
        inseam: detail.inseam || null,
        sortNum: detail.sortNum,
        createdAt: FieldValue.serverTimestamp(),
        updatedAt: FieldValue.serverTimestamp(),
      });
    }

  }).catch((e: unknown) => {
    if (e instanceof Error) {
      console.error(e.message);
      return {
        status: "error",
        message: e.message
      };
    } else {
      console.error(e);
      return {
        status: "error",
        message: "エラーが発生しました"
      };
    }
  });

  return {
    status: "success",
    message: "登録しました"
  };
}