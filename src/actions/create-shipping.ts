"use server";
import { auth } from "@/auth";
import { db } from "@/lib/firebase/server";
import { CreateShipping, CreateShippingShema, OrderDetail, Sku } from "@/types";
import { DocumentReference, FieldValue } from "firebase-admin/firestore";

interface DataDetail {
  id: string;
  skuId: string;
  quantity: number;
  shippingQuantity: number;
  salePrice: number;
  inseam?: number | undefined;
  skuRef: DocumentReference;
}

export async function createShipping(
  data: CreateShipping,
  orderId: string
): Promise<{ status: string; message: string }> {
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
    applicant: data.applicant,
    nemo: data.memo || "",
    shippingDate: data.shippingDate,
    shippingCharge: data.shippingCharge,
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

  const filterDetails = result.data.details
    .filter((detail) => detail.shippingQuantity > 0)
    .map((detail, idx) => ({ ...detail, sortNum: idx + 1 }));

  if (filterDetails.length === 0) {
    return {
      status: "error",
      message: "出荷数量を入力してください",
    };
  }

  const serialRef = db.collection("serialNumbers").doc("shippingNumber");
  const shippingRef = db.collection("shippings").doc();
  const orderRef = db.collection("orders").doc(orderId);
  const optionsRef = db.collection("options").doc("marking").collection("skus");
  const companyNameRef = optionsRef.doc("companyName");
  const initialNameRef = optionsRef.doc("initialName");
  const transferSheetRef = optionsRef.doc("transferSheet");
  const pressFeeRef = optionsRef.doc("pressFee");
  const inseamRef = optionsRef.doc("inseamProcessing");
  const shippingFeeRef = db
    .collection("options")
    .doc("delivery")
    .collection("skus")
    .doc("shippingFee");

  let shippingDetails: (Sku & DataDetail)[] = [];

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
          shippingQuantity: detail.shippingQuantity,
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

        const shippingDetailData = {
          skuRef,
          ...skuDoc,
          ...detail,
        };

        const skusData = {
          skuRef,
          ...skuDoc,
          ...detail,
        };

        shippingDetails.push(shippingDetailData);
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

      const status =
        totalQuantity === totalShippingQuantity ? "finished" : "openOrder";
      transaction.update(orderRef, {
        status,
      });

      // 会社名刺繍
      const topsSum = shippingDetails
        .filter((detail) => detail.isMark)
        .reduce((sum: number, detail) => sum + detail.quantity, 0);

      if (topsSum > 0) {
        const snapshot = await companyNameRef.get();
        shippingDetails.push({
          ...(snapshot.data() as Sku),
          quantity: topsSum,
          skuRef: companyNameRef,
          skuId: snapshot.id,
        } as DataDetail & Sku);
      }

      // 転写シート代
      if (topsSum > 0) {
        const snapshot = await transferSheetRef.get();
        shippingDetails.push({
          ...(snapshot.data() as Sku),
          quantity: topsSum,
          skuRef: transferSheetRef,
          skuId: snapshot.id,
        } as DataDetail & Sku);
      }

      // プレス代
      if (topsSum > 0) {
        const snapshot = await pressFeeRef.get();
        shippingDetails.push({
          ...(snapshot.data() as Sku),
          quantity: topsSum,
          skuRef: pressFeeRef,
          skuId: snapshot.id,
        } as DataDetail & Sku);
      }

      // イニシャル刺繍
      const initialNameSum = shippingDetails
        .filter((detail) => detail.isMark && result.data.initial)
        .reduce((sum: number, detail) => sum + detail.quantity, 0);

      if (initialNameSum > 0) {
        const snapshot = await initialNameRef.get();
        shippingDetails.push({
          ...(snapshot.data() as Sku),
          quantity: initialNameSum,
          skuRef: initialNameRef,
          skuId: snapshot.id,
        } as Sku & DataDetail);
      }

      // 裾上げ修理
      const inseamSum = shippingDetails
        .filter((detail) => detail.isInseam && detail.inseam)
        .reduce((sum, detail) => sum + detail.quantity, 0);

      if (inseamSum > 0) {
        const snapshot = await inseamRef.get();
        shippingDetails.push({
          ...(snapshot.data() as Sku),
          quantity: inseamSum,
          skuRef: inseamRef,
          skuId: snapshot.id,
        } as DataDetail & Sku);
      }

      const shippingSnap = await shippingFeeRef.get();
      shippingDetails.push({
        ...shippingSnap.data(),
        skuRef: shippingFeeRef,
        salePrice: result.data.shippingCharge || 0,
        costPrice: 0,
        quantity: 1,
      } as DataDetail & Sku);

      // 連番
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

      for (const {
        orderDetailRef,
        quantity,
        shippingQuantity,
      } of orderDetails) {
        transaction.update(orderDetailRef, {
          quantity: quantity - shippingQuantity,
        });
      }

      transaction.set(shippingRef, {
        id: shippingRef.id,
        shippingNumber: newCount,
        trackingNumber: "",
        courier: "",
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

      for (const detail of shippingDetails) {
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
          shippingDate: result.data.shippingDate,
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
