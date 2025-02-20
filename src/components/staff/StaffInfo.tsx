
import { formatDistanceToNow, format } from "date-fns";
import { useState, useEffect } from "react";
import { StaffMember } from "@/types/staff";
import { calculateSalaryDetails } from "@/utils/salaryCalculations";
import { Button } from "@/components/ui/button";
import { Calendar, List, RefreshCw } from "lucide-react";
import { AddHolidayDialog } from "./AddHolidayDialog";
import { ManageHolidaysDialog } from "./ManageHolidaysDialog";
import { useToast } from "@/components/ui/use-toast";

interface StaffInfoProps {
  staff: StaffMember;
  totalTransactions: number;
}

export const StaffInfo = ({ staff, totalTransactions }: StaffInfoProps) => {
  const [addHolidayOpen, setAddHolidayOpen] = useState(false);
  const [manageHolidaysOpen, setManageHolidaysOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { toast } = useToast();
  const [salaryDetails, setSalaryDetails] = useState({
    daysWorked: 0,
    dailyRate: staff.salary / 30,
    totalEarned: 0,
    holidayDays: 0
  });

  const fetchSalaryDetails = async () => {
    const details = await calculateSalaryDetails(staff.salary, staff.startDate, staff.id);
    setSalaryDetails(details);
  };

  useEffect(() => {
    fetchSalaryDetails();
  }, [staff.salary, staff.startDate, staff.id]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await fetchSalaryDetails();
      toast({
        title: "Data Refreshed",
        description: "Staff information has been updated.",
      });
    } catch (error) {
      toast({
        title: "Refresh Failed",
        description: "Failed to refresh staff information.",
        variant: "destructive",
      });
    } finally {
      setIsRefreshing(false);
    }
  };

  return (
    <div className="grid gap-2">
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
          <span className="text-lg font-semibold text-primary">
            {staff.name[0]}
          </span>
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold">{staff.name}</h3>
          <p className="text-sm text-muted-foreground">{staff.position}</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={handleRefresh}
            disabled={isRefreshing}
          >
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setManageHolidaysOpen(true)}
          >
            <List className="mr-2 h-4 w-4" />
            Manage Holidays
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setAddHolidayOpen(true)}
          >
            <Calendar className="mr-2 h-4 w-4" />
            Add Holiday
          </Button>
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
          <p className="text-xs text-muted-foreground">Working Days</p>
          <p className="text-sm font-semibold">{salaryDetails.daysWorked} days</p>
        </div>
        <div className="p-2 rounded-lg bg-secondary/30">
          <p className="text-xs text-muted-foreground">Holiday Days</p>
          <p className="text-sm font-semibold">{salaryDetails.holidayDays} days</p>
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
          Started {formatDistanceToNow(new Date(staff.startDate))} ago (
          {format(new Date(staff.startDate), "dd-MM-yyyy")})
        </p>
      )}

      <AddHolidayDialog
        open={addHolidayOpen}
        onOpenChange={setAddHolidayOpen}
        staffId={staff.id}
        staffName={staff.name}
      />
      
      <ManageHolidaysDialog
        open={manageHolidaysOpen}
        onOpenChange={setManageHolidaysOpen}
        staffId={staff.id}
        staffName={staff.name}
      />
    </div>
  );
};
