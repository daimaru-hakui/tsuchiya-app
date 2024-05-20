import { toast } from "@/components/ui/use-toast";
import { db } from "@/lib/firebase/client";
import {
  CreateShipping,
  CreateShippingShema,
  OrderDetail,
  ShippingDetail,
  Sku,
} from "@/types";
import { format } from "date-fns";
import { FirebaseError } from "firebase/app";
import {
  DocumentData,
  DocumentReference,
  collection,
  collectionGroup,
  doc,
  getDocs,
  orderBy,
  query,
  runTransaction,
  serverTimestamp,
  where,
} from "firebase/firestore";
import { useSession } from "next-auth/react";

export function useShipping() {
  const session = useSession();

  const createShipping = async (data: CreateShipping, orderId: string) => {
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

    const serialRef = doc(db, "serialNumbers", "shippingNumber");
    const shippingRef = doc(collection(db, "shippings"));
    const orderRef = doc(db, "orders", orderId);

    await runTransaction(db, async (transaction) => {
      if (!result.success) {
        throw new Error([result.error.formErrors.fieldErrors].join(","));
      }
      if (!session) {
        throw new Error("session error ログインしてください");
      }

      const filterDetails = result.data.details.filter(
        (sku) => sku.id && sku.shippingQuantity > 0
      );

      if (filterDetails.length === 0) {
        throw new Error("数量を入力してください");
      }


      const serialDoc = await transaction.get(serialRef);

      let details: (ShippingDetail & { shippingNumber: number; })[] = [];
      let orderDetails: (OrderDetail & {
        orderDetailRef: DocumentReference<DocumentData, DocumentData>;
      } & { remainingQuantity: number; })[] = [];
      let skuItems = [];

      for (const detail of filterDetails) {
        const orderDetailRef = doc(orderRef, "orderDetails", detail.id);
        const orderDetailDoc = await transaction.get(orderDetailRef);

        orderDetails.push({
          ...orderDetailDoc.data(),
          orderDetailRef: orderDetailRef,
          // remainingQuantity: detail.remainingQuantity,
        } as OrderDetail & {
          remainingQuantity: number;
          orderDetailRef: DocumentReference<DocumentData, DocumentData>;
        });

        const skusRef = collectionGroup(db, "skus");
        const q = query(
          skusRef,
          where("id", "==", detail.skuId),
          orderBy("id", "asc"),
          orderBy("sortNum", "asc")
        );

        const skusSnap = await getDocs(q);
        const skuRef = skusSnap.docs[0].ref;
        const skuDoc = await transaction.get(skuRef);

        const data = {
          ...skuDoc.data(),
          skuRef,
        } as ShippingDetail & { shippingNumber: number; };

        skuItems.push({
          skuRef,
          doc: { ...(skuDoc.data() as Sku) },
          detail,
        });

        details.push(data);
      }

      const newCount = serialDoc.data()?.count + 1;
      transaction.update(serialRef, {
        count: newCount,
      });

      for (const { skuRef, doc, detail } of skuItems) {
        if (doc.stock < detail.shippingQuantity) {
          throw new Error("在庫がありません");
        }
        transaction.update(skuRef, {
          orderQuantity: doc.orderQuantity - detail.shippingQuantity,
          stock: doc.stock - detail.shippingQuantity,
        });
      }

      for (const { orderDetailRef, remainingQuantity } of orderDetails) {
        transaction.update(orderDetailRef, {
          quantity: remainingQuantity,
        });
      }

      transaction.set(shippingRef, {
        id: shippingRef.id,
        serialNumber: newCount,
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
        status: "pending",
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      for (const detail of details) {
        transaction.set(doc(collection(shippingRef, "shippingDetails")), {
          orderId: orderId,
          orderRef: orderRef,
          shippingId: shippingRef.id,
          shippingRef: shippingRef,
          serialNumber: newCount,
          skuId: detail.id,
          skuRef: detail.skuRef,
          productNumber: detail.productNumber,
          productName: detail.productName,
          salePrice: detail.salePrice || 0,
          costPrice: detail.costPrice || 0,
          size: detail.size,
          quantity: detail.shippingNumber || 0,
          inseam: detail.inseam || null,
          sortNum: detail.sortNum,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
      }
      toast({
        title: "登録しました",
        variant: "success",
        description: format(new Date(), "PPpp"),
      });
    }).catch((e: any) => {
      if (e instanceof (FirebaseError)) {
        console.error(e.message);
        toast({
          title: e.message,
          variant: "destructive",
          description: format(new Date(), "PPpp"),
        });
        return;
      }
      console.error(e.message);
      toast({
        title: e.message,
        variant: "destructive",
        description: format(new Date(), "PPpp"),
      });
      return;
    });
  };

  return {
    createShipping,
  };
}
