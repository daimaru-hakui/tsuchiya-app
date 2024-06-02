"use client";
import OrderShowTable from "./order-show-table";
import { useEffect, useState } from "react";
import {
  collection,
  doc,
  limit,
  onSnapshot,
  orderBy,
  query,
  startAfter,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "@/lib/firebase/client";
import Loading from "@/app/loading";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, ChevronLeft, ChevronRight, Edit } from "lucide-react";
import OrderShippingModal from "./order-shipping-modal";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import paths from "@/utils/paths";
import Status from "@/components/status";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { useStore } from "@/store";
import { Order, OrderDetail } from "@/types/order.type";
import OrderEditModal from "./order-edit-modal";
import OrderShowHeader from "./order-show-header";
import OrderCancelButton from "./OrderCancelButton";

interface Props {
  id: string;
}

export default function OrderShow({ id }: Props) {
  const [order, setOrder] = useState<Order>();
  const router = useRouter();
  const [orderDetails, setOrderDetails] = useState<
    (OrderDetail & { stock: number; })[]
  >([]);
  const [nextPage, setNextPage] = useState<string | null>(null);
  const [prevPage, setPrevPage] = useState<string | null>(null);
  const orderStatus = useStore((state) => state.orderStatus);

  useEffect(() => {
    const orderRef = doc(db, "orders", id);
    const unsub = onSnapshot(orderRef, {
      next: (snapshot) => {
        if (!snapshot.exists()) return;
        setOrder({ ...snapshot.data() } as Order);
      },
      error: (e) => {
        console.error(e);
      },
    });
    return () => unsub();
  }, [id]);

  useEffect(() => {
    const detailsRef = collection(db, "orders", id, "orderDetails");
    const q = query(detailsRef, orderBy("sortNum", "asc"));
    const unsub = onSnapshot(q, {
      next: (snapshot) => {
        setOrderDetails(
          snapshot.docs.map(
            (doc) => ({ ...doc.data(), id: doc.id } as OrderDetail)
          )
        );
      },
      error: (e) => {
        console.error(e);
      },
    });
    return () => unsub();
  }, [id]);

  useEffect(() => {
    if (!order?.orderNumber) return;
    const status =
      orderStatus === "all"
        ? ["processing", "finished", "pending", "openOrder"]
        : [orderStatus];
    const ordersRef = collection(db, "orders");
    const q = query(
      ordersRef,
      orderBy("orderNumber", "asc"),
      where("status", "!=", "canceled"),
      where("status", "in", status),
      startAfter(order?.orderNumber),
      limit(1)
    );
    const unsub = onSnapshot(q, {
      next: (snapshot) => {
        snapshot.docs.at(0)?.exists()
          ? setNextPage(snapshot.docs[0].data().id)
          : setNextPage(null);
      },
      error: (e) => {
        console.error(e);
      },
    });
    return () => unsub();
  }, [order?.orderNumber, orderStatus]);

  useEffect(() => {
    if (!order?.orderNumber) return;
    const status =
      orderStatus === "all"
        ? ["processing", "finished", "pending", "openOrder"]
        : [orderStatus];
    const ordersRef = collection(db, "orders");
    const q = query(
      ordersRef,
      orderBy("orderNumber", "desc"),
      where("status", "!=", "canceled"),
      where("status", "in", status),
      startAfter(order?.orderNumber),
      limit(1)
    );
    const unsub = onSnapshot(q, {
      next: (snapshot) => {
        snapshot.docs.at(0)?.exists()
          ? setPrevPage(snapshot.docs[0].data().id)
          : setPrevPage(null);
      },
      error: (e) => {
        console.error(e);
      },
    });
    return () => unsub();
  }, [order?.orderNumber, orderStatus]);

  const handleStatusChange = async (status: string) => {
    const result = confirm("確定して宜しいでしょうか");
    if (!result) return;
    const orderRef = doc(db, "orders", id);
    await updateDoc(orderRef, {
      status: status,
    });
  };

  if (!order) return <Loading />;

  return (
    <Card className="w-full md:w-[1200px] overflow-auto">
      <CardHeader>
        <div className="flex justify-between mb-4">
          <ArrowLeft
            className="cursor-pointer"
            onClick={() => router.push(paths.orderAll())}
          />
          <span className="flex items-center gap-4 ml-auto">
            {order.status === "pending" && (
              <OrderCancelButton orderId={order.id} orderDetails={orderDetails} />
            )}
            {order.status === "pending" && (
              // && session.data?.user.role === "member"
              <>
                <Button
                  size="xs"
                  variant="default"
                  onClick={() => handleStatusChange("processing")}
                >
                  受注する
                </Button>
              </>
            )}
            {order.status !== "pending" && (
              <OrderShippingModal order={order} orderDetails={orderDetails} />
            )}
            <OrderEditModal order={order} orderDetails={orderDetails} />
            <ChevronLeft
              className={cn("cursor-pointer", !prevPage && "opacity-35")}
              onClick={() => prevPage && router.push(paths.orderShow(prevPage))}
            />
            <ChevronRight
              className={cn("cursor-pointer", !nextPage && "opacity-35")}
              onClick={() => nextPage && router.push(paths.orderShow(nextPage))}
            />
          </span>
        </div>
        <CardTitle className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            発注詳細
            <span className="flex items-center">
              <Status value={order.status} />
            </span>
          </div>
          <div className="text-base">
            {format(new Date(order.createdAt.toDate()), "yyyy-MM-dd")}
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <OrderShowHeader order={order} />
        <div className="mt-4">
          <OrderShowTable orderDetails={orderDetails} />
        </div>
      </CardContent>
    </Card>
  );
}
