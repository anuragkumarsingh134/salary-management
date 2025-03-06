
import { formatDistanceToNow } from "date-fns";
import { StaffMember } from "@/types/staff";

interface StaffCardProps {
  staff: StaffMember;
  onClick: () => void;
  isInactive?: boolean;
}

export const StaffCard = ({ staff, onClick, isInactive }: StaffCardProps) => {
  return (
    <div
      className={`flex items-center justify-between p-3 rounded-lg ${
        isInactive ? 'bg-secondary/30' : 'bg-secondary/50 hover:bg-secondary/70'
      } transition-colors cursor-pointer gap-2`}
      onClick={onClick}
    >
      <div className="flex items-center gap-2 min-w-0">
        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
          <span className="text-sm font-semibold text-primary">
            {staff.name[0].toUpperCase()}
          </span>
        </div>
        <div className="min-w-0">
          <h3 className="font-medium text-sm capitalize truncate">{staff.name}</h3>
          <p className="text-xs text-muted-foreground capitalize truncate">{staff.position}</p>
        </div>
      </div>
      <div className="text-right flex-shrink-0">
        <p className="font-medium text-sm whitespace-nowrap">₹{staff.salary.toLocaleString()}</p>
        <p className="text-xs text-muted-foreground whitespace-nowrap">
          {formatDistanceToNow(new Date(staff.startDate))}
        </p>
      </div>
    </div>
  );
};
