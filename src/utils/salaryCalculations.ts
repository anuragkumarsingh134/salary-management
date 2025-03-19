
import { differenceInDays, parseISO, isValid } from "date-fns";
import { supabase } from "@/integrations/supabase/client";

interface Holiday {
  start_date: string;
  end_date: string;
}

export const calculateSalaryDetails = async (salary: number, startDate: string, staffId: string, endDate?: string) => {
  if (!startDate) {
    return {
      daysWorked: 0,
      dailyRate: salary / 30,
      totalEarned: 0,
      holidayDays: 0
    };
  }

  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Not authenticated");
    
    const holidaysTable = `holidays_${user.id.replace(/-/g, '_')}`;
    const parsedStartDate = parseISO(startDate);
    
    // Validate the parsed start date
    if (!isValid(parsedStartDate)) {
      console.error('Invalid start date:', startDate);
      return {
        daysWorked: 0,
        dailyRate: salary / 30,
        totalEarned: 0,
        holidayDays: 0
      };
    }

    // Use end date if provided, otherwise use current date
    let endDateToUse;
    if (endDate) {
      endDateToUse = parseISO(endDate);
      if (!isValid(endDateToUse)) {
        console.error('Invalid end date:', endDate);
        endDateToUse = new Date();
      }
    } else {
      endDateToUse = new Date();
    }

    const totalDays = differenceInDays(endDateToUse, parsedStartDate);
    const dailyRate = salary / 30;

    // Fetch holidays for this staff member (only approved ones)
    const { data: holidays, error } = await supabase
      .from(holidaysTable as any)
      .select('start_date, end_date')
      .eq('staff_id', staffId)
      .eq('status', 'approved') as { data: Holiday[] | null; error: any };

    if (error) throw error;

    let holidayDays = 0;
    if (holidays) {
      holidays.forEach(holiday => {
        // Calculate holiday days from the difference between start and end dates
        // This ensures we're using the stored values that were based on user input
        const holidayStart = parseISO(holiday.start_date);
        const holidayEnd = parseISO(holiday.end_date);
        
        if (!isValid(holidayStart) || !isValid(holidayEnd)) {
          console.error('Invalid holiday dates:', holiday);
          return; // Skip this holiday if dates are invalid
        }

        // Add 1 to include both start and end dates
        const daysForThisHoliday = Math.abs(differenceInDays(holidayStart, holidayEnd)) + 1;
        holidayDays += daysForThisHoliday;
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
