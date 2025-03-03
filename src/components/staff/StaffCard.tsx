
import { format } from "date-fns";
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
        isInactive ? 'bg-gray-100' : 'bg-gray-50 hover:bg-gray-100'
      } transition-colors cursor-pointer`}
      onClick={onClick}
    >
      <div className="flex items-center space-x-4">
        <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
          <span className="text-lg font-semibold text-gray-700">
            {staff.name[0]}
          </span>
        </div>
        <div>
          <h3 className="font-semibold">{staff.name}</h3>
          <p className="text-sm text-gray-500 uppercase">{staff.position}</p>
        </div>
      </div>
      <div className="text-right">
        <p className="font-semibold">₹{staff.salary.toLocaleString()}/month</p>
        <p className="text-sm text-gray-500">
          Started {format(new Date(staff.startDate), "dd-MM-yyyy")}
        </p>
      </div>
    </div>
  );
};
