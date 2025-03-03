
import { supabase } from '@/integrations/supabase/client';

export const getUserTableNames = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const staffTable = `staff_${user.id.replace(/-/g, '_')}`;
  const transactionsTable = `transactions_${user.id.replace(/-/g, '_')}`;
  
  return { staffTable, transactionsTable };
};
