
/**
 * Format a date string to DD-MM-YYYY format for display
 */
export const formatDateForDisplay = (dateString: string): string => {
  try {
    // If already in DD-MM-YYYY format, return as is
    if (dateString.match(/^\d{2}-\d{2}-\d{4}$/)) {
      return dateString;
    }
    
    // If in YYYY-MM-DD format, convert to DD-MM-YYYY
    if (dateString.match(/^\d{4}-\d{2}-\d{2}$/)) {
      const [year, month, day] = dateString.split('-');
      return `${day}-${month}-${year}`;
    }
    
    return dateString;
  } catch (error) {
    console.error("Error formatting date for display:", error);
    return dateString;
  }
};
