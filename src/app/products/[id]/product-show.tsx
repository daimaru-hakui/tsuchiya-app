"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import React, { useEffect, useState } from "react";
import ProductShowTable from "./product-show-table";
import {
  collection,
  doc,
  limit,
  onSnapshot,
  orderBy,
  query,
  startAfter,
  where,
} from "firebase/firestore";
import { db } from "@/lib/firebase/client";
import { ArrowLeft, ChevronLeft, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";
import ProductEdit from "./product-edit";
import Loading from "../../loading";
import { cn } from "@/lib/utils";
import paths from "@/utils/paths";
import Link from "next/link";
import useFunctons from "@/hooks/useFunctons";
import { Product } from "@/types/product.type";

interface Props {
  id: string;
}

export default function ProductShow({ id }: Props) {
  const [product, setProduct] = useState<Product>();
  const router = useRouter();
  const [nextPage, setNextPage] = useState<string | null>(null);
  const [prevPage, setPrevPage] = useState<string | null>(null);
  const { getGender } = useFunctons();

  // const handlePageBack = () => {
  //   router.back();
  // };

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

  useEffect(() => {
    if (!product?.sortNum) return;
    const productRef = collection(db, "products");
    const q = query(
      productRef,
      orderBy("sortNum", "asc"),
      startAfter(product?.sortNum),
      limit(1)
    );
    const unsub = onSnapshot(q, {
      next: (snapshot) => {
        snapshot.docs.at(0)?.exists()
          ? setNextPage(snapshot.docs.at(0)?.id as string)
          : setNextPage(null);
      },
      error: (e) => {
        console.error(e);
      },
    });
    return () => unsub();
  }, [product?.sortNum]);

  useEffect(() => {
    if (!product?.sortNum) return;
    const productRef = collection(db, "products");
    const q = query(
      productRef,
      orderBy("sortNum", "desc"),
      startAfter(product.sortNum),
      limit(1)
    );
    const unsub = onSnapshot(q, {
      next: (snapshot) => {
        snapshot.docs.at(0)?.exists()
          ? setPrevPage(snapshot.docs.at(0)?.id as string)
          : setPrevPage(null);
      },
      error: (e) => {
        console.error(e);
      },
    });
    return () => unsub();
  }, [product?.sortNum]);

  if (!product) return <Loading />;

  return (
    <Card className="w-full md:w-[750px]">
      <CardHeader>
        <div className="flex justify-between mb-4">
          <Link href={paths.productAll()}>
            <ArrowLeft className="cursor-pointer" />
          </Link>
          <span className="flex items-center gap-4 ml-auto">
            <ProductEdit product={product} />
            <ChevronLeft
              className={cn("cursor-pointer", !prevPage && "opacity-35")}
              onClick={() =>
                prevPage && router.push(paths.productShow(prevPage))
              }
            />
            <ChevronRight
              className={cn("cursor-pointer", !nextPage && "opacity-35")}
              onClick={() =>
                nextPage && router.push(paths.productShow(nextPage))
              }
            />
          </span>
        </div>
        <CardTitle>商品詳細</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-2">
          <div>
            <dl className={cn(dlStyles)}>
              <dt className={cn(dtStyles)}>品番</dt>
              <dd>{product.productNumber}</dd>
            </dl>
            <dl className={cn(dlStyles)}>
              <dt className={cn(dtStyles)}>品名</dt>
              <dd>{product.productName}</dd>
            </dl>
            <dl className={cn(dlStyles)}>
              <dt className={cn(dtStyles)}>表示名</dt>
              <dd>{product.displayName}</dd>
            </dl>
          </div>
          <div>
            <dl className={cn(dlStyles)}>
              <dt className={cn(dtStyles)}>裾上</dt>
              <dd>{product.isInseam ? "あり" : "-"}</dd>
            </dl>
            <dl className={cn(dlStyles)}>
              <dt className={cn(dtStyles)}>刺繍</dt>
              <dd>{product.isMark ? "あり" : "-"}</dd>
            </dl>
            <dl className={cn(dlStyles)}>
              <dt className={cn(dtStyles)}>性別</dt>
              <dd>{getGender(product.gender)}</dd>
            </dl>
          </div>
        </div>

        <div className="mt-3">
          <ProductShowTable id={id} />
        </div>
      </CardContent>
    </Card>
  );
}

const dlStyles = "grid grid-cols-[100px_1fr] text-sm leading-7 px-4";
const dtStyles = "text-zinc-500 font-bold";
