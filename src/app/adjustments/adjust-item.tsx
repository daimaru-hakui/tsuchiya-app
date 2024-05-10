import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Product } from "@/types";
import React from "react";

interface Props {
  product: Product;
}

export default function AdjustItem({ product }: Props) {
  return (
    <Card className="md:max-w-[300px]">
      <CardHeader>
        <CardTitle>{product.productNumber}</CardTitle>
        <CardDescription>{product.productName}</CardDescription>
      </CardHeader>
      {/* <CardContent></CardContent> */}
      <CardFooter className="flex justify-end">
        <Button>選択</Button>
      </CardFooter>
    </Card>
  );
}
