
import { useState, useEffect } from "react";
import { format, parseISO } from "date-fns";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useStaffStore } from "@/store/staffStore";

interface Holiday {
  id: string;
  start_date: string;
  end_date: string;
  reason: string;
}

export const useHolidayManagement = (staffId: string) => {
  const [holidays, setHolidays] = useState<Holiday[]>([]);
  const [editingHoliday, setEditingHoliday] = useState<Holiday | null>(null);
  const [days, setDays] = useState("");
  const [reason, setReason] = useState("");
  const [startDate, setStartDate] = useState<Date>(new Date());
  const { toast } = useToast();
  const { fetchStaff } = useStaffStore();

  const fetchHolidays = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");
      
      const holidaysTable = `holidays_${user.id.replace(/-/g, '_')}`;
      const { data, error } = await supabase
        .from(holidaysTable as any)
        .select('*')
        .eq('staff_id', staffId)
        .eq('status', 'approved')
        .order('start_date', { ascending: false }) as { data: Holiday[] | null; error: any };

      if (error) throw error;
      setHolidays(data || []);
    } catch (error) {
      console.error('Error fetching holidays:', error);
      toast({
        title: "Error",
        description: "Failed to fetch holidays.",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");
      
      const holidaysTable = `holidays_${user.id.replace(/-/g, '_')}`;
      const { error } = await supabase
        .from(holidaysTable as any)
        .delete()
        .eq('id', id);

      if (error) throw error;

      await fetchStaff();
      await fetchHolidays();

      toast({
        title: "Holiday Deleted",
        description: "The holiday has been removed successfully.",
      });
    } catch (error) {
      console.error('Error deleting holiday:', error);
      toast({
        title: "Error",
        description: "Failed to delete holiday.",
        variant: "destructive",
      });
    }
  };

  const handleDateChange = (date: Date | undefined) => {
    if (date) {
      console.log("Holiday start date changed to:", date);
      setStartDate(date);
    }
  };

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingHoliday) return;

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");
      
      const holidaysTable = `holidays_${user.id.replace(/-/g, '_')}`;
      const daysNum = parseInt(days);
      
      // We use the input days directly and don't calculate from dates
      // The end_date field is still required in the database, but we'll set it 
      // based on the input days for information purposes only
      
      // Using startDate and inputted days for database record
      const formattedStartDate = format(startDate, "yyyy-MM-dd");
      
      // For display purposes, calculate an end date
      // This doesn't affect the actual holiday calculation
      const displayEndDate = new Date(startDate);
      displayEndDate.setDate(displayEndDate.getDate() - (daysNum - 1));
      const formattedEndDate = format(displayEndDate, "yyyy-MM-dd");

      console.log("Updating holiday with:", {
        startDate: formattedStartDate,
        endDate: formattedEndDate,
        days: daysNum,
        reason
      });

      const { error } = await supabase
        .from(holidaysTable as any)
        .update({
          reason,
          start_date: formattedStartDate,
          end_date: formattedEndDate,
        })
        .eq('id', editingHoliday.id);

      if (error) throw error;

      await fetchStaff();
      await fetchHolidays();
      resetEditingState();

      toast({
        title: "Holiday Updated",
        description: "The holiday has been updated successfully.",
      });
    } catch (error) {
      console.error('Error updating holiday:', error);
      toast({
        title: "Error",
        description: "Failed to update holiday.",
        variant: "destructive",
      });
    }
  };

  const startEdit = (holiday: Holiday) => {
    // When starting edit, set the days based on database value
    setStartDate(parseISO(holiday.start_date));
    setReason(holiday.reason);
    
    // Calculate the exact number of days from the holiday record
    // This ensures we're using the stored value, not recalculating
    const parsedStartDate = parseISO(holiday.start_date);
    const parsedEndDate = parseISO(holiday.end_date);
    
    // Count the number of days (inclusive) by examining the dates
    const timeDiff = Math.abs(parsedStartDate.getTime() - parsedEndDate.getTime());
    const daysCount = Math.floor(timeDiff / (1000 * 3600 * 24)) + 1; // +1 because both days are inclusive
    
    setDays(daysCount.toString());
    setEditingHoliday(holiday);
  };

  const resetEditingState = () => {
    setEditingHoliday(null);
    setDays("");
    setReason("");
    setStartDate(new Date());
  };

  return {
    holidays,
    editingHoliday,
    days,
    reason,
    startDate,
    fetchHolidays,
    handleDelete,
    handleDateChange,
    handleEdit,
    startEdit,
    resetEditingState,
    setDays,
    setReason
  };
};
