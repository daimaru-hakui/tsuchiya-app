import CalendarInput from "@/components/carendar-input";
import { useStore } from "@/store";

export default function InvoiceSearch() {
  const invoiceStartDate = useStore((state) => state.invoiceStartDate);
  const setInvoiceStartDate = useStore((state) => state.setInvoiceStartDate);
  const invoiceEndDate = useStore((state) => state.invoiceEndDate);
  const setInvoiceEndDate = useStore((state) => state.setInvoiceEndDate);

  return (
    <div className="flex flex-col lg:flex-row gap-3">
      <CalendarInput date={invoiceStartDate} setDate={setInvoiceStartDate} />
      <CalendarInput date={invoiceEndDate} setDate={setInvoiceEndDate} />
    </div>
  );
}