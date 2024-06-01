import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import React from "react";

interface Props {
  title: string;
  quantity: number | string;
  children?: React.ReactNode;
}

export default function DashboardCard({ title, quantity, children }: Props) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">{title}</CardTitle>
      </CardHeader>
      <CardContent className="flex items-center justify-between">
        <div className="text-4xl sm:text-3xl 2xl:text-5xl font-bold">{quantity}</div>
        {children}
      </CardContent>
    </Card>
  );
}
