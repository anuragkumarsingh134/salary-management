
import { supabase } from '@/integrations/supabase/client';
import { StaffMember, Transaction } from '@/types/staff';

const getUserTableNames = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const staffTable = `staff_${user.id.replace(/-/g, '_')}`;
  const transactionsTable = `transactions_${user.id.replace(/-/g, '_')}`;
  
  return { staffTable, transactionsTable };
};

export const fetchStaffFromApi = async () => {
  const { staffTable } = await getUserTableNames();
  
  const { data, error } = await supabase
    .from(staffTable)
    .select('*');
  
  if (error) {
    console.error('Error fetching staff:', error);
    throw error;
  }

  return data.map(staff => ({
    ...staff,
    startDate: staff.start_date,
  }));
};

export const fetchTransactionsFromApi = async () => {
  const { transactionsTable } = await getUserTableNames();
  
  const { data, error } = await supabase
    .from(transactionsTable)
    .select('*');
  
  if (error) {
    console.error('Error fetching transactions:', error);
    throw error;
  }

  return data.map(transaction => ({
    id: transaction.id,
    staffId: transaction.staff_id,
    amount: transaction.amount,
    type: transaction.type as 'salary' | 'bonus' | 'withdrawal',
    date: transaction.date,
    description: transaction.description,
  }));
};

export const addStaffToApi = async (staffMember: Omit<StaffMember, 'id'>) => {
  const { staffTable } = await getUserTableNames();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");
  
  const { data, error } = await supabase
    .from(staffTable)
    .insert([{
      name: staffMember.name,
      position: staffMember.position,
      salary: staffMember.salary,
      start_date: staffMember.startDate,
      image: staffMember.image,
      active: staffMember.active,
      user_id: user.id,
    }])
    .select()
    .single();
  
  if (error) {
    console.error('Error adding staff:', error);
    throw error;
  }

  return {
    ...data,
    startDate: data.start_date,
  };
};

export const updateStaffInApi = async (id: string, updatedStaff: Partial<StaffMember>) => {
  const { staffTable } = await getUserTableNames();
  
  const { error } = await supabase
    .from(staffTable)
    .update({
      name: updatedStaff.name,
      position: updatedStaff.position,
      salary: updatedStaff.salary,
      start_date: updatedStaff.startDate,
      image: updatedStaff.image,
      active: updatedStaff.active,
    })
    .eq('id', id);

  if (error) {
    console.error('Error updating staff:', error);
    throw error;
  }
};

export const deleteStaffFromApi = async (id: string) => {
  const { staffTable, transactionsTable } = await getUserTableNames();

  const { error: transactionError } = await supabase
    .from(transactionsTable)
    .delete()
    .eq('staff_id', id);

  if (transactionError) {
    console.error('Error deleting transactions:', transactionError);
    throw transactionError;
  }

  const { error: staffError } = await supabase
    .from(staffTable)
    .delete()
    .eq('id', id);

  if (staffError) {
    console.error('Error deleting staff:', staffError);
    throw staffError;
  }
};

export const addTransactionToApi = async (transaction: Omit<Transaction, 'id'>) => {
  const { transactionsTable } = await getUserTableNames();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const { data, error } = await supabase
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

  return {
    id: data.id,
    staffId: data.staff_id,
    amount: data.amount,
    type: data.type as 'salary' | 'bonus' | 'withdrawal',
    date: data.date,
    description: data.description,
  };
};

export const deleteTransactionFromApi = async (id: string) => {
  const { transactionsTable } = await getUserTableNames();
  
  const { error } = await supabase
    .from(transactionsTable)
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting transaction:', error);
    throw error;
  }
};
