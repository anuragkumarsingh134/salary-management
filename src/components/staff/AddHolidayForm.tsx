
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { format, parse, isValid } from "date-fns";
import { useState, useEffect } from "react";

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
  const [dateInputValue, setDateInputValue] = useState<string>(
    startDate ? format(startDate, "dd-MM-yyyy") : ""
  );

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
          console.log("Valid date parsed:", parsedDate, "Original input:", value);
          onDateChange(parsedDate);
        } else {
          console.log("Invalid date format:", value);
        }
      } catch (error) {
        console.error("Error parsing date:", error, "Input value:", value);
      }
    } else if (value === "") {
      // If input is empty, don't automatically set to today's date
      console.log("Date input cleared");
      // We'll leave the date undefined until the user provides a valid value
    }
  };

  return (
    <form onSubmit={onSubmit} className="grid gap-4 py-4">
      <div className="space-y-2">
        <Label>Start Date</Label>
        <Input
          type="text"
          value={dateInputValue}
          onChange={handleDateChange}
          placeholder="DD-MM-YYYY"
        />
        <p className="text-xs text-muted-foreground">Format: DD-MM-YYYY</p>
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
      </div>
      <Textarea
        placeholder="Reason for holiday"
        value={reason}
        onChange={(e) => onReasonChange(e.target.value)}
        required
      />
      <Button type="submit">Add Holiday</Button>
    </form>
  );
};
