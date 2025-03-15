
import { useState, useCallback } from "react";
import { Transaction } from "@/types/staff";
import { DateRange } from "react-day-picker";
import { useTransactionDateParser } from "@/utils/transactionDateUtils";
import { filterTransactions, sortTransactionsByDate } from "@/utils/transactionFilterUtils";

export const useTransactionFilters = (transactions: Transaction[]) => {
  const [selectedStaffId, setSelectedStaffId] = useState<string>("all-staff");
  const [dateRange, setDateRange] = useState<DateRange>({
    from: undefined,
    to: undefined,
  });
  
  const { parseDate } = useTransactionDateParser();

  // Apply filters to transactions
  const filteredTransactions = filterTransactions(
    transactions,
    { selectedStaffId, dateRange },
    parseDate
  );

  // Sort transactions by date (newest first)
  const sortedTransactions = sortTransactionsByDate(filteredTransactions, parseDate);

  // Reset all filters
  const resetFilters = useCallback(() => {
    setSelectedStaffId("all-staff");
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
