"use client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { db } from "@/lib/firebase/client";
import { Sku } from "@/types";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import ProductSkuEdit from "./product-sku-edit";

interface Props {
  id: string;
  updateSku:any
}

export default function ProductShowTable({ id ,updateSku}: Props) {
  const [skus, setSkus] = useState<Sku[]>([]);

  useEffect(() => {
    const productsRef = collection(db, "products", id, "skus");
    const q = query(productsRef, orderBy("sortNum", "asc"));
    const unsub = onSnapshot(q, {
      next: (snapshot) => {
        const result = snapshot.docs.map(
          (doc) => ({ ...doc.data(), id: doc.id } as Sku)
        );
        setSkus(result);
      },
      error: (e) => {
        console.error(e);
      },
    });
    return () => {
      unsub();
    };
  }, [id]);

  return (
    <Table className="min-w-[600px]">
      <TableHeader>
        <TableRow>
          <TableHead className="">サイズ</TableHead>
          <TableHead>販売価格</TableHead>
          <TableHead>仕入価格</TableHead>
          <TableHead>在庫</TableHead>
          <TableHead>受注数量</TableHead>
          <TableHead>順番</TableHead>
          <TableHead>詳細</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {skus.map((sku) => (
          <TableRow key={sku.id}>
            <TableCell className="font-medium">{sku.size}</TableCell>
            <TableCell className="text-right">
              {sku?.salePrice?.toLocaleString()}
            </TableCell>
            <TableCell className="text-right">
              {sku?.costPrice?.toLocaleString()}
            </TableCell>
            <TableCell className="text-right">{sku.stock}</TableCell>
            <TableCell className="text-right">{sku.orderQuantity}</TableCell>
            <TableCell className="text-right">{sku.sortNum}</TableCell>
            <TableCell className="text-right">
              <ProductSkuEdit sku={sku} updateSku={updateSku}/>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
