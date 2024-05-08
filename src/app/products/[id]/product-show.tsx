import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import React from "react";
import ProductShowTable from "./product-show-table";

interface Props {
  id: string;
}

export default function ProductShow({ id }: Props) {
  
  return (
    <Card className="w-full md:w-[450px]">
      <CardHeader>
        <CardTitle>詳細</CardTitle>
      </CardHeader>
      <CardContent>
        <ProductShowTable id={id} />
      </CardContent>
    </Card>
  );
}
