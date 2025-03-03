
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { format, addDays, parse, isValid } from "date-fns";
import { useStaffStore } from "@/store/staffStore";
import { AddHolidayForm } from "./AddHolidayForm";

interface AddHolidayDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  staffId: string;
  staffName: string;
}

export const AddHolidayDialog = ({
  open,
  onOpenChange,
  staffId,
  staffName,
}: AddHolidayDialogProps) => {
  const [days, setDays] = useState("");
  const [reason, setReason] = useState("");
  const [startDate, setStartDate] = useState<Date>(new Date());
  const { toast } = useToast();
  const { fetchStaff } = useStaffStore();

  const handleDateChange = (date: Date | undefined) => {
    if (date) {
      console.log("Holiday start date selected:", date);
      setStartDate(date);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");
      
      const holidaysTable = `holidays_${user.id.replace(/-/g, '_')}`;
      const endDate = addDays(startDate, parseInt(days) - 1);

      console.log("Submitting holiday:", {
        startDate: format(startDate, "yyyy-MM-dd"),
        endDate: format(endDate, "yyyy-MM-dd"),
        days,
        reason
      });

      const { error } = await supabase
        .from(holidaysTable as any)
        .insert({
          staff_id: staffId,
          start_date: format(startDate, "yyyy-MM-dd"),
          end_date: format(endDate, "yyyy-MM-dd"),
          reason,
          status: 'approved' // Automatically approve holidays
        }) as { error: any };

      if (error) throw error;

      // Refresh staff data after adding holiday
      await fetchStaff();

      toast({
        title: "Holiday Added",
        description: `${days} days of holiday have been deducted from working days.`,
      });

      onOpenChange(false);
      resetForm();
    } catch (error: any) {
      console.error('Error adding holiday:', error);
      toast({
        title: "Error",
        description: "Failed to add holiday. Please try again.",
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
    setDays("");
    setReason("");
    setStartDate(new Date());
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Holiday for {staffName}</DialogTitle>
        </DialogHeader>
        <AddHolidayForm
          days={days}
          reason={reason}
          startDate={startDate}
          onDaysChange={setDays}
          onReasonChange={setReason}
          onDateChange={handleDateChange}
          onSubmit={handleSubmit}
        />
      </DialogContent>
    </Dialog>
  );
};
