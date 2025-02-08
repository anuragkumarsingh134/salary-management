
export interface StaffMember {
  id: string;
  name: string;
  position: string;
  salary: number;
  startDate: string;
  email: string;
  image?: string;
  active: boolean;
}

export interface Transaction {
  id: string;
  staffId: string;
  amount: number;
  type: 'salary' | 'bonus' | 'withdrawal';
  date: string;
  description: string;
}
