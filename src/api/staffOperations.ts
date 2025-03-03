
import { supabase } from '@/integrations/supabase/client';
import { StaffMember } from '@/types/staff';
import { SupabaseClient } from '@supabase/supabase-js';
import { getUserTableNames } from './utils/tableNames';

export const fetchStaffFromApi = async () => {
  const { staffTable } = await getUserTableNames();
  
  // Using a type assertion to handle dynamic table names
  const { data, error } = await (supabase as SupabaseClient)
    .from(staffTable)
    .select('*');
  
  if (error) {
    console.error('Error fetching staff:', error);
    throw error;
  }

  if (!data) return [];

  return data.map(staff => ({
    ...staff,
    startDate: staff.start_date,
  }));
};

export const addStaffToApi = async (staffMember: Omit<StaffMember, 'id'>) => {
  const { staffTable } = await getUserTableNames();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");
  
  // Using a type assertion to handle dynamic table names
  const { data, error } = await (supabase as SupabaseClient)
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

  if (!data) throw new Error("No data returned from insert");

  return {
    ...data,
    startDate: data.start_date,
  };
};

export const updateStaffInApi = async (id: string, updatedStaff: Partial<StaffMember>) => {
  const { staffTable } = await getUserTableNames();
  
  // Using a type assertion to handle dynamic table names
  const { error } = await (supabase as SupabaseClient)
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

  // Using type assertions to handle dynamic table names
  const { error: transactionError } = await (supabase as SupabaseClient)
    .from(transactionsTable)
    .delete()
    .eq('staff_id', id);

  if (transactionError) {
    console.error('Error deleting transactions:', transactionError);
    throw transactionError;
  }

  const { error: staffError } = await (supabase as SupabaseClient)
    .from(staffTable)
    .delete()
    .eq('id', id);

  if (staffError) {
    console.error('Error deleting staff:', staffError);
    throw staffError;
  }
};
