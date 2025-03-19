
import { StaffMember } from "@/types/staff";
import { formatDateForDisplay } from "@/utils/dateUtils";
import { useState, useEffect } from "react";
import { calculateSalaryDetails } from "@/utils/salaryCalculations";

interface StaffInfoProps {
  staff: StaffMember;
  totalTransactions: number;
}

export const StaffInfo = ({ staff, totalTransactions }: StaffInfoProps) => {
  const [salaryDetails, setSalaryDetails] = useState({
    daysWorked: 0,
    dailyRate: 0,
    totalEarned: 0,
    holidayDays: 0
  });

  useEffect(() => {
    const fetchSalaryDetails = async () => {
      const details = await calculateSalaryDetails(staff.salary, staff.startDate, staff.id, staff.endDate);
      setSalaryDetails(details);
    };

    fetchSalaryDetails();
  }, [staff.id, staff.salary, staff.startDate, staff.endDate]);

  return (
    <div className="divide-y">
      <div className="py-2">
        <p className="text-sm text-gray-500">Position</p>
        <p className="font-medium">{staff.position}</p>
      </div>
      <div className="py-2">
        <p className="text-sm text-gray-500">Salary</p>
        <p className="font-medium">${staff.salary.toLocaleString()}</p>
      </div>
      <div className="py-2">
        <p className="text-sm text-gray-500">Start Date</p>
        <p className="font-medium">{formatDateForDisplay(staff.startDate)}</p>
      </div>
      {staff.endDate && (
        <div className="py-2">
          <p className="text-sm text-gray-500">End Date</p>
          <p className="font-medium">{formatDateForDisplay(staff.endDate)}</p>
        </div>
      )}
      <div className="py-2">
        <p className="text-sm text-gray-500">Status</p>
        <p className={`font-medium ${staff.active ? 'text-green-600' : 'text-red-600'}`}>
          {staff.active ? 'Active' : 'Inactive'}
        </p>
      </div>
      <div className="py-2">
        <p className="text-sm text-gray-500">Days Worked</p>
        <p className="font-medium">{salaryDetails.daysWorked}</p>
      </div>
      <div className="py-2">
        <p className="text-sm text-gray-500">Total Earned</p>
        <p className="font-medium">${salaryDetails.totalEarned.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
      </div>
      <div className="py-2">
        <p className="text-sm text-gray-500">Total Transactions</p>
        <p className="font-medium">${totalTransactions.toLocaleString()}</p>
      </div>
      {staff.email && (
        <div className="py-2">
          <p className="text-sm text-gray-500">Email</p>
          <p className="font-medium break-all">{staff.email}</p>
        </div>
      )}
    </div>
  );
};
