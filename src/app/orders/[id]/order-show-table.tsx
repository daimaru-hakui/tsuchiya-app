"use client";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function OrderShowTable() {
  const data = [
    {
      id: 1,
      productNumber: '123-45',
      productName: "夏用上着",
      size: "S",
      quantity: 4,
      hem: 8,
      memo: ""
    },
    {
      id: 2,
      productNumber: '123-45',
      productName: "夏用上着",
      size: "S",
      quantity: 4,
      hem: 8,
      memo: ""
    }
  ];

  return (
    <Table className="min-w-[600px]">
      <TableHeader>
        <TableRow>
          <TableHead>品番</TableHead>
          <TableHead>品名</TableHead>
          <TableHead className="text-center w-[80px]">サイズ</TableHead>
          <TableHead className="text-center w-[80px]">数量</TableHead>
          <TableHead className="text-center w-[80px]">裾上げ</TableHead>
          <TableHead >備考</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map(item => (
          <TableRow key={item.id}>
            <TableCell>{item.productNumber}</TableCell>
            <TableCell >{item.productName}</TableCell>
            <TableCell className="text-center">{item.size}</TableCell>
            <TableCell className="text-right">{item.quantity}</TableCell>
            <TableCell className="text-right">{item?.hem}</TableCell>
            <TableCell>{item.memo}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}