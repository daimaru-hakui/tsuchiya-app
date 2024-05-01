import OrderCreateForm from "./order-create-form";
import { db } from "@/lib/firebase/server";
import { Product } from "@/types";

export default async function OrderCreate() {
  const getProducts = async () => {
    let products: Product[] = [];
    try {
      const productsRef = db.collection("products");
      const productsSnap = await productsRef.orderBy("order", "asc").get();
      productsSnap.docs.forEach(async (doc) => {
        products.push({ id: doc.id, ...doc.data() } as Product);
      });
      return products;
    } catch (e) {
      console.log(e);
    }
  };

  const products = await getProducts();

  if (!products) return;

  return (
    <div className="w-full flex items-center justify-center mb-6">
      <OrderCreateForm products={products} />
    </div>
  );
}
