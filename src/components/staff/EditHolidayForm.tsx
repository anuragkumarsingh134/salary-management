
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

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
  return (
    <form onSubmit={onSubmit} className="grid gap-4 py-4">
      <div className="grid gap-2">
        <label htmlFor="startDate" className="text-sm font-medium">
          Start Date
        </label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-full justify-start text-left font-normal",
                !startDate && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {startDate ? format(startDate, "dd-MM-yyyy") : "Select date"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={startDate}
              onSelect={onDateChange}
              initialFocus
            />
          </PopoverContent>
        </Popover>
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
