
import { supabase } from '@/integrations/supabase/client';
import { Transaction } from '@/types/staff';
import { SupabaseClient } from '@supabase/supabase-js';
import { getUserTableNames } from './utils/tableNames';

export const fetchTransactionsFromApi = async () => {
  const { transactionsTable } = await getUserTableNames();
  
  // Using a type assertion to handle dynamic table names
  const { data, error } = await (supabase as SupabaseClient)
    .from(transactionsTable)
    .select('*');
  
  if (error) {
    console.error('Error fetching transactions:', error);
    throw error;
  }

  if (!data) return [];

  return data.map(transaction => ({
    id: transaction.id,
    staffId: transaction.staff_id,
    amount: transaction.amount,
    type: transaction.type as 'salary' | 'bonus' | 'withdrawal',
    date: transaction.date,
    description: transaction.description,
  }));
};

export const addTransactionToApi = async (transaction: Omit<Transaction, 'id'>) => {
  const { transactionsTable } = await getUserTableNames();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  // Using a type assertion to handle dynamic table names
  const { data, error } = await (supabase as SupabaseClient)
    .from(transactionsTable)
    .insert([{
      staff_id: transaction.staffId,
      amount: transaction.amount,
      type: transaction.type,
      date: transaction.date,
      description: transaction.description,
    }])
    .select()
    .single();
  
  if (error) {
    console.error('Error adding transaction:', error);
    throw error;
  }

  if (!data) throw new Error("No data returned from insert");

  return {
    id: data.id,
    staffId: data.staff_id,
    amount: data.amount,
    type: data.type as 'salary' | 'bonus' | 'withdrawal',
    date: data.date,
    description: data.description,
  };
};

export const updateTransactionInApi = async (id: string, updatedTransaction: Partial<Transaction>) => {
  const { transactionsTable } = await getUserTableNames();
  
  // Using a type assertion to handle dynamic table names
  const { error } = await (supabase as SupabaseClient)
    .from(transactionsTable)
    .update({
      staff_id: updatedTransaction.staffId,
      amount: updatedTransaction.amount,
      type: updatedTransaction.type,
      date: updatedTransaction.date,
      description: updatedTransaction.description,
    })
    .eq('id', id);

  if (error) {
    console.error('Error updating transaction:', error);
    throw error;
  }
};

export const deleteTransactionFromApi = async (id: string) => {
  const { transactionsTable } = await getUserTableNames();
  
  // Using a type assertion to handle dynamic table names
  const { error } = await (supabase as SupabaseClient)
    .from(transactionsTable)
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting transaction:', error);
    throw error;
  }
};
