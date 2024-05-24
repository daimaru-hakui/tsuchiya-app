"use client";
import Status from "@/components/status";
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
import { format } from "date-fns";
import {
  collection,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import Link from "next/link";
import { useEffect, useState } from "react";
import Loading from "../loading";
import ShippingSearch from "./shipping-search";
import { useStore } from "@/store";
import useFunctons from "@/hooks/useFunctons";
import { Shipping } from "@/types/shipping.type";

export default function ShippingList() {
  const [shippings, setShippings] = useState<Shipping[]>();
  const shippingStatusSearch = useStore((state) => state.shippingStatusSearch);
  const shippingStartDate = useStore((state) => state.shippingStartDate);
  const shippingEndDate = useStore((state) => state.shippingEndDate);
  const { zeroPadding } = useFunctons();

  useEffect(() => {
    const shippingsRef = collection(db, "shippings");
    const status =
      shippingStatusSearch === "all"
        ? ["picking", "finished"]
        : [shippingStatusSearch];

    const q = query(
      shippingsRef,
      orderBy("shippingNumber", "desc"),
      orderBy("createdAt", "desc"),
      where("status", "!=", "canceled"),
      where("status", "in", status),
      where("createdAt", ">=", shippingStartDate),
      where("createdAt", "<=", shippingEndDate)
    );

    const unsub = onSnapshot(q, {
      next: (snapshot) => {
        setShippings(
          snapshot.docs.map(
            (doc) => ({ ...doc.data(), id: doc.id } as Shipping)
          )
        );
      },
    });
    return () => unsub();
  }, [shippingStatusSearch, shippingStartDate, shippingEndDate]);

  const getTrackingLink = (tracking: string, courier: string) => {
    switch (courier) {
      case "seino":
        return `https://track.seino.co.jp/kamotsu/GempyoNoShokai.do?action=%E3%80%80%E6%A4%9C+%E7%B4%A2%E3%80%80&GNPNO1=${tracking}`;
      case "sagawa":
        return `https://k2k.sagawa-exp.co.jp/p/web/okurijosearch.do?okurijoNo=${tracking}`;
      case "fukuyama":
        return `https://corp.fukutsu.co.jp/situation/tracking_no_hunt/${tracking}`;
    }
  };

  if (!shippings) return <Loading />;

  return (
    <Card className="w-full overflow-auto">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>出荷一覧</CardTitle>
          <div className="hidden lg:block">
            <ShippingSearch />
          </div>
          <div></div>
        </div>
      </CardHeader>
      <CardContent className="overflow-auto">
        <Table className="min-w-[2000px]">
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80px]">詳細</TableHead>
              <TableHead className="w-[115px]">日付</TableHead>
              <TableHead className="w-[115px] text-center">
                ステータス
              </TableHead>
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
                  {format(new Date(shipping.createdAt.toDate()), "yyyy-MM-dd")}
                </TableCell>
                <TableCell className="text-center">
                  <Status value={shipping.status} />
                </TableCell>
                <TableCell>
                  <Link
                    href={`${getTrackingLink(
                      shipping.trackingNumber,
                      shipping.courier
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 underline"
                  >
                    {shipping.trackingNumber}
                  </Link>
                </TableCell>
                <TableCell>{zeroPadding(shipping.shippingNumber)}</TableCell>
                <TableCell>{zeroPadding(shipping.orderNumber)}</TableCell>
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
