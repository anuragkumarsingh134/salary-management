
import { formatDistanceToNow } from "date-fns";
import { StaffMember } from "@/types/staff";
import { useIsMobile } from "@/hooks/use-mobile";
import { useEffect, useState } from "react";
import { calculateSalaryDetails } from "@/utils/salaryCalculations";
import { useStaffStore } from "@/store/staffStore";

interface StaffCardProps {
  staff: StaffMember;
  onClick: () => void;
  isInactive?: boolean;
}

export const StaffCard = ({ staff, onClick, isInactive }: StaffCardProps) => {
  const isMobile = useIsMobile();
  const { transactions } = useStaffStore();
  const [balance, setBalance] = useState<number | null>(null);
  const [isBalanceLoading, setIsBalanceLoading] = useState(true);
  
  useEffect(() => {
    const calculateBalance = async () => {
      setIsBalanceLoading(true);
      try {
        // Get salary calculations
        const salaryDetails = await calculateSalaryDetails(staff.salary, staff.startDate, staff.id);
        
        // Get total transactions for this staff member
        const staffTransactions = transactions.filter(t => t.staffId === staff.id);
        const totalTransactions = staffTransactions.reduce((acc, curr) => acc + curr.amount, 0);
        
        // Calculate balance (positive = pending payment, negative = advance taken)
        const calculatedBalance = salaryDetails.totalEarned - totalTransactions;
        setBalance(calculatedBalance);
      } catch (error) {
        console.error("Error calculating balance:", error);
      } finally {
        setIsBalanceLoading(false);
      }
    };
    
    calculateBalance();
  }, [staff.id, staff.salary, staff.startDate, transactions]);
  
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
        <div className="flex items-center justify-end gap-1">
          <p className={`font-medium whitespace-nowrap ${isMobile ? 'text-sm' : ''}`}>
            ₹{staff.salary.toLocaleString()}{!isMobile && '/month'}
          </p>
          {!isBalanceLoading && balance !== null && (
            <span className={`text-xs font-medium px-1.5 py-0.5 rounded-full ${
              balance > 0 
                ? 'bg-green-100 text-green-600' 
                : balance < 0 
                  ? 'bg-red-100 text-red-600' 
                  : 'bg-gray-100 text-gray-600'
            }`}>
              {balance > 0 
                ? `+₹${Math.abs(balance).toLocaleString()}` 
                : balance < 0 
                  ? `-₹${Math.abs(balance).toLocaleString()}`
                  : '₹0'}
            </span>
          )}
        </div>
        <p className={`text-muted-foreground whitespace-nowrap ${isMobile ? 'text-xs' : 'text-sm'}`}>
          {isMobile ? formatDistanceToNow(new Date(staff.startDate)) : `Joined ${formatDistanceToNow(new Date(staff.startDate))} ago`}
        </p>
      </div>
    </div>
  );
};
