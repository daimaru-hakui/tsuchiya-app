import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { FormControl } from "@/components/ui/form";
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
import { format, subMonths } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useState } from "react";

export default function OrderSearch() {
  const statusSearch = useStore(state => state.statusSearch);
  const setStatusSearch = useStore(state => state.setStatusSearch);
  const thisYear = new Date().getFullYear();
  const thisMonth = new Date().getMonth();
  const [startDate, setStartDate] = useState<Date | undefined>(subMonths(new Date(thisYear, thisMonth, 1), 3));
  const [startOpen, setStartOpen] = useState(false);
  const [endDate, setEndDate] = useState<Date | undefined>(new Date());
  const [endOpen, setEndOpen] = useState(false);

  return (
    <div className="flex gap-3">
      <Select onValueChange={(e) => setStatusSearch(e)}>
        <SelectTrigger className="w-[150px]">
          <SelectValue placeholder={statusSearch} />
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
              !startDate && "text-muted-foreground"
            )}
          >
            {startDate ? (
              `start: ${format(startDate, "yyyy-MM-dd")}`
            ) : (
              <span>{startDate}</span>
            )}
            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            numberOfMonths={1}
            selected={startDate}
            onSelect={setStartDate}
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
              !endDate && "text-muted-foreground"
            )}
          >
            {endDate ? (
              `end: ${format(endDate, "yyyy-MM-dd")}`
            ) : (
              <span>{endDate}</span>
            )}
            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            numberOfMonths={1}
            selected={endDate}
            onSelect={setEndDate}
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