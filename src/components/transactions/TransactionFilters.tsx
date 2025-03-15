
import { useState } from "react";
import { StaffMember } from "@/types/staff";
import { DateRange } from "react-day-picker";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { X, Filter, CalendarRange } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";

interface TransactionFiltersProps {
  staff: StaffMember[];
  selectedStaffId: string;
  setSelectedStaffId: (id: string) => void;
  dateRange: DateRange;
  setDateRange: (range: DateRange) => void;
  resetFilters: () => void;
}

const TransactionFilters = ({
  staff,
  selectedStaffId,
  setSelectedStaffId,
  dateRange,
  setDateRange,
  resetFilters,
}: TransactionFiltersProps) => {
  return (
    <div className="flex flex-wrap items-center gap-3 mt-2">
      {/* Staff Filter */}
      <div className="flex-1 min-w-[200px]">
        <Select
          value={selectedStaffId}
          onValueChange={setSelectedStaffId}
        >
          <SelectTrigger className="h-9">
            <SelectValue placeholder="Filter by staff" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all-staff">All Staff</SelectItem>
            {staff.map((s) => (
              <SelectItem key={s.id} value={s.id}>
                {s.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      {/* Date Range Filter */}
      <div className="flex-1 min-w-[200px]">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "h-9 w-full justify-start text-left font-normal",
                !dateRange.from && !dateRange.to && "text-muted-foreground"
              )}
            >
              <CalendarRange className="mr-2 h-4 w-4" />
              {dateRange.from ? (
                dateRange.to ? (
                  <>
                    {format(dateRange.from, "dd MMM yyyy")} -{" "}
                    {format(dateRange.to, "dd MMM yyyy")}
                  </>
                ) : (
                  format(dateRange.from, "dd MMM yyyy")
                )
              ) : (
                "Date range"
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              initialFocus
              mode="range"
              defaultMonth={dateRange.from}
              selected={dateRange}
              onSelect={(range) => setDateRange(range || { from: undefined, to: undefined })}
              numberOfMonths={2}
              className={cn("p-3 pointer-events-auto")}
            />
          </PopoverContent>
        </Popover>
      </div>
      
      {/* Reset Filters Button */}
      <Button
        variant="ghost"
        size="sm"
        className="h-9"
        onClick={resetFilters}
        disabled={!selectedStaffId && !dateRange.from && !dateRange.to}
      >
        <X className="mr-2 h-4 w-4" />
        Clear
      </Button>
    </div>
  );
};

export default TransactionFilters;
