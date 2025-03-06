
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { format, parse, isValid } from "date-fns";
import { useState, useEffect } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface AddHolidayFormProps {
  days: string;
  reason: string;
  startDate: Date;
  onDaysChange: (days: string) => void;
  onReasonChange: (reason: string) => void;
  onDateChange: (date: Date | undefined) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export const AddHolidayForm = ({
  days,
  reason,
  startDate,
  onDaysChange,
  onReasonChange,
  onDateChange,
  onSubmit,
}: AddHolidayFormProps) => {
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [dateInputValue, setDateInputValue] = useState<string>(() => {
    try {
      return startDate ? format(startDate, "dd-MM-yyyy") : "";
    } catch (error) {
      console.error('Error formatting initial date:', error);
      return "";
    }
  });

  useEffect(() => {
    // Update local date state when startDate prop changes
    if (startDate) {
      try {
        setDateInputValue(format(startDate, "dd-MM-yyyy"));
      } catch (error) {
        console.error('Error formatting date:', error);
      }
    }
  }, [startDate]);

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setDateInputValue(value);
    
    // Try to parse the input as a date
    if (value && /^\d{2}-\d{2}-\d{4}$/.test(value)) {
      try {
        const parsedDate = parse(value, "dd-MM-yyyy", new Date());
        if (isValid(parsedDate)) {
          console.log("Valid date parsed:", parsedDate);
          onDateChange(parsedDate);
        }
      } catch (error) {
        console.error("Error parsing date:", error);
      }
    } else if (value === "") {
      // If input is empty, don't automatically set to today's date
      console.log("Date input cleared");
    }
  };

  const handleCalendarSelect = (date: Date | undefined) => {
    if (date) {
      onDateChange(date);
      try {
        setDateInputValue(format(date, "dd-MM-yyyy"));
      } catch (e) {
        console.error("Error formatting selected date:", e);
      }
      setIsCalendarOpen(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="grid gap-4 py-4">
      <div className="space-y-2">
        <Label>Start Date</Label>
        <div className="flex gap-2">
          <Input
            type="text"
            value={dateInputValue}
            onChange={handleDateChange}
            placeholder="DD-MM-YYYY"
            className="w-full"
          />
          <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                type="button"
                className="w-10 p-0"
                onClick={() => setIsCalendarOpen(true)}
              >
                <CalendarIcon className="h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={startDate}
                onSelect={handleCalendarSelect}
                initialFocus
                className="pointer-events-auto"
              />
            </PopoverContent>
          </Popover>
        </div>
        <p className="text-xs text-muted-foreground">Start date is for information only</p>
      </div>
      <div className="space-y-2">
        <Label>Number of Days</Label>
        <Input
          type="number"
          placeholder="Number of days"
          value={days}
          onChange={(e) => onDaysChange(e.target.value)}
          min="1"
          required
        />
        <p className="text-xs text-muted-foreground">This directly determines the holiday duration</p>
      </div>
      <div className="space-y-2">
        <Label>Reason</Label>
        <Textarea
          placeholder="Reason for holiday"
          value={reason}
          onChange={(e) => onReasonChange(e.target.value)}
          required
        />
      </div>
      <Button type="submit">Add Holiday</Button>
    </form>
  );
};
