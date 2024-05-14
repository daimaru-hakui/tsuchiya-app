import { db } from "@/lib/firebase/server";
import OrderCreateForm from "./order-create-form";
import { Product, Sku } from "@/types";

export default async function OrderCreate() {

  const productsDoc = await db.collection("products").orderBy("sortNum", "asc").get();
  const dataProduct = productsDoc.docs
    .map(doc => ({ ...doc.data(), id: doc.id } as Product));
  const jsonProduct = JSON.stringify(dataProduct);
  const products = JSON.parse(jsonProduct);

  const skuDocs = await db.collectionGroup("skus").get();
  const data = skuDocs.docs.map(doc => ({ ...doc.data() } as Sku));
  const jsonData = JSON.stringify(data);
  const skus = JSON.parse(jsonData);

  console.log(skus);

  return (
    <div className="">
      <OrderCreateForm products={products} skus={skus} />
    </div>
  );
}
