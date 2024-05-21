"use server";
import { auth } from "@/auth";
import { db } from "@/lib/firebase/server";
import { CreateOrder, CreateOrderSchema, Sku } from "@/types";
import { DocumentReference, FieldValue } from "firebase-admin/firestore";

interface DataDetail {
  quantity: number;
  size: string;
  inseam?: number | undefined;
  skuRef: DocumentReference;
}

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
  const optionsRef = db.collection("options").doc("marking").collection("skus");
  const companyNameRef = optionsRef.doc("companyName");
  const initialNameRef = optionsRef.doc("initialName");
  const inseamRef = optionsRef.doc("inseamProcessing");

  try {
    await db.runTransaction(async (transaction) => {
      const serialDoc = await transaction.get(serialRef);

      let details: (Sku & DataDetail)[] = [];
      let skuItems = [];
      for (const sku of filterSkus) {
        const skusRef = db
          .collectionGroup("skus")
          .where("id", "==", sku.id)
          .orderBy("id", "asc")
          .orderBy("sortNum", "asc");

        const snapShot = await transaction.get(skusRef);
        const skuDoc = snapShot.docs[0].data() as Sku;
        const skuRef = db
          .collection("products")
          .doc(skuDoc.productId)
          .collection("skus")
          .doc(sku.id);

        skuItems.push({
          ref: skuRef,
          doc: skuDoc,
          sku,
        });
        const data = { ...skuDoc, ...sku, skuRef } as any;
        details.push(data);
      }

      for (const { ref, doc, sku } of skuItems) {
        transaction.update(ref, {
          orderQuantity: doc.orderQuantity + sku.quantity,
        });
      }

      // // 会社名刺繍
      // const companyMarkSum = details
      //   .filter((detail) => detail.isMark && result.data.companyName)
      //   .reduce((sum: number, detail) => sum + detail.quantity, 0);

      // if (companyMarkSum > 0) {
      //   const snapshot = await companyNameRef.get();
      //   details.push({
      //     ...(snapshot.data() as Sku),
      //     quantity: companyMarkSum,
      //     skuRef: companyNameRef,
      //   });
      // }

      // // イニシャル刺繍
      // const initialNameSum = details
      //   .filter((detail) => detail.isMark && result.data.initial)
      //   .reduce((sum: number, detail) => sum + detail.quantity, 0);

      // if (initialNameSum > 0) {
      //   const snapshot = await initialNameRef.get();
      //   details.push({
      //     ...(snapshot.data() as Sku),
      //     quantity: initialNameSum,
      //     skuRef: initialNameRef,
      //   });
      // }

      // // 裾上げ修理
      // const inseamSum = details
      //   .filter((detail) => detail.isInseam && detail.inseam)
      //   .reduce((sum, detail) => sum + detail.quantity, 0);

      // if (inseamSum > 0) {
      //   const snapshot = await inseamRef.get();
      //   details.push({
      //     ...(snapshot.data() as Sku),
      //     quantity: inseamSum,
      //     skuRef: inseamRef,
      //   });
      // }

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
      console.error(e);
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
