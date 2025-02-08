
import { create } from 'zustand';
import { StaffMember, Transaction } from '@/types/staff';
import { supabase } from '@/integrations/supabase/client';
import {
  fetchStaffFromApi,
  fetchTransactionsFromApi,
  addStaffToApi,
  updateStaffInApi,
  deleteStaffFromApi,
  addTransactionToApi,
  deleteTransactionFromApi,
} from '@/api/staffApi';

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
  subscribeToStaffChanges: () => void;
  unsubscribeFromStaffChanges: () => void;
}

export const useStaffStore = create<StaffStore>()((set) => ({
  staff: [],
  transactions: [],
  
  fetchStaff: async () => {
    const staff = await fetchStaffFromApi();
    set({ staff });
  },

  fetchTransactions: async () => {
    const transactions = await fetchTransactionsFromApi();
    set({ transactions });
  },

  addStaff: async (staffMember) => {
    const newStaff = await addStaffToApi(staffMember);
    set((state) => ({
      staff: [...state.staff, newStaff],
    }));
  },

  updateStaff: async (id, updatedStaff) => {
    await updateStaffInApi(id, updatedStaff);
    set((state) => ({
      staff: state.staff.map((staff) =>
        staff.id === id ? { ...staff, ...updatedStaff } : staff
      ),
    }));
  },

  deleteStaff: async (id) => {
    await deleteStaffFromApi(id);
    set((state) => ({
      staff: state.staff.filter((staff) => staff.id !== id),
      transactions: state.transactions.filter((t) => t.staffId !== id),
    }));
  },

  addTransaction: async (transaction) => {
    const newTransaction = await addTransactionToApi(transaction);
    set((state) => ({
      transactions: [...state.transactions, newTransaction],
    }));
  },

  deleteTransaction: async (id) => {
    await deleteTransactionFromApi(id);
    set((state) => ({
      transactions: state.transactions.filter((t) => t.id !== id),
    }));
  },

  subscribeToStaffChanges: () => {
    const channel = supabase
      .channel('staff_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'staff'
        },
        async () => {
          const staff = await fetchStaffFromApi();
          set({ staff });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  },

  unsubscribeFromStaffChanges: () => {
    supabase.removeAllChannels();
  },
}));
