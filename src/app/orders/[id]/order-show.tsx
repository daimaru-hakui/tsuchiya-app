"use client";
import OrderShowTable from "./order-show-table";
import { useEffect, useState } from "react";
import { collection, doc, limit, onSnapshot, orderBy, query, startAfter } from "firebase/firestore";
import { db } from "@/lib/firebase/client";
import { Order, OrderDetail } from "@/types";
import Loading from "@/app/loading";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, ChevronLeft, ChevronRight, Edit } from "lucide-react";
import OrderShippingModal from "./order-shipping-modal";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import paths from "@/paths";

interface Props {
  id: string;
}

export default function OrderShow({ id }: Props) {
  const [order, setOrder] = useState<Order>();
  const router = useRouter();
  const [orderDetails, setOrderDetails] = useState<OrderDetail[]>([]);
  const [nextPage, setNextPage] = useState<string | null>(null);
  const [prevPage, setPrevPage] = useState<string | null>(null);

  useEffect(() => {
    const orderRef = doc(db, "orders", id);
    const unsub = onSnapshot(orderRef, {
      next: (snapshot) => {
        if (!snapshot.exists()) return;
        setOrder({ ...snapshot.data() } as Order);
      },
      error: (e) => {
        console.error(e);
      }
    });
    return () => unsub();
  }, [id]);

  useEffect(() => {
    const detailsRef = collection(db, "orders", id, "orderDetails");
    const q = query(detailsRef, orderBy("sortNum", "asc"));
    const unsub = onSnapshot(q, {
      next: (snapshot) => {
        setOrderDetails(snapshot.docs.map(doc => ({
          ...doc.data(), id: doc.id
        } as OrderDetail)));
      },
      error: (e) => {
        console.error(e);
      }
    });
    return () => unsub();
  }, [id]);

  useEffect(() => {
    if (!order?.serialNumber) return;
    const ordersRef = collection(db, "orders");
    const q = query(ordersRef, orderBy("serialNumber", "asc"), startAfter(order?.serialNumber), limit(1));
    const unsub = onSnapshot(q, {
      next: (snapshot) => {
        snapshot.docs[0]?.exists() ? setNextPage(snapshot.docs[0].data().id) : setNextPage(null);
      },
      error: (e) => {
        console.error(e);
      }
    });
    return () => unsub();
  }, [order?.serialNumber]);

  useEffect(() => {
    if (!order?.serialNumber) return;
    const ordersRef = collection(db, "orders");
    const q = query(ordersRef, orderBy("serialNumber", "desc"), startAfter(order?.serialNumber), limit(1));
    const unsub = onSnapshot(q, {
      next: (snapshot) => {
        snapshot.docs[0]?.exists() ? setPrevPage(snapshot.docs[0].data().id) : setPrevPage(null);
      },
      error: (e) => {
        console.error(e);
      }
    });
    return () => unsub();
  }, [order?.serialNumber]);

  if (!order) return <Loading />;

  return (
    <Card className="w-full md:w-[900px] overflow-auto">
      <CardHeader>
        <div className="flex justify-between mb-4">
          <ArrowLeft className="cursor-pointer"
            onClick={() => router.push(paths.orderAll())} />
          <span className="flex items-center gap-3 ml-auto">
            <OrderShippingModal order={order} orderDetails={orderDetails} />
            <Edit size={20} className="cursor-pointer" />
            <ChevronLeft
              className={cn("cursor-pointer", !prevPage && "opacity-35")}
              onClick={() => prevPage && router.push(paths.orderShow(prevPage))} />
            <ChevronRight
              className={cn("cursor-pointer", !nextPage && "opacity-35")}
              onClick={() => nextPage && router.push(paths.orderShow(nextPage))} />
          </span>
        </div>
        <CardTitle className="">詳細</CardTitle>
      </CardHeader>
      <CardContent>
        <div>
          <div className={cn(dlStyles)}>
            <div>発注No.</div><div>{order.serialNumber}</div>
          </div>
          <div className={cn(dlStyles)}>
            <div>所属名</div><div>{order.section}</div>
          </div>
          <div className={cn(dlStyles)}>
            <div>社員コード</div><div>{order.employeeCode}</div>
          </div>
          <div className={cn(dlStyles)}>
            <div>イニシャル</div><div>{order.initial}</div>
          </div>
          <div className={cn(dlStyles)}>
            <div>氏名</div><div>{order.username}</div>
          </div>
          <div className={cn(dlStyles)}>
            <div>役職</div><div>{order.position}</div>
          </div>
        </div>
        <div className="mt-4">
          <OrderShowTable orderDetails={orderDetails} />
        </div>
      </CardContent>
    </Card>
  );
}

const dlStyles = "grid grid-cols-[150px_1fr] text-sm leading-7 px-4";