"use client";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { OrderDetail } from "@/types";

interface Props {
  orderDetails: (OrderDetail & { stock: number })[];
}

export default function OrderShowTable({ orderDetails }: Props) {
  
  const totalAmount = () => {
    const total = orderDetails.reduce(
      (sum: number, detail: { orderQuantity: number; salePrice: number }) =>
        (sum = sum + detail.orderQuantity * detail.salePrice),
      0
    );
    return total.toLocaleString();
  };

  return (
    <Table className="min-w-[1000px]">
      <TableHeader>
        <TableRow>
          <TableHead className="min-w-[150px]">品番</TableHead>
          <TableHead className="min-w-[250px]">品名</TableHead>
          <TableHead className="text-center min-w-[90px]">サイズ</TableHead>
          <TableHead className="text-center min-w-[90px]">発注数</TableHead>
          <TableHead className="text-center min-w-[100px]">未出荷数</TableHead>
          <TableHead className="text-center w-[90px]">価格</TableHead>
          <TableHead className="w-[100px]">合計</TableHead>
          <TableHead className="text-center min-w-[90px]">股下</TableHead>
          <TableHead className="min-w-[200px]">備考</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {orderDetails.map((item) => (
          <TableRow key={item.id}>
            <TableCell>{item.productNumber}</TableCell>
            <TableCell>{item.productName}</TableCell>
            <TableCell className="text-center">{item.size}</TableCell>
            <TableCell className="text-right">{item.orderQuantity}</TableCell>
            <TableCell className="text-right">
              {item.quantity ? `( ${item.quantity} )` : "完納"}
            </TableCell>
            <TableCell className="text-right">
              {item.salePrice.toLocaleString()}
            </TableCell>
            <TableCell className="text-right">
              {(item.salePrice * item.orderQuantity).toLocaleString()}
            </TableCell>
            <TableCell className="text-right">
              {item?.inseam && `${item.inseam}cm`}
            </TableCell>
            <TableCell className="text-right">{item?.memo}</TableCell>
          </TableRow>
        ))}
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell className="w-full" colSpan={6}>
            合計
          </TableCell>
          <TableCell className="text-right">{totalAmount()}</TableCell>
          <TableCell colSpan={2}></TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  );
}
