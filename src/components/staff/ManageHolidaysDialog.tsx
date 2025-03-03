
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { format, parseISO } from "date-fns";
import { useStaffStore } from "@/store/staffStore";
import { HolidayList } from "./HolidayList";
import { EditHolidayForm } from "./EditHolidayForm";

interface Holiday {
  id: string;
  start_date: string;
  end_date: string;
  reason: string;
}

interface ManageHolidaysDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  staffId: string;
  staffName: string;
}

export const ManageHolidaysDialog = ({
  open,
  onOpenChange,
  staffId,
  staffName,
}: ManageHolidaysDialogProps) => {
  const [holidays, setHolidays] = useState<Holiday[]>([]);
  const [editingHoliday, setEditingHoliday] = useState<Holiday | null>(null);
  const [days, setDays] = useState("");
  const [reason, setReason] = useState("");
  const { toast } = useToast();
  const { fetchStaff } = useStaffStore();

  useEffect(() => {
    if (open) {
      fetchHolidays();
    }
  }, [open, staffId]);

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

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingHoliday) return;

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");
      
      const holidaysTable = `holidays_${user.id.replace(/-/g, '_')}`;
      const startDate = parseISO(editingHoliday.start_date);
      const endDate = new Date(startDate);
      endDate.setDate(startDate.getDate() + parseInt(days) - 1);

      const { error } = await supabase
        .from(holidaysTable as any)
        .update({
          reason,
          end_date: format(endDate, "yyyy-MM-dd"),
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
    const startDate = parseISO(holiday.start_date);
    const endDate = parseISO(holiday.end_date);
    const daysDiff = Math.floor((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    
    setDays(daysDiff.toString());
    setReason(holiday.reason);
    setEditingHoliday(holiday);
  };

  const resetEditingState = () => {
    setEditingHoliday(null);
    setDays("");
    setReason("");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Manage Holidays for {staffName}</DialogTitle>
        </DialogHeader>

        {editingHoliday ? (
          <EditHolidayForm
            days={days}
            reason={reason}
            onDaysChange={setDays}
            onReasonChange={setReason}
            onSubmit={handleEdit}
            onCancel={resetEditingState}
          />
        ) : (
          <HolidayList 
            holidays={holidays} 
            onEdit={startEdit} 
            onDelete={handleDelete} 
          />
        )}
      </DialogContent>
    </Dialog>
  );
};
