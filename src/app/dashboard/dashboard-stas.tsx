"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3Icon } from "lucide-react";
import Link from "next/link";
import DashboardChart from "./dashboard-chart";
import { useEffect, useState } from "react";
import {
  collection,
  getAggregateFromServer,
  getCountFromServer,
  query,
  sum,
  where,
} from "firebase/firestore";
import { db } from "@/lib/firebase/client";

export default function DashboardStats() {
  const [ordersCount, setOrdersCount] = useState(0);
  const [shippingsCount, setShippingsCount] = useState(0);
  const [shippingsTotalAmount, setShippingsTotalAmount] = useState(0);
  const [pendingCount, setPendingCount] = useState(0);
  const [pickingCount, setPickingCount] = useState(0);

  useEffect(() => {
    getOrderCount();
    getShippingCount();
    getShippingTotalAmount();
    getPendingCount();
    getPickingCount()
  }, []);

  const getOrderCount = async () => {
    const thisYear = new Date().getFullYear();
    const thisMonth = new Date().getMonth();
    const coll = collection(db, "orders");
    const q = query(
      coll,
      where("createdAt", ">=", new Date(thisYear, thisMonth, 1))
    );
    const snapshot = await getCountFromServer(q);
    setOrdersCount(snapshot.data().count);
  };

  const getShippingCount = async () => {
    const thisYear = new Date().getFullYear();
    const thisMonth = new Date().getMonth();
    const coll = collection(db, "shippings");
    const q = query(
      coll,
      where("createdAt", ">=", new Date(thisYear, thisMonth, 1)),
      where("status", "==", "finished")
    );
    const snapshot = await getCountFromServer(q);
    setShippingsCount(snapshot.data().count);
  };

  const getShippingTotalAmount = async () => {
    const thisYear = new Date().getFullYear();
    const thisMonth = new Date().getMonth();
    const coll = collection(db, "shippings");
    const q = query(
      coll,
      where("createdAt", ">=", new Date(thisYear, thisMonth, 1)),
      where("status", "==", "finished")
    );
    const snapshot = await getAggregateFromServer(q, {
      totalAmount: sum("totalAmount"),
    });
    setShippingsTotalAmount(snapshot.data().totalAmount);
  };

  const getPendingCount = async () => {
    const coll = collection(db, "orders");
    const q = query(coll, where("status", "==", "pending"));
    const snapshot = await getCountFromServer(q);
    setPendingCount(snapshot.data().count);
  };

  const getPickingCount = async () => {
    const coll = collection(db, "shippings");
    const q = query(coll, where("status", "==", "picking"));
    const snapshot = await getCountFromServer(q);
    setPickingCount(snapshot.data().count);
  };

  return (
    <div className="space-y-4">
      <div className="grid lg:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">当月受注件数</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-between">
            <div className="text-5xl font-bold">{ordersCount}</div>
            <Button size="xs" asChild>
              <Link href="/">一覧へ</Link>
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">当月出荷件数</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-between">
            <div className="text-5xl font-bold">{shippingsCount}</div>
            <Button size="xs" asChild>
              <Link href="/">一覧へ</Link>
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">当月購入金額</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-5xl font-bold">
              {shippingsTotalAmount.toLocaleString()}円
            </div>
          </CardContent>
        </Card>
      </div>
      <div className="grid lg:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">受注未処理件数</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-between">
            <div className="text-5xl font-bold">{pendingCount}</div>
            <Button size="xs" asChild>
              <Link href="/">一覧へ</Link>
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">出荷未処理件数</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-between">
            <div className="text-5xl font-bold">{pickingCount}</div>
            <Button size="xs" asChild>
              <Link href="/">一覧へ</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
      <Card className="my-4">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3Icon />
            <span className="text-base">月別購入金額チャート</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="pl-0">
          <DashboardChart />
        </CardContent>
      </Card>
    </div>
  );
}
