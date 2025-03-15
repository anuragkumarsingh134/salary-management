
import { useCallback } from "react";

/**
 * Hook that provides date parsing functionality for transactions
 */
export const useTransactionDateParser = () => {
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

  return { parseDate };
};
