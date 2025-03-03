
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface AddHolidayFormProps {
  days: string;
  reason: string;
  onDaysChange: (days: string) => void;
  onReasonChange: (reason: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export const AddHolidayForm = ({
  days,
  reason,
  onDaysChange,
  onReasonChange,
  onSubmit,
}: AddHolidayFormProps) => {
  return (
    <form onSubmit={onSubmit} className="grid gap-4 py-4">
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
