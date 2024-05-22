import CalendarInput from "@/components/carendar-input";
import { useStore } from "@/store";

export default function InvoiceSearch() {
  const orderStartDate = useStore((state) => state.orderStartDate);
  const setOrderStartDate = useStore((state) => state.setOrderStartDate);
  const orderEndDate = useStore((state) => state.orderEndDate);
  const setOrderEndDate = useStore((state) => state.setOrderEndDate);

  return (
    <div className="flex flex-col lg:flex-row gap-3">
      <CalendarInput date={orderStartDate} setDate={setOrderStartDate} />
      <CalendarInput date={orderEndDate} setDate={setOrderEndDate} />
    </div>
  );
}