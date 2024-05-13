"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import React, { useEffect, useState } from "react";
import ProductShowTable from "./product-show-table";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase/client";
import { Product } from "@/types";
import { ArrowLeft, ChevronLeft, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";
import ProductEdit from "./product-edit";
import Loading from "../../loading";

interface Props {
  id: string;
}

export default function ProductShow({ id  }: Props) {
  const [product, setProduct] = useState<Product>();
  const router = useRouter();

  const handlePageBack = () => {
    router.back();
  };

  useEffect(() => {
    const productRef = doc(db, "products", id);
    const unsub = onSnapshot(productRef, {
      next: (snapshot) => {
        setProduct({ ...snapshot.data(), id } as Product);
      },
      error: (e) => {
        console.log(e);
      },
    });
    return () => {
      unsub();
    };
  }, [id]);

  if (!product) return <Loading />;

  return (
    <Card className="w-full md:w-[750px]">
      <CardHeader>
        <div className="flex justify-between mb-4">
          <ArrowLeft className="cursor-pointer" onClick={handlePageBack} />
          <span className="flex gap-3 ml-auto">
            <ChevronLeft className="cursor-pointer" />
            <ChevronRight className="cursor-pointer" />
          </span>
        </div>
        <CardTitle>詳細</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-1">
          <div className="flex gap-3 text-sm">
            <div>表示名</div>
            <div>{product?.displayName}</div>
          </div>
          <div className="flex gap-3 text-sm">
            <div>品　番</div>
            <div>{product?.productNumber}</div>
          </div>
          <div className="flex gap-3 text-sm">
            <div>品　名</div>
            <div>{product?.productName}</div>
          </div>
        </div>
        <ProductEdit product={product} />
        <div className="mt-3">
          <ProductShowTable id={id} />
        </div>
      </CardContent>
    </Card>
  );
}
