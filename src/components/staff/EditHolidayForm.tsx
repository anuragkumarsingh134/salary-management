
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface EditHolidayFormProps {
  days: string;
  reason: string;
  onDaysChange: (days: string) => void;
  onReasonChange: (reason: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
}

export const EditHolidayForm = ({
  days,
  reason,
  onDaysChange,
  onReasonChange,
  onSubmit,
  onCancel,
}: EditHolidayFormProps) => {
  return (
    <form onSubmit={onSubmit} className="grid gap-4 py-4">
      <Input
        type="number"
        placeholder="Number of days"
        value={days}
        onChange={(e) => onDaysChange(e.target.value)}
        min="1"
        required
      />
      <Textarea
        placeholder="Reason for holiday"
        value={reason}
        onChange={(e) => onReasonChange(e.target.value)}
        required
      />
      <div className="flex gap-2">
        <Button type="submit">Update Holiday</Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
};
