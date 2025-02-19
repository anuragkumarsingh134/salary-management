
import { formatDistanceToNow } from "date-fns";
import { StaffMember } from "@/types/staff";
import { calculateSalaryDetails } from "@/utils/salaryCalculations";

interface StaffInfoProps {
  staff: StaffMember;
  totalTransactions: number;
}

export const StaffInfo = ({ staff, totalTransactions }: StaffInfoProps) => {
  const salaryDetails = calculateSalaryDetails(staff.salary, staff.startDate);

  return (
    <div className="grid gap-2">
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
          <span className="text-lg font-semibold text-primary">
            {staff.name[0]}
          </span>
        </div>
        <div>
          <h3 className="text-lg font-semibold">{staff.name}</h3>
          <p className="text-sm text-muted-foreground">{staff.position}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 mt-2">
        <div className="p-2 rounded-lg bg-secondary/30">
          <p className="text-xs text-muted-foreground">Monthly Salary</p>
          <p className="text-sm font-semibold">₹{staff.salary.toLocaleString()}</p>
        </div>
        <div className="p-2 rounded-lg bg-secondary/30">
          <p className="text-xs text-muted-foreground">Total Transactions</p>
          <p className="text-sm font-semibold">₹{totalTransactions.toLocaleString()}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div className="p-2 rounded-lg bg-secondary/30">
          <p className="text-xs text-muted-foreground">Days Worked</p>
          <p className="text-sm font-semibold">{salaryDetails.daysWorked} days</p>
        </div>
        <div className="p-2 rounded-lg bg-secondary/30">
          <p className="text-xs text-muted-foreground">Daily Rate</p>
          <p className="text-sm font-semibold">₹{salaryDetails.dailyRate.toLocaleString()}</p>
        </div>
        <div className="p-2 rounded-lg bg-secondary/30">
          <p className="text-xs text-muted-foreground">Total Earned</p>
          <p className="text-sm font-semibold">₹{salaryDetails.totalEarned.toLocaleString()}</p>
        </div>
        <div className="p-2 rounded-lg bg-secondary/30">
          <p className="text-xs text-muted-foreground">Balance</p>
          <p className="text-sm font-semibold">
            {salaryDetails.totalEarned > totalTransactions ? (
              <span className="text-green-600">
                Pending: ₹{(salaryDetails.totalEarned - totalTransactions).toLocaleString()}
              </span>
            ) : (
              <span className="text-red-600">
                Advance: ₹{Math.abs(salaryDetails.totalEarned - totalTransactions).toLocaleString()}
              </span>
            )}
          </p>
        </div>
      </div>
      {staff.startDate && (
        <p className="text-xs text-muted-foreground">
          Started {formatDistanceToNow(new Date(staff.startDate))} ago
        </p>
      )}
    </div>
  );
};
