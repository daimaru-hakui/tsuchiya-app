import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ShippingDetail } from "@/types";

interface Props {
  shippingDetails: ShippingDetail[];
}

export default function ShippingShowTable({ shippingDetails }: Props) {
  return (
    <Table className="min-w-[600px]">
      <TableHeader>
        <TableRow>
          <TableHead>品番</TableHead>
          <TableHead>品名</TableHead>
          <TableHead className="text-center w-[80px]">サイズ</TableHead>
          <TableHead className="text-center w-[90px]">出荷注数</TableHead>
          <TableHead className="text-center w-[90px]">単価</TableHead>
          <TableHead className="text-center w-[80px]">股下</TableHead>
          <TableHead>備考</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {shippingDetails.map((item) => (
          <TableRow key={item.id}>
            <TableCell>{item.productNumber}</TableCell>
            <TableCell>{item.productName}</TableCell>
            <TableCell className="text-center">{item.size}</TableCell>
            <TableCell className="text-right">{item.quantity || "完納"}</TableCell>
            <TableCell className="text-right">{(item.salePrice).toLocaleString()}</TableCell>
            <TableCell className="text-right">
              {item?.inseam && `${item.inseam}cm`}
            </TableCell>
            <TableCell className="text-right">{item?.memo}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}