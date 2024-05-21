import React, { useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "./ui/calendar";
import { format } from "date-fns";

interface Props {
  date: Date;
  setDate: (date: Date | undefined) => void;
}

export default function CalendarInput({ date, setDate }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <Popover
      open={open}
      onOpenChange={() => {
        setOpen(!open);
      }}
    >
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-[240px] pl-3 text-left font-normal",
            !date && "text-muted-foreground"
          )}
        >
          {date ? (
            `start: ${format(date, "yyyy-MM-dd")}`
          ) : (
            <span>{date}</span>
          )}
          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          numberOfMonths={1}
          selected={date}
          onSelect={setDate}
          initialFocus
        />
        <div className="w-full text-center">
          <Button
            size="xs"
            variant="outline"
            className="mb-2"
            onClick={() => setOpen(!open)}
          >
            閉じる
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
