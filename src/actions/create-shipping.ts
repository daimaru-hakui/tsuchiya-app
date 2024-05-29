"use server";
import { auth } from "@/auth";
import { db } from "@/lib/firebase/server";
import { OrderDetail } from "@/types/order.type";
import { Sku } from "@/types/product.type";
import { CreateShipping, CreateShippingShema } from "@/types/shipping.type";
import { format } from "date-fns";
import { DocumentReference, FieldValue } from "firebase-admin/firestore";

interface DataDetail {
  id: string;
  orderDetailRef: DocumentReference;
  skuId: string;
  skuRef: DocumentReference;
  quantity: number;
  shippingQuantity: number;
  shippingStockQuantity: number;
  salePrice: number;
  inseam?: number | undefined;
  isStock: boolean;
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
    shippingDate: format(data.shippingDate, "yyyy-MM-dd"),
    shippingCharge: data.shippingCharge,
  });

  if (!result.success) {
    console.log(result.error);
    return {
      status: "error",
      message: result.error.flatten().formErrors.join(","),
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
    .filter(
      (detail) => detail.shippingQuantity + detail.shippingStockQuantity > 0
    )
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
    orderDetailId: string;
    orderDetailRef: DocumentReference;
    shippingQuantity: number;
    shippingStockQuantity: number;
  })[] = [];

  let skus = [];

  try {
    await db.runTransaction(async (transaction) => {
      const serialDoc = await transaction.get(serialRef);

      for (const detail of filterDetails) {
        const orderDetailRef = orderRef
          .collection("orderDetails")
          .doc(detail.id);

        const orderDetailSnap = await transaction.get(orderDetailRef);
        const orderDetail = { ...orderDetailSnap.data() } as OrderDetail;

        const skusRef = db
          .collectionGroup("skus")
          .where("id", "==", detail.skuId)
          .orderBy("id", "asc")
          .orderBy("sortNum", "asc");

        const skuDocs = await transaction.get(skusRef);
        const sku = skuDocs.docs[0].data() as Sku;
        const skuRef = skuDocs.docs[0].ref;

        if (detail.shippingQuantity > 0) {
          shippingDetails.push({
            skuRef,
            ...sku,
            ...detail,
            orderDetailRef: orderDetailRef,
            quantity: detail.shippingQuantity,
            isStock: false,
          });
        }

        skus.push({
          skuRef,
          ...sku,
          ...detail,
        });

        orderDetails.push({
          orderDetailId: orderDetail.id,
          orderDetailRef: orderDetailRef,
          skuId: orderDetail.skuId,
          skuRef: orderDetail.skuRef,
          productNumber: orderDetail.productNumber,
          productName: orderDetail.productName,
          size: orderDetail.size,
          quantity: orderDetail.quantity,
          inseam: orderDetail.inseam,
          sortNum: orderDetail.sortNum,
          shippingQuantity: detail.shippingQuantity,
          shippingStockQuantity: detail.shippingStockQuantity,
        } as Sku &
          OrderDetail & {
            skuRef: DocumentReference;
            orderDetailId: string;
            orderDetailRef: DocumentReference;
            shippingQuantity: number;
            shippingStockQuantity: number;
          });
      }

      const totalQuantity = orderDetails.reduce((sum, detail) => {
        sum = sum + detail.quantity || 0;
        return sum;
      }, 0);

      const totalShippingQuantity = orderDetails.reduce((sum, detail) => {
        sum = sum + detail.shippingQuantity || 0;
        return sum;
      }, 0);

      const totalShippingStockQuantity = orderDetails.reduce(
        (sum, detail) => sum + detail.shippingStockQuantity,
        0
      );

      // ステータス変更
      const status =
        totalQuantity === totalShippingQuantity + totalShippingStockQuantity
          ? "finished"
          : "openOrder";
      transaction.update(orderRef, {
        status,
      });

      // 在庫分
      const stockOrderDetails = orderDetails.filter(
        (detail) => detail.shippingStockQuantity > 0
      );

      stockOrderDetails.forEach(async (detail) => {
        shippingDetails.push({
          orderDetailId: detail.id,
          orderDetailRef: detail.orderDetailRef,
          productNumber: detail.productNumber,
          productName: detail.productName,
          size: detail.size,
          quantity: detail.shippingStockQuantity,
          salePrice: 0,
          inseam: detail.inseam,
          skuId: detail.skuId,
          skuRef: detail.skuRef,
          sortNum: detail.sortNum + 0.5,
          isStock: true,
        } as DataDetail & Sku & any);
      });

      // 会社名刺繍
      const topsSum = shippingDetails
        .filter((detail) => detail.isMark)
        .reduce((sum: number, detail) => sum + detail.shippingQuantity, 0);

      if (topsSum > 0) {
        const snapshot = await companyNameRef.get();
        shippingDetails.push({
          ...(snapshot.data() as Sku),
          quantity: topsSum,
          skuRef: companyNameRef,
          skuId: "",
        } as DataDetail & Sku);
      }

      // 転写シート代
      if (topsSum > 0) {
        const snapshot = await transferSheetRef.get();
        shippingDetails.push({
          ...(snapshot.data() as Sku),
          quantity: topsSum,
          skuRef: transferSheetRef,
          skuId: "",
        } as DataDetail & Sku);
      }

      // プレス代
      if (topsSum > 0) {
        const snapshot = await pressFeeRef.get();
        shippingDetails.push({
          ...(snapshot.data() as Sku),
          quantity: topsSum,
          skuRef: pressFeeRef,
          skuId: "",
        } as DataDetail & Sku);
      }

      // イニシャル刺繍
      const initialNameSum = shippingDetails
        .filter((detail) => detail.isMark && result.data.initial)
        .reduce((sum: number, detail) => sum + detail.shippingQuantity, 0);

      if (initialNameSum > 0) {
        const snapshot = await initialNameRef.get();
        shippingDetails.push({
          ...(snapshot.data() as Sku),
          quantity: initialNameSum,
          skuRef: initialNameRef,
          skuId: "",
        } as Sku & DataDetail);
      }

      // 裾上げ修理
      const inseamSum = result.data.details
        .filter((detail) => detail.inseam)
        .reduce(
          (sum, detail) =>
            sum + detail.shippingQuantity + detail.shippingStockQuantity,
          0
        );

      if (inseamSum > 0) {
        const snapshot = await inseamRef.get();
        shippingDetails.push({
          ...(snapshot.data() as Sku),
          quantity: inseamSum,
          skuRef: inseamRef,
          skuId: "",
        } as DataDetail & Sku);
      }

      // 送料
      const shippingSnap = await shippingFeeRef.get();
      shippingDetails.push({
        ...shippingSnap.data(),
        skuRef: shippingFeeRef,
        salePrice: result.data.shippingCharge || 0,
        costPrice: 0,
        quantity: 1,
        skuId: "",
      } as DataDetail & Sku);

      // 連番
      const newCount = serialDoc.data()?.count + 1;
      transaction.update(serialRef, {
        count: newCount,
      });

      //　在庫エラー
      let stockMessages = [];
      for (const sku of skus) {
        if (sku.stock < sku.shippingStockQuantity) {
          stockMessages.push(`${sku.productNumber} 在庫がありません`);
        }
      }

      if (stockMessages.length > 0) {
        throw new Error(stockMessages.join("\n"));
      }

      // 在庫引き落とし
      for (const sku of skus) {
        transaction.update(sku.skuRef, {
          // orderQuantity: sku.orderQuantity - sku.shippingQuantity,
          stock: sku.stock - sku.shippingStockQuantity,
        });
      }

      // 注文残の計算
      for (const {
        orderDetailRef,
        quantity,
        shippingStockQuantity,
        shippingQuantity,
      } of orderDetails) {
        if (quantity < shippingQuantity + shippingStockQuantity) {
          throw new Error("出荷数量が残数量を超過しています");
        }
        transaction.update(orderDetailRef, {
          quantity: quantity - (shippingQuantity + shippingStockQuantity),
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
          id: shippingRef.collection("shippingDetails").doc().id,
          shippingNumber: newCount,
          shippingId: shippingRef.id,
          shippingRef: shippingRef,
          orderId: orderId,
          orderRef: orderRef,
          orderDetailId: detail.id || null,
          orderDetailRef: detail.orderDetailRef || null,
          skuId: detail.id || "",
          skuRef: detail.skuRef,
          productNumber: detail.productNumber,
          productName: detail.productName,
          salePrice: detail.salePrice || 0,
          costPrice: detail.costPrice || 0,
          size: detail.size,
          quantity: detail.quantity || 0,
          inseam: detail.inseam || null,
          sortNum: detail.sortNum,
          isStock: detail.isStock || false,
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
