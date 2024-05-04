import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3Icon } from "lucide-react";
import Link from "next/link";
import DashboardChart from "./dashboard-chart";

export default function DashboardStats() {
  return (
    <>
      <div className="grid lg:grid-cols-3 gap-4">
        <Card >
          <CardHeader className="pb-2">
            <CardTitle className="text-base">当月受注件数</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-between">
            <div className="text-5xl font-bold">38</div>
            <Button size='xs' asChild>
              <Link href="/">一覧へ</Link>
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">未出荷数</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-between">
            <div className="text-5xl font-bold">12</div>
            <Button size='xs' asChild>
              <Link href="/">一覧へ</Link>
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">当月購入金額</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-5xl font-bold">{(865900).toLocaleString()}円</div>
          </CardContent>
        </Card>
      </div>
      <Card className="my-4">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3Icon />
            <span className="text-base">月別購入金額チャート</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="pl-0">
          <DashboardChart />
        </CardContent>
      </Card>
    </>
  );
}