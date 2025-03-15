
import { useState, useCallback } from "react";
import { Transaction, StaffMember } from "@/types/staff";
import { DateRange } from "react-day-picker";

export const useTransactionFilters = (transactions: Transaction[]) => {
  const [selectedStaffId, setSelectedStaffId] = useState<string>("");
  const [dateRange, setDateRange] = useState<DateRange>({
    from: undefined,
    to: undefined,
  });

  // Helper function to convert a date string to a Date object regardless of format
  const parseDate = useCallback((dateString: string): Date => {
    try {
      // Try DD-MM-YYYY format first
      if (dateString.match(/^\d{2}-\d{2}-\d{4}$/)) {
        const [day, month, year] = dateString.split('-').map(Number);
        return new Date(year, month - 1, day);
      }
      // Try YYYY-MM-DD format
      if (dateString.match(/^\d{4}-\d{2}-\d{2}$/)) {
        return new Date(dateString);
      }
      // Default to current date if parsing fails
      return new Date();
    } catch (error) {
      console.error("Error parsing date:", error, dateString);
      return new Date();
    }
  }, []);

  // Apply filters to transactions
  const filteredTransactions = transactions.filter((transaction) => {
    // Apply staff filter
    if (selectedStaffId && transaction.staffId !== selectedStaffId) {
      return false;
    }
    
    // Apply date range filter
    if (dateRange.from || dateRange.to) {
      const transactionDate = parseDate(transaction.date);
      
      if (dateRange.from && transactionDate < dateRange.from) {
        return false;
      }
      
      if (dateRange.to) {
        // Add one day to include the end date in the range
        const endDate = new Date(dateRange.to);
        endDate.setDate(endDate.getDate() + 1);
        
        if (transactionDate >= endDate) {
          return false;
        }
      }
    }
    
    return true;
  });

  // Sort transactions by date (newest first)
  const sortedTransactions = [...filteredTransactions].sort((a, b) => {
    const dateA = parseDate(a.date);
    const dateB = parseDate(b.date);
    return dateB.getTime() - dateA.getTime();
  });

  // Reset all filters
  const resetFilters = useCallback(() => {
    setSelectedStaffId("");
    setDateRange({ from: undefined, to: undefined });
  }, []);

  return {
    selectedStaffId,
    setSelectedStaffId,
    dateRange,
    setDateRange,
    sortedTransactions,
    resetFilters
  };
};
