
import { format } from "date-fns";
import { StaffMember } from "@/types/staff";
import { calculateSalaryDetails } from "@/utils/salaryCalculations";
import { RefreshCw, CalendarClock, List } from "lucide-react";
import { Button } from "@/components/ui/button";

interface StaffInfoProps {
  staff: StaffMember;
  totalTransactions: number;
  onViewTransactions?: () => void;
}

export const StaffInfo = ({ staff, totalTransactions, onViewTransactions }: StaffInfoProps) => {
  const salaryDetails = calculateSalaryDetails(staff.salary, staff.startDate);

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3">
        <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
          <span className="text-lg font-semibold text-gray-700">
            {staff.name[0]}
          </span>
        </div>
        <div>
          <h3 className="text-xl font-bold uppercase">{staff.name}</h3>
          <p className="text-gray-500 uppercase">{staff.position}</p>
        </div>
      </div>

      <div className="flex justify-end space-x-2">
        <Button variant="outline" size="sm">
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
        <Button variant="outline" size="sm" onClick={onViewTransactions}>
          <CalendarClock className="h-4 w-4 mr-2" />
          Transactions
        </Button>
        <Button variant="outline" size="sm">
          <List className="h-4 w-4 mr-2" />
          Manage Holidays
        </Button>
        <Button variant="outline" size="sm">
          <CalendarClock className="h-4 w-4 mr-2" />
          Add Holiday
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-sm text-gray-500">Monthly Salary</p>
          <p className="text-lg font-semibold">₹{staff.salary.toLocaleString()}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Total Transactions</p>
          <p className="text-lg font-semibold">₹{totalTransactions.toLocaleString()}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Working Days</p>
          <p className="text-lg font-semibold">{salaryDetails.daysWorked} days</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Holiday Days</p>
          <p className="text-lg font-semibold">15 days</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Daily Rate</p>
          <p className="text-lg font-semibold">₹{salaryDetails.dailyRate.toLocaleString()}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Total Earned</p>
          <p className="text-lg font-semibold">₹{salaryDetails.totalEarned.toLocaleString()}</p>
        </div>
      </div>
      
      <div>
        <p className="text-sm text-gray-500">Balance</p>
        {salaryDetails.totalEarned > totalTransactions ? (
          <p className="text-lg font-semibold text-green-600">
            Pending: ₹{(salaryDetails.totalEarned - totalTransactions).toLocaleString()}
          </p>
        ) : (
          <p className="text-lg font-semibold text-red-600">
            Advance: ₹{Math.abs(salaryDetails.totalEarned - totalTransactions).toLocaleString()}
          </p>
        )}
      </div>
      
      <p className="text-sm text-gray-500">
        Started {format(new Date(staff.startDate), "dd-MM-yyyy")}
      </p>
    </div>
  );
};
