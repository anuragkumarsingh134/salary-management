
import { create } from 'zustand';
import { StaffMember, Transaction } from '@/types/staff';
import { supabase } from '@/integrations/supabase/client';
import {
  fetchStaffFromApi,
  addStaffToApi,
  updateStaffInApi,
  deleteStaffFromApi,
} from '@/api/staffApi';
import {
  fetchTransactionsFromApi,
  addTransactionToApi,
  updateTransactionInApi,
  deleteTransactionFromApi,
} from '@/api/staffApi';

interface StaffState {
  staff: StaffMember[];
  fetchStaff: () => Promise<void>;
  addStaff: (staff: Omit<StaffMember, 'id'>) => Promise<void>;
  updateStaff: (id: string, staff: Partial<StaffMember>) => Promise<void>;
  deleteStaff: (id: string) => Promise<void>;
  subscribeToStaffChanges: () => () => void;
  unsubscribeFromStaffChanges: () => void;
}

interface TransactionState {
  transactions: Transaction[];
  fetchTransactions: () => Promise<void>;
  addTransaction: (transaction: Omit<Transaction, 'id'>) => Promise<void>;
  updateTransaction: (id: string, transaction: Partial<Transaction>) => Promise<void>;
  deleteTransaction: (id: string) => Promise<void>;
  subscribeToTransactionChanges: () => () => void;
  unsubscribeFromTransactionChanges: () => void;
}

type StaffStore = StaffState & TransactionState;

export const useStaffStore = create<StaffStore>()((set) => ({
  // Staff state
  staff: [],
  
  fetchStaff: async () => {
    const staff = await fetchStaffFromApi();
    set({ staff });
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
          // Fetch fresh data on any change
          const staff = await fetchStaffFromApi();
          set({ staff });
        }
      )
      .subscribe();

    return () => {
      if (channel) {
        supabase.removeChannel(channel);
      }
    };
  },

  unsubscribeFromStaffChanges: () => {
    supabase.removeAllChannels();
  },

  // Transaction state
  transactions: [],
  
  fetchTransactions: async () => {
    const transactions = await fetchTransactionsFromApi();
    set({ transactions });
  },

  addTransaction: async (transaction) => {
    const newTransaction = await addTransactionToApi(transaction);
    set((state) => ({
      transactions: [...state.transactions, newTransaction],
    }));
  },

  updateTransaction: async (id, updatedTransaction) => {
    await updateTransactionInApi(id, updatedTransaction);
    set((state) => ({
      transactions: state.transactions.map((transaction) =>
        transaction.id === id ? { ...transaction, ...updatedTransaction } : transaction
      ),
    }));
  },

  deleteTransaction: async (id) => {
    await deleteTransactionFromApi(id);
    set((state) => ({
      transactions: state.transactions.filter((t) => t.id !== id),
    }));
  },

  subscribeToTransactionChanges: () => {
    const channel = supabase
      .channel('transaction_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'transactions'
        },
        async () => {
          // Fetch fresh data on any change
          const transactions = await fetchTransactionsFromApi();
          set({ transactions });
        }
      )
      .subscribe();

    return () => {
      if (channel) {
        supabase.removeChannel(channel);
      }
    };
  },

  unsubscribeFromTransactionChanges: () => {
    supabase.removeAllChannels();
  },
}));
