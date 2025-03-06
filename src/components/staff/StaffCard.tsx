import { formatDistanceToNow } from "date-fns";
import { StaffMember } from "@/types/staff";
import { useIsMobile } from "@/hooks/use-mobile";

interface StaffCardProps {
  staff: StaffMember;
  onClick: () => void;
  isInactive?: boolean;
}

export const StaffCard = ({ staff, onClick, isInactive }: StaffCardProps) => {
  const isMobile = useIsMobile();
  
  return (
    <div
      className={`flex items-center justify-between rounded-lg ${
        isInactive ? 'bg-secondary/30' : 'bg-secondary/50 hover:bg-secondary/70'
      } transition-colors cursor-pointer ${isMobile ? 'p-3' : 'p-4'}`}
      onClick={onClick}
    >
      <div className={`flex items-center min-w-0 ${isMobile ? 'gap-2' : 'gap-4'}`}>
        <div className={`rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 ${isMobile ? 'w-8 h-8' : 'w-10 h-10'}`}>
          <span className={`font-semibold text-primary ${isMobile ? 'text-sm' : 'text-lg'}`}>
            {staff.name[0].toUpperCase()}
          </span>
        </div>
        <div className="min-w-0">
          <h3 className={`font-medium capitalize truncate ${isMobile ? 'text-sm' : 'text-base'}`}>{staff.name}</h3>
          <p className={`text-muted-foreground capitalize truncate ${isMobile ? 'text-xs' : 'text-sm'}`}>{staff.position}</p>
        </div>
      </div>
      <div className={`text-right flex-shrink-0 ${isMobile ? '' : 'ml-4'}`}>
        <p className={`font-medium whitespace-nowrap ${isMobile ? 'text-sm' : ''}`}>
          ₹{staff.salary.toLocaleString()}{!isMobile && '/month'}
        </p>
        <p className={`text-muted-foreground whitespace-nowrap ${isMobile ? 'text-xs' : 'text-sm'}`}>
          {isMobile ? formatDistanceToNow(new Date(staff.startDate)) : `Joined ${formatDistanceToNow(new Date(staff.startDate))} ago`}
        </p>
      </div>
    </div>
  );
};
