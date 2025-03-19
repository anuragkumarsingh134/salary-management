
import { supabase } from '@/integrations/supabase/client';
import { format, parse } from 'date-fns';

export const getTableNames = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");
  
  const userId = user.id.replace(/-/g, '_');
  return {
    STAFF_TABLE: `staff_${userId}`,
    TRANSACTIONS_TABLE: `transactions_${userId}`,
    HOLIDAYS_TABLE: `holidays_${userId}`
  };
};

// Format a date string to the format Supabase expects (YYYY-MM-DD)
export const formatDateForDb = (dateString: string): string => {
  try {
    // Parse the date from DD-MM-YYYY format
    const parsedDate = parse(dateString, 'dd-MM-yyyy', new Date());
    // Return in YYYY-MM-DD format for database
    return format(parsedDate, 'yyyy-MM-dd');
  } catch (error) {
    console.error('Error formatting date for DB:', error);
    // Return original string if parsing fails
    return dateString;
  }
};
