"use client";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useEffect, useState } from "react";
import {
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";
import { db } from "@/lib/firebase/client";
import Loading from "@/app/loading";
import ShippingShowTable from "./ShippingShowTable";
import { Shipping, ShippingDetail } from "@/types/shipping.type";
import ShippingShowHeader from "./ShippingShowHeader";
import ShippingShowContent from "./ShippingShowContent";

interface Props {
  id: string;
}

export default function ShippingShow({ id }: Props) {
  const [shipping, setShipping] = useState<Shipping>();
  const [shippingDetails, setShippingDetails] = useState<ShippingDetail[]>([]);
  const [totalAmount, setTotalAmount] = useState(0);

  useEffect(() => {
    const shippingRef = doc(db, "shippings", id);
    const unsub = onSnapshot(shippingRef, {
      next: (snapshot) => {
        if (!snapshot.exists()) return;
        setShipping({ ...snapshot.data() } as Shipping);
      },
      error: (e) => {
        console.error(e);
      },
    });
    return () => unsub();
  }, [id]);

  useEffect(() => {
    const shippingDetailRef = collection(
      db,
      "shippings",
      id,
      "shippingDetails"
    );
    const q = query(shippingDetailRef, orderBy("sortNum", "asc"));
    const unsub = onSnapshot(q, {
      next: (snapshot) => {
        setShippingDetails(
          snapshot.docs.map(
            (doc) => ({ ...doc.data(), id: doc.id } as ShippingDetail)
          )
        );
      },
      error: (e) => {
        console.error(e.message);
      },
    });
    return () => unsub();
  }, [id]);

  useEffect(() => {
    const getTotalAmount = () => {
      const total = shippingDetails.reduce(
        (sum: number, detail) =>
          (sum = sum + detail.quantity * detail.salePrice),
        0
      );
      setTotalAmount(total);
    };
    getTotalAmount();
  }, [shippingDetails]);

  if (!shipping) return <Loading />;

  return (
    <Card className="w-full md:w-[1200px] overflow-auto">
      <CardHeader>
        <ShippingShowHeader
          id={id}
          shipping={shipping}
          shippingDetails={shippingDetails}
          totalAmount={totalAmount}
        />
      </CardHeader>
      <CardContent>
        <ShippingShowContent shipping={shipping} />
        <ShippingShowTable
          shippingDetails={shippingDetails}
          totalAmount={totalAmount}
        />
      </CardContent>
    </Card>
  );
}
