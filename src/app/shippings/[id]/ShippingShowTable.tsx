import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ShippingDetail } from "@/types/shipping.type";
import { useSession } from "next-auth/react";

interface Props {
  shippingDetails: ShippingDetail[];
  totalAmount: number;
}

export default function ShippingShowTable({
  shippingDetails,
  totalAmount,
}: Props) {
  const role = useSession().data?.user.role || "user";

  return (
    <div className="mt-4">
      <Table className="min-w-[900px]">
        <TableHeader>
          <TableRow>
            <TableHead className="min-w-[50px]">区分</TableHead>
            <TableHead className="min-w-[100px]">品番</TableHead>
            <TableHead className="min-w-[250px]">品名</TableHead>
            <TableHead className="text-center min-w-[90px]">サイズ</TableHead>
            <TableHead className="text-center min-w-[90px]">出荷数</TableHead>
            <TableHead className="text-center min-w-[90px]">単価</TableHead>
            <TableHead className="text-center min-w-[90px]">合計</TableHead>
            <TableHead className="text-center min-w-[90px]">股下</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {shippingDetails.map((item) => (
            <TableRow key={item.id}>
              <TableCell>{item.isStock && "在庫"}</TableCell>
              <TableCell>{item.productNumber}</TableCell>
              <TableCell>{item.productName}</TableCell>
              <TableCell className="text-center">{item.size}</TableCell>
              <TableCell className="text-right">{item.quantity}</TableCell>
              {role === "admin" || role === "member" ? (
                <>
                  <TableCell className="text-right">
                    {item.salePrice.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-right">
                    {(item.quantity * item.salePrice).toLocaleString()}
                  </TableCell>
                </>
              ) : (
                <>
                  <TableCell className="text-right">非公開</TableCell>
                  <TableCell className="text-right">非公開</TableCell>
                </>
              )}
              <TableCell className="text-right">
                {item?.inseam && `${item.inseam}cm`}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell className="font-bold" colSpan={6}>
              合計
            </TableCell>
            <TableCell className="text-right font-bold">
              {role === "admin" || role === "member"
                ? totalAmount.toLocaleString()
                : "非公開"}
            </TableCell>
            <TableCell colSpan={2}></TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </div>
  );
}
