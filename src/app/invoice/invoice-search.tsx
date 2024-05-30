import CalendarInput from "@/components/carendar-input";
import { useStore } from "@/store";
import { format } from "date-fns";

export default function InvoiceSearch() {
  const invoiceStartDate = useStore((state) => state.invoiceStartDate);
  const setInvoiceStartDate = useStore((state) => state.setInvoiceStartDate);
  const invoiceEndDate = useStore((state) => state.invoiceEndDate);
  const setInvoiceEndDate = useStore((state) => state.setInvoiceEndDate);

  console.log(invoiceEndDate)
  console.log(new Date(invoiceEndDate))

  return (
    <div className="flex flex-col lg:flex-row gap-3">
      <CalendarInput date={invoiceStartDate} setDate={setInvoiceStartDate} title={"start"} />
      <CalendarInput date={invoiceEndDate} setDate={setInvoiceEndDate}  title={"end"} />
    </div>
  );
}