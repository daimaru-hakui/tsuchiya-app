import { db } from "@/lib/firebase/server";
import { Product } from "@/types/product.type";
import { NextRequest, NextResponse } from "next/server";

export  async function GET(res:NextRequest) {
  const productsDoc = await db.collection("products").get();
  let products: Product[] = [];
  productsDoc.docs.forEach((doc) => {
    products.push({ ...doc.data() } as Product);
  });
  return NextResponse.json(products, { status: 201 });
}
