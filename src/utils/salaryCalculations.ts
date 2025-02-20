
import { differenceInDays, parseISO, isWithinInterval, eachDayOfInterval } from "date-fns";
import { supabase } from "@/integrations/supabase/client";

const HOLIDAYS_TABLE = 'holidays_2d0160ab_df50_4bb2_9035_404f7cfc00a6';

interface Holiday {
  start_date: string;
  end_date: string;
}

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
    const { data: holidays, error } = await supabase
      .from(HOLIDAYS_TABLE)
      .select('start_date, end_date')
      .eq('staff_id', staffId)
      .eq('status', 'approved') as { data: Holiday[] | null; error: any };

    if (error) throw error;

    let holidayDays = 0;
    if (holidays) {
      // Calculate total holiday days
      holidays.forEach(holiday => {
        const holidayStart = parseISO(holiday.start_date);
        const holidayEnd = parseISO(holiday.end_date);
        
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
