
import { Transaction } from "@/types/staff";
import { DateRange } from "react-day-picker";

export interface FilterOptions {
  selectedStaffId: string;
  dateRange: DateRange;
}

/**
 * Filter transactions based on staff and date range
 */
export const filterTransactions = (
  transactions: Transaction[],
  filterOptions: FilterOptions,
  parseDate: (dateString: string) => Date
): Transaction[] => {
  return transactions.filter((transaction) => {
    // Apply staff filter
    if (
      filterOptions.selectedStaffId !== "all-staff" && 
      transaction.staffId !== filterOptions.selectedStaffId
    ) {
      return false;
    }
    
    // Apply date range filter
    if (filterOptions.dateRange.from || filterOptions.dateRange.to) {
      const transactionDate = parseDate(transaction.date);
      
      if (filterOptions.dateRange.from && transactionDate < filterOptions.dateRange.from) {
        return false;
      }
      
      if (filterOptions.dateRange.to) {
        // Add one day to include the end date in the range
        const endDate = new Date(filterOptions.dateRange.to);
        endDate.setDate(endDate.getDate() + 1);
        
        if (transactionDate >= endDate) {
          return false;
        }
      }
    }
    
    return true;
  });
};

/**
 * Sort transactions by date (newest first)
 */
export const sortTransactionsByDate = (
  transactions: Transaction[],
  parseDate: (dateString: string) => Date
): Transaction[] => {
  return [...transactions].sort((a, b) => {
    const dateA = parseDate(a.date);
    const dateB = parseDate(b.date);
    return dateB.getTime() - dateA.getTime();
  });
};
