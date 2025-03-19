
export interface StaffMember {
  id: string;
  name: string;
  position: string;
  salary: number;
  startDate: string;  // This maps to start_date in DB
  endDate?: string;   // This maps to end_date in DB, optional for active staff
  image?: string;
  active: boolean;
  email?: string;
}

export interface Transaction {
  id: string;
  staffId: string;  // This maps to staff_id in DB
  amount: number;
  type: 'salary' | 'bonus' | 'withdrawal';
  date: string;
  description: string;
}

// Database row types to help with type safety
export interface StaffRow {
  id: string;
  name: string;
  position: string;
  salary: number;
  start_date: string;
  end_date: string | null;
  image: string | null;
  active: boolean;
  email: string | null;
  user_id: string | null;
  created_at: string;
}

export interface TransactionRow {
  id: string;
  staff_id: string;
  amount: number;
  type: string;
  date: string;
  description: string;
  created_at: string;
}
