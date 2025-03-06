
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface EditHolidayFormProps {
  days: string;
  reason: string;
  startDate: Date;
  onDaysChange: (days: string) => void;
  onReasonChange: (reason: string) => void;
  onDateChange: (date: Date | undefined) => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
}

export const EditHolidayForm = ({
  days,
  reason,
  startDate,
  onDaysChange,
  onReasonChange,
  onDateChange,
  onSubmit,
  onCancel,
}: EditHolidayFormProps) => {
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [dateString, setDateString] = useState(format(startDate, "dd-MM-yyyy"));

  const handleManualDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDateString(e.target.value);
    
    // Try to parse the manually entered date
    try {
      const parts = e.target.value.split('-');
      if (parts.length === 3) {
        const day = parseInt(parts[0], 10);
        const month = parseInt(parts[1], 10) - 1; // Month is 0-indexed in JS Date
        const year = parseInt(parts[2], 10);
        
        if (!isNaN(day) && !isNaN(month) && !isNaN(year)) {
          const newDate = new Date(year, month, day);
          if (newDate.toString() !== "Invalid Date") {
            onDateChange(newDate);
          }
        }
      }
    } catch (error) {
      console.error("Error parsing date:", error);
    }
  };

  const handleCalendarSelect = (date: Date | undefined) => {
    if (date) {
      onDateChange(date);
      setDateString(format(date, "dd-MM-yyyy"));
      setIsCalendarOpen(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="grid gap-4 py-4">
      <div className="grid gap-2">
        <label htmlFor="startDate" className="text-sm font-medium">
          Start Date
        </label>
        <div className="flex gap-2">
          <Input
            id="startDate"
            type="text"
            placeholder="DD-MM-YYYY"
            value={dateString}
            onChange={handleManualDateChange}
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
            <PopoverContent className="w-auto p-0">
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
      
      <div className="grid gap-2">
        <label htmlFor="days" className="text-sm font-medium">
          Number of days
        </label>
        <Input
          id="days"
          type="number"
          placeholder="Number of days"
          value={days}
          onChange={(e) => onDaysChange(e.target.value)}
          min="1"
          required
        />
        <p className="text-xs text-muted-foreground">This directly determines the holiday duration</p>
      </div>
      
      <div className="grid gap-2">
        <label htmlFor="reason" className="text-sm font-medium">
          Reason
        </label>
        <Textarea
          id="reason"
          placeholder="Reason for holiday"
          value={reason}
          onChange={(e) => onReasonChange(e.target.value)}
          required
        />
      </div>
      
      <div className="flex gap-2">
        <Button type="submit">Update Holiday</Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
};
