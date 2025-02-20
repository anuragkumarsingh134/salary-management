
import { differenceInDays, parseISO, isWithinInterval, eachDayOfInterval } from "date-fns";

export const calculateSalaryDetails = async (salary: number, startDate: string, staffId: string) => {
  if (!startDate) {
    return {
      daysWorked: 0,
      dailyRate: salary / 30,
      totalEarned: 0,
      holidayDays: 0
    };
  }

  try {
    const parsedStartDate = parseISO(startDate);
    const today = new Date();
    const totalDays = differenceInDays(today, parsedStartDate);
    const dailyRate = salary / 30;

    // Fetch holidays for this staff member
    const { data: holidays } = await supabase
      .from('holidays_38e90acd_eb47_44a1_8b1a_0010c7527061')
      .select('start_date, end_date')
      .eq('staff_id', staffId)
      .eq('status', 'approved');

    let holidayDays = 0;
    if (holidays) {
      // Calculate total holiday days
      holidays.forEach(holiday => {
        const holidayStart = new Date(holiday.start_date);
        const holidayEnd = new Date(holiday.end_date);
        
        // Only count holidays within the employment period
        if (isWithinInterval(holidayStart, { start: parsedStartDate, end: today }) ||
            isWithinInterval(holidayEnd, { start: parsedStartDate, end: today })) {
          const daysInRange = eachDayOfInterval({ 
            start: holidayStart > parsedStartDate ? holidayStart : parsedStartDate,
            end: holidayEnd < today ? holidayEnd : today 
          });
          holidayDays += daysInRange.length;
        }
      });
    }

    const actualWorkingDays = Math.max(0, totalDays - holidayDays);
    const totalEarned = actualWorkingDays * dailyRate;
    
    return {
      daysWorked: actualWorkingDays,
      dailyRate,
      totalEarned,
      holidayDays
    };
  } catch (error) {
    console.error('Error calculating salary details:', error);
    return {
      daysWorked: 0,
      dailyRate: salary / 30,
      totalEarned: 0,
      holidayDays: 0
    };
  }
};
