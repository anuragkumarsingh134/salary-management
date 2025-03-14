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
} from '@/api/transactionApi';

interface StaffStore {
  staff: StaffMember[];
  transactions: Transaction[];
  fetchStaff: () => Promise<void>;
  fetchTransactions: () => Promise<void>;
  addStaff: (staff: Omit<StaffMember, 'id'>) => Promise<void>;
  updateStaff: (id: string, staff: Partial<StaffMember>) => Promise<void>;
  deleteStaff: (id: string) => Promise<void>;
  addTransaction: (transaction: Omit<Transaction, 'id'>) => Promise<void>;
  updateTransaction: (id: string, transaction: Partial<Omit<Transaction, 'id'>>) => Promise<void>;
  deleteTransaction: (id: string) => Promise<void>;
  subscribeToStaffChanges: () => () => void;
  subscribeToTransactionChanges: () => () => void;
  unsubscribeFromStaffChanges: () => void;
  unsubscribeFromTransactionChanges: () => void;
}

export const useStaffStore = create<StaffStore>()((set) => {
  // Store channel references
  let staffChannel: any = null;
  let transactionChannel: any = null;

  return {
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

    updateTransaction: async (id, transaction) => {
      await updateTransactionInApi(id, transaction);
      set((state) => ({
        transactions: state.transactions.map((t) =>
          t.id === id ? { ...t, ...transaction } : t
        ),
      }));
    },

    deleteTransaction: async (id) => {
      await deleteTransactionFromApi(id);
      set((state) => ({
        transactions: state.transactions.filter((t) => t.id !== id),
      }));
    },

    subscribeToStaffChanges: () => {
      // Clean up any existing subscription
      if (staffChannel) {
        supabase.removeChannel(staffChannel);
      }

      // Create new subscription
      staffChannel = supabase
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

      // Return a cleanup function
      return () => {
        if (staffChannel) {
          supabase.removeChannel(staffChannel);
          staffChannel = null;
        }
      };
    },

    subscribeToTransactionChanges: () => {
      // Clean up any existing subscription
      if (transactionChannel) {
        supabase.removeChannel(transactionChannel);
      }

      // Create new subscription
      transactionChannel = supabase
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

      // Return a cleanup function
      return () => {
        if (transactionChannel) {
          supabase.removeChannel(transactionChannel);
          transactionChannel = null;
        }
      };
    },

    unsubscribeFromStaffChanges: () => {
      if (staffChannel) {
        supabase.removeChannel(staffChannel);
        staffChannel = null;
      }
    },

    unsubscribeFromTransactionChanges: () => {
      if (transactionChannel) {
        supabase.removeChannel(transactionChannel);
        transactionChannel = null;
      }
    },
  };
});
