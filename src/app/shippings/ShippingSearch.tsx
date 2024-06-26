import CalendarInput from "@/components/carendar-input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useStore } from "@/store";

export default function ShippingSearch() {
  const shippingStatus = useStore((state) => state.shippingStatus);
  const setShippingStatus = useStore(
    (state) => state.setShippingStatus
  );
  const shippingStartDate = useStore((state) => state.shippingStartDate);
  const setShippingStartDate = useStore((state) => state.setShippingStartDate);
  const shippingEndDate = useStore((state) => state.shippingEndDate);
  const setShippingEndDate = useStore((state) => state.setShippingEndDate);

  const statusLabel = (value: string) => {
    switch (value) {
      case "all":
        return "全て";
      case "picking":
        return "出荷準備中";
      case "finished":
        return "完了";
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-3">
      <Select onValueChange={(e) => setShippingStatus(e)}>
        <SelectTrigger className="w-[150px]">
          <SelectValue placeholder={statusLabel(shippingStatus)} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">全て</SelectItem>
          <SelectItem value="picking">出荷準備中</SelectItem>
          <SelectItem value="finished">完了</SelectItem>
        </SelectContent>
      </Select>
      <CalendarInput
        date={shippingStartDate}
        setDate={setShippingStartDate}
        title="start"
      />
      <CalendarInput
        date={shippingEndDate}
        setDate={setShippingEndDate}
        title="end"
      />
    </div>
  );
}
