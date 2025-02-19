
import { differenceInDays, parseISO } from "date-fns";

export const calculateSalaryDetails = (salary: number, startDate: string) => {
  if (!startDate) {
    return {
      daysWorked: 0,
      dailyRate: salary / 30,
      totalEarned: 0
    };
  }

  try {
    const parsedStartDate = parseISO(startDate);
    const daysWorked = differenceInDays(new Date(), parsedStartDate);
    const dailyRate = salary / 30;
    const totalEarned = Math.max(0, daysWorked * dailyRate);
    
    return {
      daysWorked: Math.max(0, daysWorked),
      dailyRate,
      totalEarned
    };
  } catch (error) {
    console.error('Error calculating salary details:', error);
    return {
      daysWorked: 0,
      dailyRate: salary / 30,
      totalEarned: 0
    };
  }
};
