
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
      className={`flex items-center justify-between p-4 rounded-lg ${
        isInactive ? 'bg-secondary/30' : 'bg-secondary/50 hover:bg-secondary/70'
      } transition-colors cursor-pointer`}
      onClick={onClick}
    >
      <div className="flex items-center space-x-4">
        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
          <span className="text-lg font-semibold text-primary">
            {staff.name[0].toUpperCase()}
          </span>
        </div>
        <div className="min-w-0">
          <h3 className="font-medium text-base capitalize truncate">{staff.name}</h3>
          <p className="text-sm text-muted-foreground capitalize">{staff.position}</p>
        </div>
      </div>
      <div className="text-right flex-shrink-0 ml-4">
        <p className="font-medium whitespace-nowrap">₹{staff.salary.toLocaleString()}/month</p>
        <p className="text-sm text-muted-foreground whitespace-nowrap">
          Joined {formatDistanceToNow(new Date(staff.startDate))} ago
        </p>
      </div>
    </div>
  );
};
