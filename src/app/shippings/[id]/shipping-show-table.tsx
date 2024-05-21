import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import useFunctons from "@/hooks/useFunctons";
import { ShippingDetail } from "@/types";

interface Props {
  shippingDetails: ShippingDetail[];
}

export default function ShippingShowTable({ shippingDetails }: Props) {

  const totalAmount = () => {
    const total = shippingDetails.reduce(
      (sum: number, detail: { quantity: number; salePrice: number }) =>
        (sum = sum + detail.quantity * detail.salePrice),
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
          <TableHead className="text-center min-w-[90px]">出荷注数</TableHead>
          <TableHead className="text-center min-w-[90px]">単価</TableHead>
          <TableHead className="text-center min-w-[90px]">合計</TableHead>
          <TableHead className="text-center min-w-[80px]">股下</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {shippingDetails.map((item) => (
          <TableRow key={item.id}>
            <TableCell>{item.productNumber}</TableCell>
            <TableCell>{item.productName}</TableCell>
            <TableCell className="text-center">{item.size}</TableCell>
            <TableCell className="text-right">
              {item.quantity || "完納"}
            </TableCell>
            <TableCell className="text-right">
              {item.salePrice.toLocaleString()}
            </TableCell>
            <TableCell className="text-right">
              {(item.quantity * item.salePrice).toLocaleString()}
            </TableCell>
            <TableCell className="text-right">
              {item?.inseam && `${item.inseam}cm`}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell className="font-bold" colSpan={5}>
            合計
          </TableCell>
          <TableCell className="text-right font-bold">
            {totalAmount()}
          </TableCell>
          <TableCell colSpan={2}></TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  );
}
