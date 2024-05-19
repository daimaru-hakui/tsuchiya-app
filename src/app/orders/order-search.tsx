import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { useStore } from "@/store";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useEffect, useState } from "react";

export default function OrderSearch() {
  const statusSearch = useStore(state => state.statusSearch);
  const setStatusSearch = useStore(state => state.setStatusSearch);
  const [startOpen, setStartOpen] = useState(false);
  const [endOpen, setEndOpen] = useState(false);
  const orderStartDate = useStore((state) => state.orderStartDate);
  const setOrderStartDate = useStore((state) => state.setOrderStartDate);
  const orderEndDate = useStore((state) => state.orderEndDate);
  const setOrderEndDate = useStore((state) => state.setOrderEndDate);

  const statusLabel = (value: string) => {
    switch (value) {
      case "all":
        return "All";
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
    <div className="flex gap-3">
      <Select onValueChange={(e) => setStatusSearch(e)}>
        <SelectTrigger className="w-[150px]">
          <SelectValue placeholder={statusLabel(statusSearch)} />
        </SelectTrigger>
        <SelectContent >
          <SelectItem value="all">All</SelectItem>
          <SelectItem value="pending">未処理</SelectItem>
          <SelectItem value="processing">処理中</SelectItem>
          <SelectItem value="openOrder">注文残</SelectItem>
          <SelectItem value="finished">完納</SelectItem>
        </SelectContent>
      </Select>
      <Popover
        open={startOpen}
        onOpenChange={() => {
          setStartOpen(!startOpen);
        }}
      >
        <PopoverTrigger asChild>
          <Button
            variant={"outline"}
            className={cn(
              "w-[240px] pl-3 text-left font-normal",
              !orderStartDate && "text-muted-foreground"
            )}
          >
            {orderStartDate ? (
              `start: ${format(orderStartDate, "yyyy-MM-dd")}`
            ) : (
              <span>{orderStartDate}</span>
            )}
            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            numberOfMonths={1}
            selected={orderStartDate}
            onSelect={setOrderStartDate}
            initialFocus
          />
          <div className="w-full text-center">
            <Button
              size="xs"
              variant="outline"
              className="mb-2"
              onClick={() => setStartOpen(!startOpen)}
            >
              閉じる
            </Button>
          </div>
        </PopoverContent>
      </Popover>
      <Popover
        open={endOpen}
        onOpenChange={() => {
          setEndOpen(!endOpen);
        }}
      >
        <PopoverTrigger asChild>
          <Button
            variant={"outline"}
            className={cn(
              "w-[240px] pl-3 text-left font-normal",
              !orderEndDate && "text-muted-foreground"
            )}
          >
            {orderEndDate ? (
              `end: ${format(orderEndDate, "yyyy-MM-dd")}`
            ) : (
              <span>{orderEndDate}</span>
            )}
            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            numberOfMonths={1}
            selected={orderEndDate}
            onSelect={setOrderEndDate}
            initialFocus
          />
          <div className="w-full text-center">
            <Button
              size="xs"
              variant="outline"
              className="mb-2"
              onClick={() => setEndOpen(!endOpen)}
            >
              閉じる
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}