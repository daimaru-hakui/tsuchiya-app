import { db } from "@/lib/firebase/server";
import OrderCreateForm from "./order-create-form";
import { Product, Sku } from "@/types";

export default async function OrderCreate() {

  const productsDoc = await db.collection("products").orderBy("sortNum", "asc").get();
  const productsRes = productsDoc.docs
    .map(doc => ({ ...doc.data(), id: doc.id } as Product));
  const jsonProducts = JSON.stringify(productsRes);
  const products = JSON.parse(jsonProducts);

  const skuDocs = await db.collectionGroup("skus").get();
  const skusRes = skuDocs.docs.map(doc => ({ ...doc.data() } as Sku));
  const jsonSkus = JSON.stringify(skusRes);
  const skus = JSON.parse(jsonSkus);

  return (
    <div className="">
      <OrderCreateForm products={products} skus={skus} />
    </div>
  );
}
