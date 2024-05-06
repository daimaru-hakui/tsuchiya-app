import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import Link from "next/link";

export default function OrderList() {

  const data = [
    {
      id: 1,
      section: '派遣社員',
      employeeCode: "123",
      initial: "T.D",
      username: "大丸 太郎",
      position: "係長",
      siteCode: "700008800000",
      siteName: "北広島IC電気室改築工事",
      zipCode: "0611279",
      address: "北海道北広島市大曲並木2丁目6-34",
      tel: "011-807-9071"
    },
    {
      id: 2,
      section: '派遣社員',
      employeeCode: "123",
      initial: "T.D",
      username: "大丸 太郎",
      position: "係長",
      siteCode: "700008800000",
      siteName: "北広島IC電気室改築工事",
      zipCode: "0611279",
      address: "北海道北広島市大曲並木2丁目6-34",
      tel: "011-807-9071"
    },
    {
      id: 3,
      section: '派遣社員',
      employeeCode: "123",
      initial: "T.D",
      username: "大丸 太郎",
      position: "係長",
      siteCode: "700008800000",
      siteName: "北広島IC電気室改築工事",
      zipCode: "0611279",
      address: "北海道北広島市大曲並木2丁目6-34",
      tel: "011-807-9071"
    },
  ];

  return (
    <Card className="w-full overflow-auto">
      <CardHeader >
        <div className="flex justify-between items-center">
          <CardTitle>発注一覧</CardTitle>
          <Button size='sm' asChild>
            <Link href="/orders/new">発注登録</Link>
          </Button>
        </div>
      </CardHeader>
      <CardContent className="overflow-auto">
        <Table className="min-w-[1500px]">
          <TableHeader>
            <TableRow>
              <TableHead>詳細</TableHead>
              <TableHead>発注No.</TableHead>
              <TableHead>所属名</TableHead>
              <TableHead>社員コード</TableHead>
              <TableHead >イニシャル</TableHead>
              <TableHead>氏名</TableHead>
              <TableHead>役職</TableHead>
              <TableHead>工事コード</TableHead>
              <TableHead>現場名 又は組織名</TableHead>
              <TableHead>郵便番号</TableHead>
              <TableHead>住所</TableHead>
              <TableHead>電話番号</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map(item => (
              <TableRow key={item.id}>
                <TableCell>
                  <Button size="xs" asChild>
                    <Link href={`/orders/${item.id}`}>詳細</Link>
                  </Button>
                </TableCell>
                <TableCell>{item.id}</TableCell>
                <TableCell>{item.section}</TableCell>
                <TableCell >{item.employeeCode}</TableCell>
                <TableCell>{item.initial}</TableCell>
                <TableCell>{item.username}</TableCell>
                <TableCell>{item.position}</TableCell>
                <TableCell>{item.siteCode}</TableCell>
                <TableCell>{item.siteName}</TableCell>
                <TableCell>{item.zipCode}</TableCell>
                <TableCell>{item.address}</TableCell>
                <TableCell>{item.tel}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card >
  );
}