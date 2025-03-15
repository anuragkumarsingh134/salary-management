
import { supabase } from '@/integrations/supabase/client';
import { Transaction, TransactionRow } from '@/types/staff';
import { getTableNames, formatDateForDb } from './utils/dbUtils';

const convertTransactionRowToTransaction = (row: TransactionRow): Transaction => ({
  id: row.id,
  staffId: row.staff_id,
  amount: row.amount,
  type: row.type as Transaction['type'],
  date: row.date,
  description: row.description,
});

export const fetchTransactionsFromApi = async () => {
  const tables = await getTableNames();
  const { data, error } = await supabase
    .from(tables.TRANSACTIONS_TABLE as any)
    .select('*') as { data: TransactionRow[] | null; error: any };

  if (error) throw error;
  return (data || []).map(convertTransactionRowToTransaction);
};

export const addTransactionToApi = async (transaction: Omit<Transaction, 'id'>) => {
  const tables = await getTableNames();
  
  // Format the date correctly for the database
  const formattedDate = formatDateForDb(transaction.date);
  
  const { data, error } = await supabase
    .from(tables.TRANSACTIONS_TABLE as any)
    .insert([{
      staff_id: transaction.staffId,
      amount: transaction.amount,
      type: transaction.type,
      date: formattedDate,
      description: transaction.description,
    }])
    .select()
    .single() as { data: TransactionRow; error: any };

  if (error) {
    console.error('Error adding transaction:', error);
    throw error;
  }
  return convertTransactionRowToTransaction(data);
};

export const updateTransactionInApi = async (id: string, transaction: Partial<Omit<Transaction, 'id'>>) => {
  const tables = await getTableNames();
  
  // Create update data object
  const updateData: Partial<TransactionRow> = {
    ...(transaction.staffId && { staff_id: transaction.staffId }),
    ...(transaction.amount && { amount: transaction.amount }),
    ...(transaction.type && { type: transaction.type }),
    ...(transaction.description && { description: transaction.description }),
  };
  
  // Format the date correctly if it exists
  if (transaction.date) {
    updateData.date = formatDateForDb(transaction.date);
  }

  const { error } = await supabase
    .from(tables.TRANSACTIONS_TABLE as any)
    .update(updateData)
    .eq('id', id) as { error: any };

  if (error) {
    console.error('Error updating transaction:', error);
    throw error;
  }
};

export const deleteTransactionFromApi = async (id: string) => {
  const tables = await getTableNames();
  const { error } = await supabase
    .from(tables.TRANSACTIONS_TABLE as any)
    .delete()
    .eq('id', id) as { error: any };

  if (error) throw error;
};
