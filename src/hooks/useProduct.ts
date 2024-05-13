import { toast } from "@/components/ui/use-toast";
import { db } from "@/lib/firebase/client";
import {
  CreateProduct,
  CreateProductSchema,
  UpdateProduct,
  UpdateProductSchema,
  UpdateSku,
  UpdateSkuSchema,
} from "@/types";
import { format } from "date-fns";
import {
  collection,
  doc,
  getDoc,
  serverTimestamp,
  updateDoc,
  writeBatch,
} from "firebase/firestore";
import { useSession } from "next-auth/react";

export function useProduct() {
  const session = useSession();

  const createProduct = async (data: CreateProduct) => {
    const result = CreateProductSchema.safeParse({
      productNumber: data.productNumber,
      productName: data.productName,
      displayName: data.displayName,
      isInseam: data.isInseam,
      gender: data.gender,
      skus: data.skus,
    });

    try {
      if (!result.success) {
        throw new Error([result.error.formErrors.fieldErrors].join(","));
      }
      if (!session) {
        throw new Error("session error ログインしてください");
      }
      const batch = writeBatch(db);
      const productRef = doc(collection(db, "products"));
      batch.set(productRef, {
        id: productRef.id,
        productNumber: result.data.productNumber,
        productName: result.data.productName,
        displayName: result.data.displayName,
        isInseam: result.data.isInseam,
        gender: result.data.gender,
        sortNum: 0,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      data.skus.forEach((sku, idx) => {
        const docRef = doc(collection(db, "products", productRef.id, "skus"));
        batch.set(docRef, {
          id: docRef.id,
          size: sku.size,
          salePrice: sku.salePrice,
          costPrice: sku.costPrice,
          stock: sku.stock,
          parentId: productRef.id,
          parentRef: productRef,
          sortNum: idx + 1,

          productNumber: result.data.productNumber,
          productName: result.data.productName,
          displayName: result.data.displayName,
          isInseam: result.data.isInseam,
          gender: result.data.gender,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
      });
      await batch.commit();
      console.log("成功")
      toast({
        title: "登録しました",
        variant: "success",
        description: format(new Date(), "PPpp"),
      });
    } catch (e: any) {
      console.log(e.message);
      toast({
        title: e.message,
        variant: "destructive",
        description: format(new Date(), "PPpp"),
      });
      return "error"
    }
  };

  const updateProduct = async (data: UpdateProduct, productId: string) => {
    const result = UpdateProductSchema.safeParse({
      productNumber: data.productNumber,
      productName: data.productName,
      displayName: data.displayName,
      isInseam: data.isInseam,
      gender: data.gender,
    });

    try {
      if (!result.success) {
        throw new Error([result.error.formErrors.fieldErrors].join(","));
      }
      if (!session) {
        throw new Error("session error ログインしてください");
      }
      const productRef = doc(db, "products", productId);
      updateDoc(productRef, {
        ...result.data,
      });
      toast({
        title: "更新しました",
        variant: "success",
        description: format(new Date(), "PPpp"),
      });
    } catch (e: any) {
      console.log(e.message);
      toast({
        title: e.message,
        variant: "destructive",
        description: format(new Date(), "PPpp"),
      });
    }
  };

  const updateSku = async (
    data: UpdateSku,
    productId: string,
    skuId: string
  ) => {
    const result = UpdateSkuSchema.safeParse({
      size: data.size,
      salePrice: data.salePrice,
      costPrice: data.costPrice,
      stock: data.stock,
      orderQuantity: data.orderQuantity,
      sortNum: data.sortNum,
    });

    try {
      if (!result.success) {
        throw new Error([result.error.formErrors.fieldErrors].join(","));
      }
      if (!session) {
        throw new Error("session error ログインしてください");
      }
      const productRef = doc(db, "products", productId);
      const productDoc = await getDoc(productRef);
      const product = productDoc.data();
      const skuRef = doc(db, "products", productId, "skus", skuId);
      await updateDoc(skuRef, {
        ...product,
        id: skuRef.id,
        size: result.data.size,
        salePrice: result.data.salePrice,
        costPrice: result.data.costPrice,
        stock: result.data.stock,
        orderQuantity: result.data.orderQuantity,
        sortNum: result.data.sortNum,
      });
      toast({
        title: "更新しました",
        variant: "success",
        description: format(new Date(), "PPpp"),
      });
    } catch (e: any) {
      console.log(e.message);
      toast({
        title: e.message,
        variant: "destructive",
        description: format(new Date(), "PPpp"),
      });
    }
  };

  return {
    createProduct,
    updateProduct,
    updateSku,
  };
}
