import CalendarInput from "@/components/carendar-input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useStore } from "@/store";

export default function OrderSearch() {
  const statusSearch = useStore((state) => state.statusSearch);
  const setStatusSearch = useStore((state) => state.setStatusSearch);
  const orderStartDate = useStore((state) => state.orderStartDate);
  const setOrderStartDate = useStore((state) => state.setOrderStartDate);
  const orderEndDate = useStore((state) => state.orderEndDate);
  const setOrderEndDate = useStore((state) => state.setOrderEndDate);

  const statusLabel = (value: string) => {
    switch (value) {
      case "all":
        return "全て";
      case "openOrder":
        return "注文残";
      case "pending":
        return "未処理";
      case "processing":
        return "処理中";
      case "finished":
        return "完納";
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-3">
      <Select onValueChange={(e) => setStatusSearch(e)}>
        <SelectTrigger className="w-[150px]">
          <SelectValue placeholder={statusLabel(statusSearch)} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">全て</SelectItem>
          <SelectItem value="pending">未処理</SelectItem>
          <SelectItem value="processing">処理中</SelectItem>
          <SelectItem value="openOrder">注文残</SelectItem>
          <SelectItem value="finished">完納</SelectItem>
        </SelectContent>
      </Select>
      <CalendarInput
        date={orderStartDate}
        setDate={setOrderStartDate}
        title="start"
      />
      <CalendarInput
        date={orderEndDate}
        setDate={setOrderEndDate}
        title="end"
      />
    </div>
  );
}
