
import { differenceInDays } from "date-fns";

export const calculateSalaryDetails = (salary: number, startDate: string) => {
  const daysWorked = differenceInDays(new Date(), new Date(startDate));
  const dailyRate = salary / 30;
  const totalEarned = daysWorked * dailyRate;
  
  return {
    daysWorked,
    dailyRate,
    totalEarned
  };
};
