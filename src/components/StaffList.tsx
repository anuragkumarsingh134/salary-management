
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { useStaffStore } from "@/store/staffStore";
import { formatDistanceToNow, differenceInDays } from "date-fns";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

const StaffList = () => {
  const { staff, transactions } = useStaffStore();
  const [selectedStaff, setSelectedStaff] = useState<string | null>(null);

  const selectedStaffMember = staff.find((member) => member.id === selectedStaff);
  const staffTransactions = transactions.filter(
    (transaction) => transaction.staffId === selectedStaff
  );

  const totalTransactions = staffTransactions.reduce(
    (acc, curr) => acc + curr.amount,
    0
  );

  const calculateSalaryDetails = (staffMember: typeof selectedStaffMember) => {
    if (!staffMember) return null;
    
    const daysWorked = differenceInDays(new Date(), new Date(staffMember.startDate));
    const dailyRate = staffMember.salary / 30;
    const totalEarned = daysWorked * dailyRate;
    
    return {
      daysWorked,
      dailyRate,
      totalEarned
    };
  };

  if (selectedStaffMember) {
    const salaryDetails = calculateSalaryDetails(selectedStaffMember);
    return (
      <Card className="p-6 glassmorphism">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold">Staff Details</h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSelectedStaff(null)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        <div className="space-y-6">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="text-2xl font-semibold text-primary">
                {selectedStaffMember.name[0]}
              </span>
            </div>
            <div>
              <h3 className="text-xl font-semibold">{selectedStaffMember.name}</h3>
              <p className="text-muted-foreground">{selectedStaffMember.position}</p>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="p-4 rounded-lg bg-secondary/30">
              <p className="text-sm text-muted-foreground">Monthly Salary</p>
              <p className="text-xl font-semibold">
                ₹{selectedStaffMember.salary.toLocaleString()}
              </p>
            </div>
            <div className="p-4 rounded-lg bg-secondary/30">
              <p className="text-sm text-muted-foreground">Total Transactions</p>
              <p className="text-xl font-semibold">
                ₹{totalTransactions.toLocaleString()}
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-semibold">Employment Information</h4>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="p-4 rounded-lg bg-secondary/30">
                <p className="text-sm text-muted-foreground">Days Worked</p>
                <p className="text-xl font-semibold">
                  {salaryDetails?.daysWorked} days
                </p>
              </div>
              <div className="p-4 rounded-lg bg-secondary/30">
                <p className="text-sm text-muted-foreground">Daily Rate</p>
                <p className="text-xl font-semibold">
                  ₹{salaryDetails?.dailyRate.toLocaleString()}
                </p>
              </div>
              <div className="p-4 rounded-lg bg-secondary/30">
                <p className="text-sm text-muted-foreground">Total Earned</p>
                <p className="text-xl font-semibold">
                  ₹{salaryDetails?.totalEarned.toLocaleString()}
                </p>
              </div>
              <div className="p-4 rounded-lg bg-secondary/30">
                <p className="text-sm text-muted-foreground">Balance</p>
                <p className="text-xl font-semibold">
                  {salaryDetails && (salaryDetails.totalEarned > totalTransactions ? (
                    <span className="text-green-600">
                      Pending: ₹{(salaryDetails.totalEarned - totalTransactions).toLocaleString()}
                    </span>
                  ) : (
                    <span className="text-red-600">
                      Advance: ₹{Math.abs(salaryDetails.totalEarned - totalTransactions).toLocaleString()}
                    </span>
                  ))}
                </p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              Started {formatDistanceToNow(new Date(selectedStaffMember.startDate))} ago
            </p>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6 glassmorphism">
      <h2 className="text-2xl font-semibold mb-4">Staff Members</h2>
      <div className="space-y-4">
        {staff.map((member) => (
          <div
            key={member.id}
            className="flex items-center justify-between p-4 rounded-lg bg-secondary/50 hover:bg-secondary/70 transition-colors cursor-pointer"
            onClick={() => setSelectedStaff(member.id)}
          >
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-lg font-semibold text-primary">
                  {member.name[0]}
                </span>
              </div>
              <div>
                <h3 className="font-medium">{member.name}</h3>
                <p className="text-sm text-muted-foreground">{member.position}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-medium">₹{member.salary.toLocaleString()}/month</p>
              <p className="text-sm text-muted-foreground">
                Joined {formatDistanceToNow(new Date(member.startDate))} ago
              </p>
            </div>
          </div>
        ))}
        {staff.length === 0 && (
          <p className="text-muted-foreground text-center py-8">
            No staff members added yet
          </p>
        )}
      </div>
    </Card>
  );
};

export default StaffList;
