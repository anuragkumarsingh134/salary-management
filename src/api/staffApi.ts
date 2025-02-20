
import { supabase } from '@/integrations/supabase/client';
import { StaffMember, Transaction, StaffRow, TransactionRow } from '@/types/staff';

const getTableNames = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");
  
  const userId = user.id.replace(/-/g, '_');
  return {
    STAFF_TABLE: `staff_${userId}`,
    TRANSACTIONS_TABLE: `transactions_${userId}`,
    HOLIDAYS_TABLE: `holidays_${userId}`
  } as const;
};

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
  const tables = await getTableNames();
  const { data, error } = await supabase
    .from(tables.STAFF_TABLE)
    .select('*') as { data: StaffRow[] | null; error: any };

  if (error) throw error;
  return (data || []).map(convertStaffRowToMember);
};

export const fetchTransactionsFromApi = async () => {
  const tables = await getTableNames();
  const { data, error } = await supabase
    .from(tables.TRANSACTIONS_TABLE)
    .select('*') as { data: TransactionRow[] | null; error: any };

  if (error) throw error;
  return (data || []).map(convertTransactionRowToTransaction);
};

export const addStaffToApi = async (staffMember: Omit<StaffMember, 'id'>) => {
  const tables = await getTableNames();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const { data, error } = await supabase
    .from(tables.STAFF_TABLE)
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
    .single() as { data: StaffRow; error: any };

  if (error) throw error;
  return convertStaffRowToMember(data);
};

export const updateStaffInApi = async (id: string, staff: Partial<StaffMember>) => {
  const tables = await getTableNames();
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
    .from(tables.STAFF_TABLE)
    .update(updateData)
    .eq('id', id) as { error: any };

  if (error) throw error;
};

export const deleteStaffFromApi = async (id: string) => {
  const tables = await getTableNames();
  const { error } = await supabase
    .from(tables.STAFF_TABLE)
    .delete()
    .eq('id', id) as { error: any };

  if (error) throw error;
};

export const addTransactionToApi = async (transaction: Omit<Transaction, 'id'>) => {
  const tables = await getTableNames();
  const { data, error } = await supabase
    .from(tables.TRANSACTIONS_TABLE)
    .insert([{
      staff_id: transaction.staffId,
      amount: transaction.amount,
      type: transaction.type,
      date: transaction.date,
      description: transaction.description,
    }])
    .select()
    .single() as { data: TransactionRow; error: any };

  if (error) throw error;
  return convertTransactionRowToTransaction(data);
};

export const updateTransactionInApi = async (id: string, transaction: Partial<Omit<Transaction, 'id'>>) => {
  const tables = await getTableNames();
  const updateData: Partial<TransactionRow> = {
    ...(transaction.staffId && { staff_id: transaction.staffId }),
    ...(transaction.amount && { amount: transaction.amount }),
    ...(transaction.type && { type: transaction.type }),
    ...(transaction.date && { date: transaction.date }),
    ...(transaction.description && { description: transaction.description }),
  };

  const { error } = await supabase
    .from(tables.TRANSACTIONS_TABLE)
    .update(updateData)
    .eq('id', id) as { error: any };

  if (error) throw error;
};

export const deleteTransactionFromApi = async (id: string) => {
  const tables = await getTableNames();
  const { error } = await supabase
    .from(tables.TRANSACTIONS_TABLE)
    .delete()
    .eq('id', id) as { error: any };

  if (error) throw error;
};
