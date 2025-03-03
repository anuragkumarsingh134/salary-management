
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { format, parse, isValid } from "date-fns";

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
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    
    if (value) {
      try {
        const parsedDate = parse(value, "dd-MM-yyyy", new Date());
        if (isValid(parsedDate)) {
          console.log("Valid date parsed:", parsedDate);
          onDateChange(parsedDate);
        } else {
          console.log("Invalid date format");
        }
      } catch (error) {
        console.error("Error parsing date:", error);
      }
    } else {
      // If input is empty, we'll use the current date
      onDateChange(new Date());
    }
  };

  return (
    <form onSubmit={onSubmit} className="grid gap-4 py-4">
      <div className="space-y-2">
        <Label>Start Date</Label>
        <Input
          value={format(startDate, "dd-MM-yyyy")}
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
