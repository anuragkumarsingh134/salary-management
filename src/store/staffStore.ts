
import { create } from 'zustand';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

export interface StaffMember {
  id: string;
  name: string;
  position: string;
  salary: number;
  startDate: string;
  image?: string;
}

export interface Transaction {
  id: string;
  staffId: string;
  amount: number;
  type: 'salary' | 'bonus' | 'withdrawal';
  date: string;
  description: string;
}

interface StaffStore {
  staff: StaffMember[];
  transactions: Transaction[];
  fetchStaff: () => Promise<void>;
  fetchTransactions: () => Promise<void>;
  addStaff: (staff: Omit<StaffMember, 'id'>) => Promise<void>;
  updateStaff: (id: string, staff: Partial<StaffMember>) => Promise<void>;
  deleteStaff: (id: string) => Promise<void>;
  addTransaction: (transaction: Omit<Transaction, 'id'>) => Promise<void>;
  deleteTransaction: (id: string) => Promise<void>;
}

export const useStaffStore = create<StaffStore>()((set) => ({
  staff: [],
  transactions: [],
  
  fetchStaff: async () => {
    const { data, error } = await supabase
      .from('staff')
      .select('*');
    
    if (error) {
      console.error('Error fetching staff:', error);
      return;
    }

    const formattedStaff = data.map(staff => ({
      ...staff,
      startDate: staff.start_date,
    }));

    set({ staff: formattedStaff });
  },

  fetchTransactions: async () => {
    const { data, error } = await supabase
      .from('transactions')
      .select('*');
    
    if (error) {
      console.error('Error fetching transactions:', error);
      return;
    }

    const formattedTransactions = data.map(transaction => ({
      ...transaction,
      staffId: transaction.staff_id,
    }));

    set({ transactions: formattedTransactions });
  },

  addStaff: async (staffMember) => {
    const { data, error } = await supabase
      .from('staff')
      .insert([{
        name: staffMember.name,
        position: staffMember.position,
        salary: staffMember.salary,
        start_date: staffMember.startDate,
        image: staffMember.image,
      }])
      .select()
      .single();
    
    if (error) {
      console.error('Error adding staff:', error);
      return;
    }

    set((state) => ({
      staff: [...state.staff, { 
        ...data,
        startDate: data.start_date,
      }],
    }));
  },

  updateStaff: async (id, updatedStaff) => {
    const { error } = await supabase
      .from('staff')
      .update({
        name: updatedStaff.name,
        position: updatedStaff.position,
        salary: updatedStaff.salary,
        start_date: updatedStaff.startDate,
        image: updatedStaff.image,
      })
      .eq('id', id);

    if (error) {
      console.error('Error updating staff:', error);
      return;
    }

    set((state) => ({
      staff: state.staff.map((staff) =>
        staff.id === id ? { ...staff, ...updatedStaff } : staff
      ),
    }));
  },

  deleteStaff: async (id) => {
    const { error } = await supabase
      .from('staff')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting staff:', error);
      return;
    }

    set((state) => ({
      staff: state.staff.filter((staff) => staff.id !== id),
    }));
  },

  addTransaction: async (transaction) => {
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
      return;
    }

    set((state) => ({
      transactions: [
        ...state.transactions,
        { 
          ...data,
          staffId: data.staff_id,
        },
      ],
    }));
  },

  deleteTransaction: async (id) => {
    const { error } = await supabase
      .from('transactions')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting transaction:', error);
      return;
    }

    set((state) => ({
      transactions: state.transactions.filter((t) => t.id !== id),
    }));
  },
}));
