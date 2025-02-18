
import { differenceInDays, parseISO } from "date-fns";

export const calculateSalaryDetails = (salary: number, startDate: string) => {
  const parsedStartDate = parseISO(startDate);
  const daysWorked = differenceInDays(new Date(), parsedStartDate);
  const dailyRate = salary / 30;
  const totalEarned = daysWorked * dailyRate;
  
  return {
    daysWorked,
    dailyRate,
    totalEarned
  };
};
