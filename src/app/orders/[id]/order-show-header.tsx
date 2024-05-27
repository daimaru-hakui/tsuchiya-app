import { cn } from "@/lib/utils";
import { Order } from "@/types/order.type";
import React from "react";

interface Props {
    order:Order
}

export default function OrderShowHeader({order}:Props) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2">
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
  );
}

const dlStyles = "grid grid-cols-[100px_1fr] text-sm leading-7 px-4";
const dtStyles = "text-zinc-500 font-bold";
