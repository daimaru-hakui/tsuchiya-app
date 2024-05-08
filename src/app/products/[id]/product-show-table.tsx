"use client";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { db } from "@/lib/firebase/client";
import { Sku } from "@/types";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import React, { useEffect, useState } from "react";

interface Props {
  id: string;
}

export default function ProductShowTable({ id }: Props) {
  const [skus, setSkus] = useState<Sku[]>([]);

  useEffect(() => {
    const productsRef = collection(db, "products", id, "skus");
    const q = query(productsRef, orderBy("sortNum", "asc"));
    onSnapshot(q, (snapshot) => {
      setSkus(
        snapshot.docs.map(
          (doc) =>
            ({
              id: doc.id,
              ...doc.data(),
            } as Sku)
        )
      );
    });
  }, [id]);

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="">サイズ</TableHead>
          <TableHead>価格</TableHead>
          <TableHead>在庫</TableHead>
          <TableHead>順番</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {skus.map((sku) => (
          <TableRow key={sku.id}>
            <TableCell className="font-medium">{sku.size}</TableCell>
            <TableCell>{sku.price}</TableCell>
            <TableCell>{sku.stock}</TableCell>
            <TableCell className="text-right">{sku.sortNum}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
