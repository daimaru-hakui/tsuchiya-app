import React from "react";
import ProductShow from "./product-show";
import { db } from "@/lib/firebase/server";

interface Props {
  params: {
    id: string;
  };
}

export default async function ProductShowPage({ params }: Props) {
  const snapShot = await db.collection("products").doc(params.id).get();
  let product = JSON.stringify(snapShot.data());
  product = JSON.parse(product) 
  if(!product) return
  console.log(product);

  return (
    <div className="w-full flex items-center justify-center py-4">
      <ProductShow id={params.id} productServer={product} />
    </div>
  );
}
