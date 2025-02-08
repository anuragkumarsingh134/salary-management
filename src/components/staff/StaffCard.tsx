
import { formatDistanceToNow } from "date-fns";
import { StaffMember } from "@/store/staffStore";

interface StaffCardProps {
  staff: StaffMember;
  onClick: () => void;
}

export const StaffCard = ({ staff, onClick }: StaffCardProps) => {
  return (
    <div
      className="flex items-center justify-between p-4 rounded-lg bg-secondary/50 hover:bg-secondary/70 transition-colors cursor-pointer"
      onClick={onClick}
    >
      <div className="flex items-center space-x-4">
        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
          <span className="text-lg font-semibold text-primary">
            {staff.name[0]}
          </span>
        </div>
        <div>
          <h3 className="font-medium">{staff.name}</h3>
          <p className="text-sm text-muted-foreground">{staff.position}</p>
        </div>
      </div>
      <div className="text-right">
        <p className="font-medium">₹{staff.salary.toLocaleString()}/month</p>
        <p className="text-sm text-muted-foreground">
          Joined {formatDistanceToNow(new Date(staff.startDate))} ago
        </p>
      </div>
    </div>
  );
};
