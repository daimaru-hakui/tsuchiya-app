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
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import Link from "next/link";
import { useEffect, useState } from "react";
import Loading from "../loading";
import Status from "@/components/status";
import OrderSearch from "./order-search";
import { useStore } from "@/store";
import { format } from "date-fns";
import useFunctons from "@/hooks/useFunctons";
import { Order } from "@/types/order.type";

export default function OrderList() {
  const [orders, setOrders] = useState<Order[]>();
  const orderStatus = useStore((state) => state.orderStatus);
  const orderStartDate = useStore((state) => state.orderStartDate);
  const orderEndDate = useStore((state) => state.orderEndDate);
  const { zeroPadding } = useFunctons();

  useEffect(() => {
    const ordersRef = collection(db, "orders");
    const status =
      orderStatus === "all"
        ? ["processing", "finished", "pending", "openOrder"]
        : [orderStatus];
    const q = query(
      ordersRef,
      orderBy("orderNumber", "desc"),
      orderBy("createdAt", "desc"),
      where("status", "!=", "canceled"),
      where("status", "in", status),
      where("createdAt", ">=", orderStartDate),
      where("createdAt", "<=", orderEndDate)
    );
    const unsub = onSnapshot(q, {
      next: (snapshot) => {
        const data = snapshot.docs.map(
          (doc) => ({ ...doc.data(), id: doc.id } as Order)
        );
        setOrders(data);
      },
    });
    return () => unsub();
  }, [orderStatus, orderStartDate, orderEndDate]);

  if (!orders) return <Loading />;

  return (
    <Card className="w-full overflow-auto">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>発注一覧</CardTitle>
          <div className="hidden lg:block">
            <OrderSearch />
          </div>
          <Button size="sm" asChild>
            <Link href="/orders/new">発注登録</Link>
          </Button>
        </div>
      </CardHeader>
      <CardContent className="overflow-auto">
        {orders.length > 0 ? (
          <Table className="min-w-[2500px]">
            <TableHeader>
              <TableRow>
                <TableHead className="min-w-[80px]">詳細</TableHead>
                <TableHead className="min-w-[120px]">日付</TableHead>
                <TableHead className="min-w-[105px]">ステータス</TableHead>
                <TableHead className="min-w-[90px]">発注No.</TableHead>
                <TableHead className="min-w-[150px]">所属名</TableHead>
                <TableHead className="min-w-[150px]">社員コード</TableHead>
                <TableHead className="min-w-[120px]">イニシャル</TableHead>
                <TableHead className="min-w-[120px]">氏名</TableHead>
                <TableHead className="min-w-[120px]">役職</TableHead>
                <TableHead className="w-[80px]">社名</TableHead>
                <TableHead className="w-[150px]">工事コード</TableHead>
                <TableHead className="w-[350px]">現場名 又は組織名</TableHead>
                <TableHead className="w-[90px]">郵便番号</TableHead>
                <TableHead className="w-[400px]">住所</TableHead>
                <TableHead className="w-[150px]">電話番号</TableHead>
                <TableHead className="w-[200px]">備考</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell>
                    <Button size="xs" asChild>
                      <Link href={`/orders/${order.id}`}>詳細</Link>
                    </Button>
                  </TableCell>
                  <TableCell>
                    {format(order.createdAt.toDate(), "yyyy-MM-dd")}
                  </TableCell>
                  <TableCell className="text-center">
                    <Status value={order.status} />
                  </TableCell>
                  <TableCell>{zeroPadding(order.orderNumber)}</TableCell>
                  <TableCell>{order.section}</TableCell>
                  <TableCell>{order.employeeCode}</TableCell>
                  <TableCell>{order.initial}</TableCell>
                  <TableCell>{order.username}</TableCell>
                  <TableCell>{order.position}</TableCell>
                  <TableCell>{order.companyName && " あり"}</TableCell>
                  <TableCell>{order.siteCode}</TableCell>
                  <TableCell>{order.siteName}</TableCell>
                  <TableCell>{order.zipCode}</TableCell>
                  <TableCell>{order.address}</TableCell>
                  <TableCell>{order.tel}</TableCell>
                  <TableCell>{order.memo}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="text-center">該当する検索結果はありません。</div>
        )}
      </CardContent>
    </Card>
  );
}
