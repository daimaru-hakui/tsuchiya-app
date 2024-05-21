"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { db } from "@/lib/firebase/client";
import { Product } from "@/types";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import Link from "next/link";
import { useEffect, useState } from "react";
import Loading from "../loading";
import useFunctons from "@/hooks/useFunctons";

export default function ProductList() {
  const [products, setProducts] = useState<Product[]>();
  const { getGender } = useFunctons();

  useEffect(() => {
    const productsRef = collection(db, "products");
    const q = query(productsRef, orderBy("sortNum", "asc"));
    onSnapshot(q, (snapshot) => {
      setProducts(
        snapshot.docs.map(
          (doc) =>
            ({
              id: doc.id,
              ...doc.data(),
            } as Product)
        )
      );
    });
  }, []);

  if (!products) return <Loading />;

  return (
    <Card className="w-full overflow-auto">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>商品一覧</CardTitle>
          <Button size="sm" asChild>
            <Link href="/products/new">商品登録</Link>
          </Button>
        </div>
      </CardHeader>
      <CardContent className="overflow-auto">
        <Table className="min-w-[700px]">
          <TableHeader>
            <TableRow>
              <TableHead>詳細</TableHead>
              <TableHead>表示名</TableHead>
              <TableHead>品番</TableHead>
              <TableHead>品名</TableHead>
              <TableHead>区分</TableHead>
              <TableHead>刺繍</TableHead>
              <TableHead>裾上げ</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product.id}>
                <TableCell>
                  <Button size="xs" asChild>
                    <Link href={`/products/${product.id}`}>詳細</Link>
                  </Button>
                </TableCell>
                <TableCell>{product.displayName}</TableCell>
                <TableCell>{product.productNumber}</TableCell>
                <TableCell>{product.productName}</TableCell>
                <TableCell>{getGender(product.gender)}</TableCell>
                <TableCell>{product.isMark && "あり"}</TableCell>
                <TableCell>{product.isInseam && "あり"}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
