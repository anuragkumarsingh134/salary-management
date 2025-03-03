
export interface StaffMember {
  id: string;
  name: string;
  position: string;
  salary: number;
  startDate: string;
  image?: string;
  active: boolean;
  email?: string;  // Made email optional
}

export interface Transaction {
  id: string;
  staffId: string;
  amount: number;
  type: 'salary' | 'bonus' | 'withdrawal';
  date: string;
  description: string;
}
