
"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { ArrowLeft, ChevronLeft, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FieldPath, FieldValue, collection, doc, documentId, endAt, endBefore, getDoc, getDocs, limit, onSnapshot, orderBy, query, startAfter, startAt } from "firebase/firestore";
import { db } from "@/lib/firebase/client";
import { Order, OrderDetail } from "@/types";

interface Props {
  children: React.ReactNode;
  title: string;
  order: Order;
  nextPage: string | null;
  prevPage: string | null;
}


import paths from "@/paths"; export default function OrderShowCard(
  { children, title, order, nextPage, prevPage }: Props) {
  const router = useRouter();

  return (
    <Card className="w-full md:w-[900px] overflow-auto">
      <CardHeader>
        <div className="flex justify-between mb-4">
          <ArrowLeft className="cursor-pointer"
            onClick={() => router.push(paths.orderAll())} />
          <span className="flex gap-3 ml-auto">
            <ChevronLeft
              className={cn("cursor-pointer", !prevPage && "opacity-35")}
              onClick={() => prevPage && router.push(paths.orderShow(prevPage))} />
            <ChevronRight
              className={cn("cursor-pointer", !nextPage && "opacity-35")}
              onClick={() => nextPage && router.push(paths.orderShow(nextPage))} />
          </span>
        </div>
        <CardTitle className="">{title}</CardTitle>
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
          {children}
        </div>
      </CardContent>
    </Card>
  );
}

const dlStyles = "grid grid-cols-[150px_1fr] text-sm leading-7 px-4";