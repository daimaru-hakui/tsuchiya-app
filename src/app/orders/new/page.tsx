import { db } from "@/lib/firebase/server";
import OrderCreateForm from "./order-create-form";
import { Product, Sku } from "@/types/product.type";

export default async function OrderCreate() {
  const [productDocs, skuDocs] = await Promise.all([
    await db.collection("products").orderBy("sortNum", "asc").get(),
    await db.collectionGroup("skus").get(),
  ]);

  const productsRes = productDocs.docs.map(
    (doc) => ({ ...doc.data(), id: doc.id } as Product)
  );
  const jsonProducts = JSON.stringify(productsRes);
  const products = JSON.parse(jsonProducts);

  const skusRes = skuDocs.docs
    .map((doc) => ({ ...doc.data() } as Sku))
    .sort((a, b) => a.sortNum - b.sortNum);
  const jsonSkus = JSON.stringify(skusRes);
  const skus = JSON.parse(jsonSkus);

  return (
    <div className="">
      <OrderCreateForm products={products} skus={skus} />
    </div>
  );
}
