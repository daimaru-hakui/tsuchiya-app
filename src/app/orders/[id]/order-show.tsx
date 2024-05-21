"use client";
import OrderShowTable from "./order-show-table";
import { useEffect, useState } from "react";
import {
  DocumentReference,
  collection,
  doc,
  getDoc,
  limit,
  onSnapshot,
  orderBy,
  query,
  startAfter,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "@/lib/firebase/client";
import { Order, OrderDetail } from "@/types";
import Loading from "@/app/loading";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, ChevronLeft, ChevronRight, Edit } from "lucide-react";
import OrderShippingModal from "./order-shipping-modal";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import paths from "@/paths";
import Status from "@/components/status";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { useStore } from "@/store";

interface Props {
  id: string;
}

export default function OrderShow({ id }: Props) {
  const [order, setOrder] = useState<Order>();
  const router = useRouter();
  const [orderDetails, setOrderDetails] = useState<
    (OrderDetail & { stock: number })[]
  >([]);
  const [nextPage, setNextPage] = useState<string | null>(null);
  const [prevPage, setPrevPage] = useState<string | null>(null);
  const statusSearch = useStore((state) => state.statusSearch);

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
      statusSearch === "all"
        ? ["processing", "finished", "pending", "openOrder"]
        : [statusSearch];
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
  }, [order?.orderNumber, statusSearch]);

  useEffect(() => {
    if (!order?.orderNumber) return;
    const status =
      statusSearch === "all"
        ? ["processing", "finished", "pending", "openOrder"]
        : [statusSearch];
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
  }, [order?.orderNumber, statusSearch]);

  const handleStatusChange = async (status: string) => {
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
          <span className="flex items-center gap-3 ml-auto">
            {order.status === "pending" && (
              <Button
                size="xs"
                variant="outline"
                onClick={() => handleStatusChange("canceled")}
              >
                キャンセル
              </Button>
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
            <Edit size={20} className="cursor-pointer" />
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
        <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr]">
          <div>
            <dl className={cn(dlStyles)}>
              <dt className={cn(dtStyles)}>発注No.</dt>
              <dd>{order.orderNumber}</dd>
            </dl>
            <dl className={cn(dlStyles)}>
              <dt className={cn(dtStyles)}>所属名</dt>
              <dd>{order.section}</dd>
            </dl>
            <dl className={cn(dlStyles)}>
              <dt className={cn(dtStyles)}>社員コード</dt>
              <dd>{order.employeeCode}</dd>
            </dl>
            <dl className={cn(dlStyles)}>
              <dt className={cn(dtStyles)}>イニシャル</dt>
              <dd>{order.initial}</dd>
            </dl>
            <dl className={cn(dlStyles)}>
              <dt className={cn(dtStyles)}>社名刺繍</dt>
              <dd>{order.companyName ? "あり" : "-"}</dd>
            </dl>
            <dl className={cn(dlStyles)}>
              <dt className={cn(dtStyles)}>氏名</dt>
              <dd>{order.username}</dd>
            </dl>
            <dl className={cn(dlStyles)}>
              <dt className={cn(dtStyles)}>役職</dt>
              <dd>{order.position}</dd>
            </dl>
          </div>
          <div>
            <dl className={cn(dlStyles)}>
              <dt className={cn(dtStyles)}>工事コード</dt>
              <dd>{order.siteCode}</dd>
            </dl>
            <dl className={cn(dlStyles)}>
              <dt className={cn(dtStyles)}>現場名</dt>
              <dd>{order.siteName}</dd>
            </dl>
            <dl className={cn(dlStyles)}>
              <dt className={cn(dtStyles)}>郵便番号</dt>
              <dd>{order.zipCode}</dd>
            </dl>
            <dl className={cn(dlStyles)}>
              <dt className={cn(dtStyles)}>住所</dt>
              <dd>{order.address}</dd>
            </dl>
            <dl className={cn(dlStyles)}>
              <dt className={cn(dtStyles)}>TEL</dt>
              <dd>{order.tel}</dd>
            </dl>
            <dl className={cn(dlStyles)}>
              <dt className={cn(dtStyles)}>申請者</dt>
              <dd>{order.applicant}</dd>
            </dl>
            <dl className={cn(dlStyles)}>
              <dt className={cn(dtStyles)}>備考</dt>
              <dd>{order.memo}</dd>
            </dl>
          </div>
        </div>
        <div className="mt-4">
          <OrderShowTable orderDetails={orderDetails} />
        </div>
      </CardContent>
    </Card>
  );
}

const dlStyles = "grid grid-cols-[100px_1fr] text-sm leading-7 px-4";
const dtStyles = "text-zinc-500 font-bold";
