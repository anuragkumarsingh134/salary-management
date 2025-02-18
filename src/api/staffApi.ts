
import { supabase } from '@/integrations/supabase/client';
import { StaffMember, Transaction } from '@/types/staff';

export const fetchStaffFromApi = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const staffTable = `staff_${user.id.replace(/-/g, '_')}`;
  const { data, error } = await supabase.from(staffTable).select('*');

  if (error) throw error;
  return data || [];
};

export const fetchTransactionsFromApi = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const transactionsTable = `transactions_${user.id.replace(/-/g, '_')}`;
  const { data, error } = await supabase.from(transactionsTable).select('*');

  if (error) throw error;
  return data || [];
};

export const addStaffToApi = async (staffMember: Omit<StaffMember, 'id'>) => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const staffTable = `staff_${user.id.replace(/-/g, '_')}`;
  const { data, error } = await supabase
    .from(staffTable)
    .insert([{ ...staffMember, user_id: user.id }])
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const updateStaffInApi = async (id: string, staff: Partial<StaffMember>) => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const staffTable = `staff_${user.id.replace(/-/g, '_')}`;
  const { error } = await supabase
    .from(staffTable)
    .update(staff)
    .eq('id', id);

  if (error) throw error;
};

export const deleteStaffFromApi = async (id: string) => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const staffTable = `staff_${user.id.replace(/-/g, '_')}`;
  const { error } = await supabase
    .from(staffTable)
    .delete()
    .eq('id', id);

  if (error) throw error;
};

export const addTransactionToApi = async (transaction: Omit<Transaction, 'id'>) => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const transactionsTable = `transactions_${user.id.replace(/-/g, '_')}`;
  const { data, error } = await supabase
    .from(transactionsTable)
    .insert([transaction])
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const updateTransactionInApi = async (id: string, transaction: Partial<Omit<Transaction, 'id'>>) => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const transactionsTable = `transactions_${user.id.replace(/-/g, '_')}`;
  const { error } = await supabase
    .from(transactionsTable)
    .update(transaction)
    .eq('id', id);

  if (error) throw error;
};

export const deleteTransactionFromApi = async (id: string) => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const transactionsTable = `transactions_${user.id.replace(/-/g, '_')}`;
  const { error } = await supabase
    .from(transactionsTable)
    .delete()
    .eq('id', id);

  if (error) throw error;
};
