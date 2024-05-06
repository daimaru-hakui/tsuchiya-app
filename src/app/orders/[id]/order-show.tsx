"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import OrderShowTable from "./order-show-table";
import { ArrowLeft, ChevronLeft, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";

export default function OrderShow() {
  const router = useRouter();

  const handlePageBack = () => {
    router.back();
  };

  return (
    <Card className="w-full md:w-[800px] overflow-auto">
      <CardHeader>
        <div className="flex justify-between mb-4">
          <ArrowLeft className="cursor-pointer" onClick={handlePageBack} />
          <span className="flex gap-3 ml-auto">
            <ChevronLeft className="cursor-pointer" />
            <ChevronRight className="cursor-pointer" />
          </span>
        </div>
        <CardTitle className="">詳細ページ</CardTitle>
      </CardHeader>
      <CardContent>
        <div>
          <div className={cn(dlStyles)}>
            <div>発注No.</div><div>1</div>
          </div>
          <div className={cn(dlStyles)}>
            <div>所属名</div><div>派遣社員</div>
          </div>
          <div className={cn(dlStyles)}>
            <div>社員コード</div><div>123</div>
          </div>
          <div className={cn(dlStyles)}>
            <div>イニシャル</div><div>T.D</div>
          </div>
          <div className={cn(dlStyles)}>
            <div>氏名</div><div>大丸 太郎</div>
          </div>
          <div className={cn(dlStyles)}>
            <div>役職</div><div>係長</div>
          </div>
        </div>
        <div className="mt-4">
          <OrderShowTable />
        </div>
      </CardContent>
    </Card>
  );
}

const dlStyles = "grid grid-cols-[150px_1fr] text-sm leading-7 px-4";