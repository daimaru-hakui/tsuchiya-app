import { db } from "@/lib/firebase/client";
import { UpdateSku, UpdateSkuSchema } from "@/types";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useSession } from "next-auth/react";

export function useProduct(){
    const session = useSession();
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
    
        if (!result.success) {
          console.log(result.error.formErrors.fieldErrors);
          return {
            message: "zod error",
          };
        }
    
        if (!session) {
          console.log("no session");
          return {
            message: "session error",
          };
        }
    
        try {
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
        } catch (e) {
          console.log(e);
        }
      }
      
      return {
        updateSku
      }
}