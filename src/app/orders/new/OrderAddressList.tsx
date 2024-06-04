import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import React, { useState } from "react";
import { addresses } from "@/utils/addresses";
import { UseFormSetValue } from "react-hook-form";
import { CreateOrder } from "@/types/order.type";

interface Address {
  code: string;
  name: string;
  zipCode: string;
  address: string;
  tel: string;
}

interface Props {
  setValue: UseFormSetValue<CreateOrder>;
}

export default function OrderAddressList({ setValue }: Props) {
  const [open, setOpen] = useState(false);

  const handleAddressSet = (data: Address) => {
    setValue("siteCode", data.code);
    setValue("siteName", data.name);
    setValue("zipCode", data.zipCode);
    setValue("address", data.address);
    setValue("tel", data.tel);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={() => setOpen(!open)}>
      <DialogTrigger asChild>
        <Button onClick={() => setOpen(true)} className="w-14">
          検索
        </Button>
      </DialogTrigger>
      <DialogContent className="min-w-full md:min-w-[600px] lg:min-w-[1200px] h-screen max-h-[calc(100vh-200px)]">
        <DialogHeader>
          <DialogTitle>住所一覧</DialogTitle>
        </DialogHeader>
        <Table className="min-w-[1100px]">
          <TableHeader>
            <TableRow>
              <TableHead className="w-[150px]">コード</TableHead>
              <TableHead className="w-[250px]">事業所名</TableHead>
              <TableHead>郵便番号</TableHead>
              <TableHead className="w-[500px]">住所</TableHead>
              <TableHead className="w-[200px]">TEL</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {addresses.map((address, idx) => (
              <TableRow
                key={address.code}
                onClick={() => handleAddressSet(address)}
                className="cursor-pointer"
              >
                <TableCell>{address.code}</TableCell>
                <TableCell>{address.name}</TableCell>
                <TableCell className="font-medium">{address.zipCode}</TableCell>
                <TableCell>{address.address}</TableCell>
                <TableCell>{address.tel}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <DialogFooter className="sm:justify-end">
          <Button
            type="button"
            variant="secondary"
            onClick={() => setOpen(false)}
          >
            閉じる
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
