"use client";
import Status from "@/components/status";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { db } from "@/lib/firebase/client";
import { Shipping } from "@/types";
import { format } from "date-fns";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function ShippingList() {
  const [shippings, setShippings] = useState<Shipping[]>([]);

  useEffect(() => {
    const shippingsRef = collection(db, "shippings");
    const q = query(shippingsRef, orderBy("shippingNumber", "desc"));
    const unsub = onSnapshot(q, {
      next: (snapshot) => {
        setShippings(snapshot.docs.map((doc) => (
          { ...doc.data(), id: doc.id } as Shipping
        )));
      }
    });
    return () => unsub();
  }, []);

  return (
    <Card className="w-full overflow-auto">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>出荷一覧</CardTitle>
          <Button size="sm" asChild>
            <Link href="/shippings/new">発注登録</Link>
          </Button>
        </div>
      </CardHeader>
      <CardContent className="overflow-auto">
        <Table className="min-w-[2000px]">
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80px]">詳細</TableHead>
              <TableHead className="w-[115px]">ステータス</TableHead>
              <TableHead className="w-[120px]">日付</TableHead>
              <TableHead className="w-[120px]">送状No.</TableHead>
              <TableHead className="w-[90px]">出荷No.</TableHead>
              <TableHead className="w-[90px]">発注No.</TableHead>
              <TableHead>所属名</TableHead>
              <TableHead>社員コード</TableHead>
              <TableHead>イニシャル</TableHead>
              <TableHead>氏名</TableHead>
              <TableHead>役職</TableHead>
              <TableHead>社名</TableHead>
              <TableHead>工事コード</TableHead>
              <TableHead>現場名 又は組織名</TableHead>
              <TableHead>郵便番号</TableHead>
              <TableHead>住所</TableHead>
              <TableHead>電話番号</TableHead>
              <TableHead>備考</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {shippings.map((shipping) => (
              <TableRow key={shipping.id}>
                <TableCell>
                  <Button size="xs" asChild>
                    <Link href={`/shippings/${shipping.id}`}>詳細</Link>
                  </Button>
                </TableCell>
                <TableCell>
                  <Status value={shipping.status} />
                </TableCell>
                <TableCell>
                  {format(new Date(shipping.createdAt.toDate()), "yyyy-MM-dd")}
                </TableCell>
                <TableCell>{shipping.invoiceNumber}</TableCell>
                <TableCell>{shipping.shippingNumber}</TableCell>
                <TableCell>{shipping.orderNumber}</TableCell>
                <TableCell>{shipping.section}</TableCell>
                <TableCell>{shipping.employeeCode}</TableCell>
                <TableCell>{shipping.initial}</TableCell>
                <TableCell>{shipping.username}</TableCell>
                <TableCell>{shipping.position}</TableCell>
                <TableCell>{shipping.companyName && " あり"}</TableCell>
                <TableCell>{shipping.siteCode}</TableCell>
                <TableCell>{shipping.siteName}</TableCell>
                <TableCell>{shipping.zipCode}</TableCell>
                <TableCell>{shipping.address}</TableCell>
                <TableCell>{shipping.tel}</TableCell>
                <TableCell>{shipping.memo}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}