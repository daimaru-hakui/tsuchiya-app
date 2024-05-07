import OrderCreateForm from "./order-create-form";
import { db } from "@/lib/firebase/server";
import { Product } from "@/types";

const getProducts = async () => {
  // let products: Product[] = [];
  try {
    const productsRef = db.collection("products");
    const productsSnap = await productsRef.orderBy("sortNum", "asc").get();
    const products = productsSnap.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    } as Product));
    return products;
  } catch (e) {
    console.log(e);
  }
};

export default async function OrderCreate() {
  const products = await getProducts();

  if (!products) return;

  return (
    <div className="">
      <OrderCreateForm products={products} />
    </div>
  );
}
