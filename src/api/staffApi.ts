
import { supabase } from '@/integrations/supabase/client';
import { StaffMember, StaffRow } from '@/types/staff';
import { getTableNames } from './utils/dbUtils';

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

export const fetchStaffFromApi = async () => {
  const tables = await getTableNames();
  const { data, error } = await supabase
    .from(tables.STAFF_TABLE as any)
    .select('*') as { data: StaffRow[] | null; error: any };

  if (error) throw error;
  return (data || []).map(convertStaffRowToMember);
};

export const addStaffToApi = async (staffMember: Omit<StaffMember, 'id'>) => {
  const tables = await getTableNames();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const { data, error } = await supabase
    .from(tables.STAFF_TABLE as any)
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
    .from(tables.STAFF_TABLE as any)
    .update(updateData)
    .eq('id', id) as { error: any };

  if (error) throw error;
};

export const deleteStaffFromApi = async (id: string) => {
  const tables = await getTableNames();
  
  // First delete all transactions associated with the staff member
  const { error: transactionError } = await supabase
    .from(tables.TRANSACTIONS_TABLE as any)
    .delete()
    .eq('staff_id', id);
    
  if (transactionError) throw transactionError;
  
  // Then delete the staff member
  const { error: staffError } = await supabase
    .from(tables.STAFF_TABLE as any)
    .delete()
    .eq('id', id);
    
  if (staffError) throw staffError;
};
