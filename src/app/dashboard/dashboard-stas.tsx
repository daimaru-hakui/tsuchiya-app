"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3Icon } from "lucide-react";
import Link from "next/link";
import DashboardChart from "./dashboard-chart";
import { useEffect, useState } from "react";
import {
  collection,
  collectionGroup,
  getAggregateFromServer,
  getCountFromServer,
  getDocs,
  query,
  sum,
  where,
} from "firebase/firestore";
import { db } from "@/lib/firebase/client";
import { useStore } from "@/store";
import { Sku } from "@/types/product.type";
import DashboardCard from "./DashboardCard";

export default function DashboardStats() {
  const [ordersCount, setOrdersCount] = useState(0);
  const [shippingsCount, setShippingsCount] = useState(0);
  const [shippingsTotalAmount, setShippingsTotalAmount] = useState(0);
  const [pendingCount, setPendingCount] = useState(0);
  const [openOrderCount, setOpenOrderCount] = useState(0);
  const [pickingCount, setPickingCount] = useState(0);
  const [stockTotalAmount, setStockTotalAmount] = useState(0);
  const setOrderStatus = useStore((state) => state.setOrderStatus);
  const setShippingStatus = useStore((state) => state.setShippingStatus);

  useEffect(() => {
    getOrderCount();
    getShippingCount();
    getShippingTotalAmount();
    getPendingCount();
    getOpenOrderCount();
    getPickingCount();
    getTotalStockAmount();
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

  const getOpenOrderCount = async () => {
    const coll = collection(db, "orders");
    const q = query(coll, where("status", "==", "openOrder"));
    const snapshot = await getCountFromServer(q);
    setOpenOrderCount(snapshot.data().count);
  };

  const getPickingCount = async () => {
    const coll = collection(db, "shippings");
    const q = query(coll, where("status", "==", "picking"));
    const snapshot = await getCountFromServer(q);
    setPickingCount(snapshot.data().count);
  };

  const getTotalStockAmount = async () => {
    const coll = collectionGroup(db, "skus");
    const q = query(coll, where("stock", ">", 0));
    const skusSnap = await getDocs(q);
    const docs = skusSnap.docs.map((doc) => ({ ...doc.data() } as Sku));
    setStockTotalAmount(
      docs.reduce((sum, doc) => sum + doc.salePrice * doc.stock, 0)
    );
  };

  return (
    <div className="space-y-4">
      <div className="grid lg:grid-cols-4 gap-4">
        <DashboardCard title="当月受注件数" quantity={ordersCount}>
          <Button size="xs" asChild>
            <Link href="/orders">一覧へ</Link>
          </Button>
        </DashboardCard>
        <DashboardCard title="当月出荷件数" quantity={shippingsCount}>
          <Button
            size="xs"
            asChild
            onClick={() => setShippingStatus("finished")}
          >
            <Link href="/shippings">一覧へ</Link>
          </Button>
        </DashboardCard>
        <DashboardCard
          title="当月購入金額"
          quantity={shippingsTotalAmount.toLocaleString() + "円"}
        ></DashboardCard>
        <DashboardCard
          title="在庫金額"
          quantity={stockTotalAmount.toLocaleString() + "円"}
        />
      </div>
      <div className="grid lg:grid-cols-4 gap-4">
        <DashboardCard title="受注未処理件数" quantity={pendingCount}>
          <Button
            size="xs"
            asChild
            onClick={() => {
              setOrderStatus("pending");
            }}
          >
            <Link href="/orders">一覧へ</Link>
          </Button>
        </DashboardCard>
        <DashboardCard title="受注処理中件数" quantity={pendingCount}>
          <Button
            size="xs"
            asChild
            onClick={() => {
              setOrderStatus("processing");
            }}
          >
            <Link href="/orders">一覧へ</Link>
          </Button>
        </DashboardCard>
        <DashboardCard title="受注残件数" quantity={openOrderCount}>
          <Button size="xs" asChild onClick={() => setOrderStatus("openOrder")}>
            <Link href="/orders">一覧へ</Link>
          </Button>
        </DashboardCard>
        <DashboardCard title="出荷未処理件数" quantity={pickingCount}>
          <Button
            size="xs"
            asChild
            onClick={() => setShippingStatus("picking")}
          >
            <Link href="/shippings">一覧へ</Link>
          </Button>
        </DashboardCard>
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
