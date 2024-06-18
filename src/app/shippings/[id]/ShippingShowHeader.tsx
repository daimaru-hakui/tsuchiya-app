"use client";
import { CardTitle } from "@/components/ui/card";
import { ArrowLeft, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import paths from "@/utils/paths";
import Status from "@/components/status";
import { format } from "date-fns";
import ShippingInvoiceModal from "./ShippingInvoiceModal";
import ShippingEditModal from "./ShippingEditModal";
import ShippingDeleteButton from "./ShippingDeleteButton";
import { useRouter } from "next/navigation";
import { Shipping, ShippingDetail } from "@/types/shipping.type";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import {
  collection,
  limit,
  onSnapshot,
  orderBy,
  query,
  startAfter,
  where,
} from "firebase/firestore";
import { useStore } from "@/store";
import { db } from "@/lib/firebase/client";

type Props = {
  id: string;
  shipping: Shipping;
  shippingDetails: ShippingDetail[];
  totalAmount: number;
};

export default function ShippingShowHeader({
  id,
  shipping,
  shippingDetails,
  totalAmount,
}: Props) {
  const router = useRouter();
  const role = useSession().data?.user.role || "user";
  const [nextPage, setNextPage] = useState<string | null>(null);
  const [prevPage, setPrevPage] = useState<string | null>(null);
  const shippingStatus = useStore((state) => state.shippingStatus);

  useEffect(() => {
    if (!shipping?.shippingNumber) return;
    const status =
      shippingStatus === "all" ? ["picking", "finished"] : [shippingStatus];
    const ordersRef = collection(db, "shippings");
    const q = query(
      ordersRef,
      orderBy("shippingNumber", "asc"),
      where("status", "!=", "canceled"),
      where("status", "in", status),
      startAfter(shipping?.shippingNumber),
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
  }, [shipping?.shippingNumber, shippingStatus]);

  useEffect(() => {
    if (!shipping?.shippingNumber) return;
    const status =
      shippingStatus === "all" ? ["picking", "finished"] : [shippingStatus];
    const ordersRef = collection(db, "shippings");
    const q = query(
      ordersRef,
      orderBy("shippingNumber", "desc"),
      where("status", "!=", "canceled"),
      where("status", "in", status),
      startAfter(shipping?.shippingNumber),
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
  }, [shipping?.shippingNumber, shippingStatus]);

  return (
    <>
      <div className="flex justify-between mb-4">
        <ArrowLeft
          className="cursor-pointer"
          onClick={() => router.push(paths.shippingAll())}
        />
        <span className="flex items-center gap-4 ml-auto">
          {shipping.status !== "finished" &&
            (role === "admin" || role === "member") && (
              <>
                <ShippingInvoiceModal
                  shippingId={id}
                  trackingNumber={shipping.trackingNumber}
                  courier={shipping.courier}
                  totalAmount={totalAmount}
                />
                <ShippingEditModal
                  shipping={shipping}
                  shippingDetails={shippingDetails}
                />
                <ShippingDeleteButton
                  shippingId={shipping.id}
                  orderId={shipping.orderId}
                />
              </>
            )}
          <ChevronLeft
            className={cn("cursor-pointer", !prevPage && "opacity-35")}
            onClick={() =>
              prevPage && router.push(paths.shippingShow(prevPage))
            }
          />
          <ChevronRight
            className={cn("cursor-pointer", !nextPage && "opacity-35")}
            onClick={() =>
              nextPage && router.push(paths.shippingShow(nextPage))
            }
          />
        </span>
      </div>
      <CardTitle className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          出荷詳細
          <span className="flex items-center">
            <Status value={shipping.status} />
          </span>
        </div>
        <div className="text-base">
          {format(new Date(shipping.createdAt.toDate()), "yyyy-MM-dd")}
        </div>
      </CardTitle>
    </>
  );
}
