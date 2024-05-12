"use client";
import { useEffect, useState } from "react";
import { collection, doc, limit, onSnapshot, orderBy, query, startAfter } from "firebase/firestore";
import { db } from "@/lib/firebase/client";
import { Order, OrderDetail } from "@/types";
import OrderShowCard from "../../order-show-card";
import OrderShowTable from "../../[id]/order-show-table";
import OrderShippingShowTable from "./order-shipping-show-table";
import { Form } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import Loading from "@/app/loading";

interface Props {
  id: string;
}

export default function OrderShippingShow({ id }: Props) {
  const [order, setOrder] = useState<Order>();
  const [orderDetails, setOrderDetails] = useState<OrderDetail[]>([]);
  const [nextPage, setNextPage] = useState<string | null>(null);
  const [prevPage, setPrevPage] = useState<string | null>(null);
  const form = useForm();

  const onSubmit = (data: any) => {
    console.log(data);
  };

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
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <OrderShowCard title="出荷処理" order={order} nextPage={nextPage} prevPage={prevPage}>
          <OrderShippingShowTable orderDetails={orderDetails} form={form} />
          <Button type="submit">送信</Button>
        </OrderShowCard>
      </form>
    </Form>
  );
}