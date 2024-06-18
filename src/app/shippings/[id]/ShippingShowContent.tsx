import { CardContent } from "@/components/ui/card";
import useFunctons from "@/hooks/useFunctons";
import { cn } from "@/lib/utils";
import { Shipping } from "@/types/shipping.type";
import Link from "next/link";
import React from "react";

type Props = {
  shipping: Shipping;
};

export default function ShippingShowContent({ shipping }: Props) {
  const { getTrackingLink } = useFunctons();

  const getCourierName = (courier: string) => {
    switch (courier) {
      case "seino":
        return "西濃運輸";
      case "sagawa":
        return "佐川急便";
      case "fukuyama":
        return "福山通運";
    }
  };
  
  return (
    <>
      <div className="mb-6">
        <div className="p-3 flex bg-muted rounded-md lg:gap-12">
          <dl className={cn("grid grid-cols-[70px_1fr] w-[200px]")}>
            <dt className={cn(dtStyles)}>出荷No.</dt>
            <dd>{shipping.shippingNumber}</dd>
          </dl>
          <dl className={cn("grid grid-cols-[70px_1fr] w-[200px]")}>
            <dt className={cn(dtStyles)}>送状No.</dt>
            <dd>{shipping.trackingNumber}</dd>
          </dl>
          <dl className={cn("grid grid-cols-[70px_1fr] w-[200px]")}>
            <dt className={cn(dtStyles)}>運送便</dt>
            <dd>
              <Link
                href={`${getTrackingLink(
                  shipping.trackingNumber,
                  shipping.courier
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 underline"
              >
                {getCourierName(shipping.courier)}
              </Link>
            </dd>
          </dl>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2">
        <div>
          <dl className={cn(dlStyles)}>
            <dt className={cn(dtStyles)}>発注No.</dt>
            <dd>{shipping.orderNumber}</dd>
          </dl>
          <dl className={cn(dlStyles)}>
            <dt className={cn(dtStyles)}>所属名</dt>
            <dd>{shipping.section}</dd>
          </dl>
          <dl className={cn(dlStyles)}>
            <dt className={cn(dtStyles)}>社員コード</dt>
            <dd>{shipping.employeeCode}</dd>
          </dl>
          <dl className={cn(dlStyles)}>
            <dt className={cn(dtStyles)}>イニシャル</dt>
            <dd>{shipping.initial}</dd>
          </dl>
          <dl className={cn(dlStyles)}>
            <dt className={cn(dtStyles)}>会社刺繍</dt>
            <dd>{shipping.companyName ? "あり" : "-"}</dd>
          </dl>
          <dl className={cn(dlStyles)}>
            <dt className={cn(dtStyles)}>氏名</dt>
            <dd>{shipping.username}</dd>
          </dl>
          <dl className={cn(dlStyles)}>
            <dt className={cn(dtStyles)}>役職</dt>
            <dd>{shipping.position}</dd>
          </dl>
        </div>
        <div>
          <dl className={cn(dlStyles)}>
            <dt className={cn(dtStyles)}>工事コード</dt>
            <dd>{shipping.siteCode}</dd>
          </dl>
          <dl className={cn(dlStyles)}>
            <dt className={cn(dtStyles)}>現場名</dt>
            <dd>{shipping.siteName}</dd>
          </dl>
          <dl className={cn(dlStyles)}>
            <dt className={cn(dtStyles)}>郵便番号</dt>
            <dd>{shipping.zipCode}</dd>
          </dl>
          <dl className={cn(dlStyles)}>
            <dt className={cn(dtStyles)}>住所</dt>
            <dd>{shipping.address}</dd>
          </dl>
          <dl className={cn(dlStyles)}>
            <dt className={cn(dtStyles)}>TEL</dt>
            <dd>{shipping.tel}</dd>
          </dl>
          <dl className={cn(dlStyles)}>
            <dt className={cn(dtStyles)}>申請者</dt>
            <dd>{shipping.applicant}</dd>
          </dl>
        </div>
      </div>
    </>
  );
}

const dlStyles = "grid grid-cols-[100px_1fr] text-sm leading-7 px-4";
const dtStyles = "text-zinc-500 font-bold";
