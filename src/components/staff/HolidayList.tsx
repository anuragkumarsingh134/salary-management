
import { HolidayItem } from "./HolidayItem";

interface Holiday {
  id: string;
  start_date: string;
  end_date: string;
  reason: string;
}

interface HolidayListProps {
  holidays: Holiday[];
  onEdit: (holiday: Holiday) => void;
  onDelete: (id: string) => void;
}

export const HolidayList = ({ holidays, onEdit, onDelete }: HolidayListProps) => {
  if (holidays.length === 0) {
    return <p className="text-center text-muted-foreground py-4">No holidays found</p>;
  }

  return (
    <div className="space-y-4">
      {holidays.map((holiday) => (
        <HolidayItem
          key={holiday.id}
          holiday={holiday}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};
