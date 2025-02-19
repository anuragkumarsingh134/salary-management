
import { supabase } from '@/integrations/supabase/client';
import { StaffMember, Transaction, StaffRow, TransactionRow } from '@/types/staff';

const STAFF_TABLE = 'staff_38e90acd_eb47_44a1_8b1a_0010c7527061';
const TRANSACTIONS_TABLE = 'transactions_38e90acd_eb47_44a1_8b1a_0010c7527061';

const convertStaffRowToMember = (row: StaffRow): StaffMember => ({
  id: row.id,
  name: row.name,
  position: row.position,
  salary: row.salary,
  startDate: row.start_date,
  image: row.image || undefined,
  active: row.active,
  email: row.email || undefined,
});

const convertTransactionRowToTransaction = (row: TransactionRow): Transaction => ({
  id: row.id,
  staffId: row.staff_id,
  amount: row.amount,
  type: row.type as Transaction['type'],
  date: row.date,
  description: row.description,
});

export const fetchStaffFromApi = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const { data, error } = await supabase
    .from(STAFF_TABLE)
    .select('*');

  if (error) throw error;
  return (data as StaffRow[]).map(convertStaffRowToMember);
};

export const fetchTransactionsFromApi = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const { data, error } = await supabase
    .from(TRANSACTIONS_TABLE)
    .select('*');

  if (error) throw error;
  return (data as TransactionRow[]).map(convertTransactionRowToTransaction);
};

export const addStaffToApi = async (staffMember: Omit<StaffMember, 'id'>) => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const { data, error } = await supabase
    .from(STAFF_TABLE)
    .insert([{
      name: staffMember.name,
      position: staffMember.position,
      salary: staffMember.salary,
      start_date: staffMember.startDate,
      image: staffMember.image || null,
      active: staffMember.active,
      email: staffMember.email || null,
      user_id: user.id
    }])
    .select()
    .single();

  if (error) throw error;
  return convertStaffRowToMember(data as StaffRow);
};

export const updateStaffInApi = async (id: string, staff: Partial<StaffMember>) => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const updateData: Partial<StaffRow> = {
    ...(staff.name && { name: staff.name }),
    ...(staff.position && { position: staff.position }),
    ...(staff.salary && { salary: staff.salary }),
    ...(staff.startDate && { start_date: staff.startDate }),
    ...(staff.image !== undefined && { image: staff.image || null }),
    ...(staff.active !== undefined && { active: staff.active }),
    ...(staff.email !== undefined && { email: staff.email || null }),
  };

  const { error } = await supabase
    .from(STAFF_TABLE)
    .update(updateData)
    .eq('id', id);

  if (error) throw error;
};

export const deleteStaffFromApi = async (id: string) => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const { error } = await supabase
    .from(STAFF_TABLE)
    .delete()
    .eq('id', id);

  if (error) throw error;
};

export const addTransactionToApi = async (transaction: Omit<Transaction, 'id'>) => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const { data, error } = await supabase
    .from(TRANSACTIONS_TABLE)
    .insert([{
      staff_id: transaction.staffId,
      amount: transaction.amount,
      type: transaction.type,
      date: transaction.date,
      description: transaction.description,
    }])
    .select()
    .single();

  if (error) throw error;
  return convertTransactionRowToTransaction(data as TransactionRow);
};

export const updateTransactionInApi = async (id: string, transaction: Partial<Omit<Transaction, 'id'>>) => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const updateData: Partial<TransactionRow> = {
    ...(transaction.staffId && { staff_id: transaction.staffId }),
    ...(transaction.amount && { amount: transaction.amount }),
    ...(transaction.type && { type: transaction.type }),
    ...(transaction.date && { date: transaction.date }),
    ...(transaction.description && { description: transaction.description }),
  };

  const { error } = await supabase
    .from(TRANSACTIONS_TABLE)
    .update(updateData)
    .eq('id', id);

  if (error) throw error;
};

export const deleteTransactionFromApi = async (id: string) => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const { error } = await supabase
    .from(TRANSACTIONS_TABLE)
    .delete()
    .eq('id', id);

  if (error) throw error;
};
