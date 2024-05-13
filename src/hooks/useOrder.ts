import { toast } from "@/components/ui/use-toast";
import { db } from "@/lib/firebase/client";
import { CreateOrder, CreateOrderSchema, OrderDetail } from "@/types";
import { format } from "date-fns";
import {
  collection,
  collectionGroup,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  runTransaction,
  serverTimestamp,
  where,
} from "firebase/firestore";
import { useSession } from "next-auth/react";

export function useOrder() {
  const session = useSession();

  const createOrder = async (data: CreateOrder) => {
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
      tel: data.tel,
      nemo: data.memo || "",
    });

    const serialRef = doc(db, "serialNumbers", "orderNumber");
    const orderRef = doc(collection(db, "orders"));

    await runTransaction(db, async (transaction) => {
      if (!result.success) {
        throw new Error([result.error.formErrors.fieldErrors].join(","));
      }
      if (!session) {
        throw new Error("session error ログインしてください");
      }

      const filterSkus = result.data.skus
        .filter((sku) => sku.id && sku.quantity > 0)
        .map((sku, idx) => ({ ...sku, sortNum: idx + 1 }));

      if (filterSkus.length === 0) {
        throw new Error("数量を入力してください");
      }

      const [serialDoc, orderDoc] = await Promise.all([
        getDoc(serialRef),
        getDoc(orderRef),
      ]);

      let details: OrderDetail[] = [];
      let skuItems = [];

      for (const sku of filterSkus) {
        const collRef = collectionGroup(db, "skus");
        const q = query(
          collRef,
          where("id", "==", sku.id),
          orderBy("id", "asc"),
          orderBy("sortNum", "asc")
        );

        const skusSnap = await getDocs(q);
        const skuRef = skusSnap.docs[0].ref;
        const skuDoc = await transaction.get(skuRef);
        // const productId = snapShot.ref.parent.parent?.id;

        const data = {
          ...skuDoc.data(),
          ...sku,
          skuRef,
        } as OrderDetail;

        skuItems.push({
          ref: skuRef,
          doc: { ...skuDoc.data() },
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
        memo: result.data.memo || "",
        status: "pending",
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      for (const detail of details) {
        transaction.set(doc(collection(orderRef, "orderDetails")), {
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
      console.log(e.message);
      toast({
        title: e.message,
        variant: "destructive",
        description: format(new Date(), "PPpp"),
      });
      return "error";
    });
  };

  return {
    createOrder,
  };
}
