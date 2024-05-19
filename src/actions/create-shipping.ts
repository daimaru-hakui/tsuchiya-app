"use server";
import { auth } from "@/auth";
import { db } from "@/lib/firebase/server";
import { CreateShipping, CreateShippingShema, OrderDetail, Sku } from "@/types";
import {
  DocumentReference,
  FieldValue,
} from "firebase-admin/firestore";
import { collection } from "firebase/firestore";

export async function createShipping(
  data: CreateShipping,
  orderId: string
): Promise<{ status: string; message: string; }> {
  const result = CreateShippingShema.safeParse({
    orderId: orderId,
    orderNumber: data.orderNumber,
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
    shippingDate: data.shippingDate,
    shippingCharge: data.shippingCharge,
    nemo: data.memo || "",
  });

  if (!result.success) {
    console.log(result.error);
    return {
      status: "error",
      message: result.error.flatten().formErrors.join(),
    };
  }

  const session = await auth();
  if (!session) {
    return {
      status: "error",
      message: "認証エラー",
    };
  }

  const filterDetails = result.data.details.filter(
    (detail) => detail.shippingQuantity > 0
  ).map((detail, idx) => ({ ...detail, sortNum: idx + 1 }));

  if (filterDetails.length === 0) {
    return {
      status: "error",
      message: "出荷数量を入力してください",
    };
  }

  const serialRef = db.collection("serialNumbers").doc("shippingNumber");
  const shippingRef = db.collection("shippings").doc();
  const orderRef = db.collection("orders").doc(orderId);

  let details: ({
    id: string;
    skuId: string;
    skuRef: DocumentReference;
    quantity: number;
    shippingQuantity: number;
    // remainingQuantity: number;
    inseam?: number | undefined;
  } & Sku)[] = [];

  let orderDetails: (OrderDetail & {
    orderDetailRef: DocumentReference;
    shippingQuantity: number;
  })[] = [];

  let skus = [];

  try {
    await db.runTransaction(async (transaction) => {
      const serialDoc = await transaction.get(serialRef);
      const orderDoc = await transaction.get(orderRef);

      for (const detail of filterDetails) {
        const orderDetailRef = orderRef
          .collection("orderDetails")
          .doc(detail.id);
        const orderDetailDoc = await transaction.get(orderDetailRef);

        orderDetails.push({
          ...orderDetailDoc.data(),
          orderDetailRef: orderDetailDoc.ref,
          shippingQuantity: detail.shippingQuantity
        } as OrderDetail & {
          orderDetailRef: DocumentReference;
          shippingQuantity: number;
        });

        const skusRef = db
          .collectionGroup("skus")
          .where("id", "==", detail.skuId)
          .orderBy("id", "asc")
          .orderBy("sortNum", "asc");

        const skuDocs = await transaction.get(skusRef);

        const skuDoc = skuDocs.docs[0].data() as Sku;
        const skuRef = skuDocs.docs[0].ref;

        const detailData = {
          skuRef,
          ...skuDoc,
          ...detail,
        };

        const skusData = {
          skuRef,
          ...skuDoc,
          ...detail,
        };

        details.push(detailData);
        skus.push(skusData);
      }

      const totalQuantity = orderDetails.reduce((sum, detail) => {
        sum = sum + detail.quantity || 0;
        return sum;
      }, 0);

      const totalShippingQuantity = orderDetails.reduce((sum, detail) => {
        sum = sum + detail.shippingQuantity || 0;
        return sum;
      }, 0);

      const status = totalQuantity === totalShippingQuantity ? "finished" : "openOrder";
      transaction.update(orderRef, {
        status
      });

      const newCount = serialDoc.data()?.count + 1;
      transaction.update(serialRef, {
        count: newCount,
      });

      let stocks = [];
      for (const sku of skus) {
        if (sku.stock < sku.shippingQuantity) {
          stocks.push(`${sku.productNumber} 在庫がありません`);
        }
      }

      if (stocks.length > 0) {
        throw new Error(stocks.join("\n"));
      }

      for (const sku of skus) {
        transaction.update(sku.skuRef, {
          orderQuantity: sku.orderQuantity - sku.shippingQuantity,
          stock: sku.stock - sku.shippingQuantity,
        });
      }

      for (const { orderDetailRef, quantity, shippingQuantity } of orderDetails) {
        transaction.update(orderDetailRef, {
          quantity: quantity - shippingQuantity,
        });
      }

      transaction.set(shippingRef, {
        id: shippingRef.id,
        shippingNumber: newCount,
        invoiceNumber: "",
        orderNumber: result.data.orderNumber,
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
        status: "picking",
        shippingDate: result.data.shippingDate,
        createdAt: FieldValue.serverTimestamp(),
        updatedAt: FieldValue.serverTimestamp(),
      });

      for (const detail of details) {
        transaction.set(shippingRef.collection("shippingDetails").doc(), {
          shippingNumber: newCount,
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
      transaction.set(shippingRef.collection("shippingDetails").doc(), {
        serialNumber: newCount,
        shippingId: shippingRef.id,
        shippingRef: shippingRef,
        orderId: orderId,
        orderRef: orderRef,
        skuId: "",
        skuRef: "",
        productNumber: "93-",
        productName: "送料",
        salePrice: result.data.shippingCharge || 0,
        costPrice: 0,
        size: "",
        quantity: 1,
        inseam: null,
        sortNum: 1000,
        createdAt: FieldValue.serverTimestamp(),
        updatedAt: FieldValue.serverTimestamp(),
      });
    });
  } catch (e: unknown) {
    if (e instanceof Error) {
      console.error(e.message);
      return {
        status: "error",
        message: e.message || "エラーが発生しました",
      };
    } else {
      console.error(e);
      return {
        status: "error",
        message: "エラーが発生しました",
      };
    }
  }
  return {
    status: "success",
    message: "登録しました",
  };
}
