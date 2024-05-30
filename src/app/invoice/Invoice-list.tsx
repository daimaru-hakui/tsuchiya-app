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
import {
  collection,
  collectionGroup,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import Link from "next/link";
import { useEffect, useState } from "react";
import Loading from "../loading";
import { useStore } from "@/store";
import { format } from "date-fns";
import useFunctons from "@/hooks/useFunctons";
import InvoiceSearch from "./invoice-search";
import { Shipping, ShippingDetail } from "@/types/shipping.type";

interface Details {
  details: ShippingDetail[];
}

export default function InvoiceList() {
  const [shippings, setShippings] = useState<Shipping[]>();
  const [shippingDetails, setShippingDetails] = useState<ShippingDetail[]>();
  const [data, setData] = useState<(Shipping & Details)[]>();
  const [totalAmount, setTotalAmount] = useState(0);
  const invoiceStartDate = useStore((state) => state.invoiceStartDate);
  const invoiceEndDate = useStore((state) => state.invoiceEndDate);
  const { zeroPadding } = useFunctons();

  useEffect(() => {
    const ordersRef = collection(db, "shippings");
    const q = query(
      ordersRef,
      orderBy("shippingNumber", "asc"),
      orderBy("createdAt", "asc"),
      where("status", "!=", "canceled"),
      where("status", "==", "finished"),
      where("createdAt", ">=", invoiceStartDate),
      where("createdAt", "<=", invoiceEndDate)
    );
    const unsub = onSnapshot(q, {
      next: (snapshot) => {
        const data = snapshot.docs.map(
          (doc) => ({ ...doc.data(), id: doc.id } as Shipping)
        );
        setShippings(data);
      },
    });
    return () => unsub();
  }, [invoiceStartDate, invoiceEndDate]);

  useEffect(() => {
    const shippingDetailRef = collectionGroup(db, "shippingDetails");
    const q = query(
      shippingDetailRef,
      orderBy("createdAt", "asc"),
      where("createdAt", ">=", invoiceStartDate),
      where("createdAt", "<=", invoiceEndDate)
    );
    const unsub = onSnapshot(q, {
      next: (snapshot) => {
        const data = snapshot.docs.map(
          (doc) => ({ ...doc.data() } as ShippingDetail)
        );
        setShippingDetails(data);
      },
    });
    return () => unsub();
  }, [invoiceStartDate, invoiceEndDate]);

  useEffect(() => {
    if (!shippings) return;
    const data = shippings.map((shipping) => {
      const filterDetails = shippingDetails?.filter(
        (detail) => detail.shippingNumber === shipping.shippingNumber
      );
      const sortDetails = filterDetails?.sort((a, b) =>
        a.sortNum < b.sortNum ? -1 : 1
      );
      let details: Shipping & Details;
      details = { details: sortDetails || [], ...shipping };
      return details;
    });
    const totalAmount = data.reduce((sum, d) => sum + (d?.totalAmount || 0), 0);
    setTotalAmount(totalAmount);
    setData(data);
  }, [shippingDetails, shippings]);

  if (!data) return <Loading />;

  return (
    <Card className="w-full md:w-[1300px] lg:w-[1500px] overflow-auto">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>請求明細</CardTitle>
          <div className="hidden lg:block">
            <InvoiceSearch />
          </div>
          <div className="text-2xl">
            合計金額 : {totalAmount.toLocaleString()}円
          </div>
        </div>
      </CardHeader>
      <CardContent className="overflow-auto">
        <Table className="min-w-[1000px]">
          <TableHeader>
            <TableRow>
              <TableHead className="w-[120px]">詳細</TableHead>
              <TableHead className="min-w-[120px]">日付</TableHead>
              <TableHead className="w-[90px]">出荷No.</TableHead>
              <TableHead className="w-[90px]">発注No.</TableHead>
              <TableHead className="min-w-[110px]">イニシャル</TableHead>
              <TableHead className="min-w-[100px]">名前</TableHead>
              <TableHead className="">
                <div className="flex">
                  <div className="w-[100px] px-2">品番</div>
                  <div className="w-[300px] px-2"> 品名</div>
                  <div className="w-[80px] px-2 text-center">サイズ</div>
                  <div className="w-[80px] px-2 text-center">数量</div>
                  <div className="w-[80px] px-2 text-center">小計</div>
                </div>
              </TableHead>
              <TableHead>
                <div className="w-[80px]">合計</div>
              </TableHead>
              {/* <TableHead className="w-[80px]">数量</TableHead> */}
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((d) => (
              <TableRow key={d.id}>
                <TableCell>
                  <Button size="xs" asChild>
                    <Link href={`/shippings/${d.id}`}>詳細</Link>
                  </Button>
                </TableCell>
                <TableCell>
                  {format(d.createdAt.toDate(), "yyyy-MM-dd")}
                </TableCell>
                <TableCell>{zeroPadding(d.shippingNumber)}</TableCell>
                <TableCell className="text-center">
                  {zeroPadding(d.orderNumber)}
                </TableCell>
                <TableCell className="text-center">{d.initial}</TableCell>
                <TableCell>{d.username}</TableCell>
                <TableCell>
                  {d.details.map((detail, idx) => (
                    <div key={idx} className="flex items-start my-1">
                      <div className="w-[100px] px-2">
                        {detail.productNumber}
                      </div>
                      <div className="w-[300px] px-2">
                        {detail.productName}
                        {detail.isStock && "【在庫】"}
                      </div>
                      <div className="w-[80px] px-2 text-center">
                        {detail.size}
                      </div>
                      <div className="w-[80px] px-2 text-right">
                        {detail.quantity}
                      </div>
                      <div className="w-[80px] px-2 text-right">
                        {(detail.quantity * detail.salePrice).toLocaleString()}
                      </div>
                    </div>
                  ))}
                </TableCell>
                <TableCell className="w-[80px]">
                  {d.totalAmount.toLocaleString()}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
