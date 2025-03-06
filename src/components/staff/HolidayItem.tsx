
import { Button } from "@/components/ui/button";
import { format, parseISO, differenceInDays } from "date-fns";
import { Pencil, Trash } from "lucide-react";

interface Holiday {
  id: string;
  start_date: string;
  end_date: string;
  reason: string;
}

interface HolidayItemProps {
  holiday: Holiday;
  onEdit: (holiday: Holiday) => void;
  onDelete: (id: string) => void;
}

export const HolidayItem = ({ holiday, onEdit, onDelete }: HolidayItemProps) => {
  // Calculate days correctly based on start and end date
  const startDate = parseISO(holiday.start_date);
  const endDate = parseISO(holiday.end_date);
  const days = Math.abs(differenceInDays(startDate, endDate)) + 1;
  
  return (
    <div className="flex items-center justify-between p-4 rounded-lg border">
      <div>
        <p className="font-medium">
          {days} days
        </p>
        <p className="text-sm text-muted-foreground">{holiday.reason}</p>
        <p className="text-xs text-muted-foreground">
          From: {format(parseISO(holiday.start_date), "dd-MM-yyyy")}
        </p>
      </div>
      <div className="flex gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onEdit(holiday)}
        >
          <Pencil className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onDelete(holiday.id)}
        >
          <Trash className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};
