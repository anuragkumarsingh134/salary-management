
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

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
  addStaff: (staff: Omit<StaffMember, 'id'>) => void;
  updateStaff: (id: string, staff: Partial<StaffMember>) => void;
  deleteStaff: (id: string) => void;
  addTransaction: (transaction: Omit<Transaction, 'id'>) => void;
  deleteTransaction: (id: string) => void;
}

export const useStaffStore = create<StaffStore>()(
  persist(
    (set) => ({
      staff: [],
      transactions: [],
      addStaff: (staffMember) =>
        set((state) => ({
          staff: [...state.staff, { ...staffMember, id: crypto.randomUUID() }],
        })),
      updateStaff: (id, updatedStaff) =>
        set((state) => ({
          staff: state.staff.map((staff) =>
            staff.id === id ? { ...staff, ...updatedStaff } : staff
          ),
        })),
      deleteStaff: (id) =>
        set((state) => ({
          staff: state.staff.filter((staff) => staff.id !== id),
        })),
      addTransaction: (transaction) =>
        set((state) => ({
          transactions: [
            ...state.transactions,
            { ...transaction, id: crypto.randomUUID() },
          ],
        })),
      deleteTransaction: (id) =>
        set((state) => ({
          transactions: state.transactions.filter((t) => t.id !== id),
        })),
    }),
    {
      name: 'staff-storage',
    }
  )
);
