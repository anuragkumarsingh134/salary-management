
import { supabase } from '@/integrations/supabase/client';
import { StaffMember, Transaction } from '@/types/staff';

export const fetchStaffFromApi = async () => {
  const { data, error } = await supabase
    .from('staff')
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
  const { data, error } = await supabase
    .from('transactions')
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

export const createAuthUser = async (email: string) => {
  const { data, error } = await supabase.auth.signUp({
    email: email,
    password: 'temp123', // Temporary password that staff will need to change
  });

  if (error) {
    console.error('Error creating auth user:', error);
    throw error;
  }

  return data;
};

export const addStaffToApi = async (staffMember: Omit<StaffMember, 'id'>) => {
  await createAuthUser(staffMember.email);

  const { data, error } = await supabase
    .from('staff')
    .insert([{
      name: staffMember.name,
      position: staffMember.position,
      salary: staffMember.salary,
      start_date: staffMember.startDate,
      email: staffMember.email,
      image: staffMember.image,
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
  const { error } = await supabase
    .from('staff')
    .update({
      name: updatedStaff.name,
      position: updatedStaff.position,
      salary: updatedStaff.salary,
      start_date: updatedStaff.startDate,
      email: updatedStaff.email,
      image: updatedStaff.image,
    })
    .eq('id', id);

  if (error) {
    console.error('Error updating staff:', error);
    throw error;
  }
};

export const deleteStaffFromApi = async (id: string) => {
  const { error: transactionError } = await supabase
    .from('transactions')
    .delete()
    .eq('staff_id', id);

  if (transactionError) {
    console.error('Error deleting transactions:', transactionError);
    throw transactionError;
  }

  const { error: staffError } = await supabase
    .from('staff')
    .delete()
    .eq('id', id);

  if (staffError) {
    console.error('Error deleting staff:', staffError);
    throw staffError;
  }
};

export const addTransactionToApi = async (transaction: Omit<Transaction, 'id'>) => {
  const { data, error } = await supabase
    .from('transactions')
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
  const { error } = await supabase
    .from('transactions')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting transaction:', error);
    throw error;
  }
};
