"use client";
import React, { useEffect, useState } from "react";
import AdjustItem from "./adjust-item";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { db } from "@/lib/firebase/client";
import { Product } from "@/types";

export default function AdjustList() {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const productsRef = collection(db, "products");
    const q = query(productsRef, orderBy("sortNum", "asc"));
    const unsub = onSnapshot(q, {
      next: (snapshot) => {
        const data = snapshot.docs.map(
          (doc) => ({ ...doc.data(), id: doc.id } as Product)
        );
        setProducts(data);
      },
      error: (e) => {
        console.error(e);
      },
    });
    return () => unsub();
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-3 justify-center">
      {products.map((product) => (
        <AdjustItem key={product.id} product={product} />
      ))}
    </div>
  );
}
