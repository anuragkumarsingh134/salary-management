
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { format, parseISO, differenceInDays } from "date-fns";
import { useStaffStore } from "@/store/staffStore";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Pencil, Trash } from "lucide-react";

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
      const startDate = new Date();
      const endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + parseInt(days) - 1);

      const { error } = await supabase
        .from(holidaysTable as any)
        .update({
          reason,
          start_date: format(startDate, "yyyy-MM-dd"),
          end_date: format(endDate, "yyyy-MM-dd"),
        })
        .eq('id', editingHoliday.id);

      if (error) throw error;

      await fetchStaff();
      await fetchHolidays();
      setEditingHoliday(null);
      setDays("");
      setReason("");

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
    const daysDiff = differenceInDays(parseISO(holiday.end_date), parseISO(holiday.start_date)) + 1;
    setDays(daysDiff.toString());
    setReason(holiday.reason);
    setEditingHoliday(holiday);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Manage Holidays for {staffName}</DialogTitle>
        </DialogHeader>

        {editingHoliday ? (
          <form onSubmit={handleEdit} className="grid gap-4 py-4">
            <Input
              type="number"
              placeholder="Number of days"
              value={days}
              onChange={(e) => setDays(e.target.value)}
              min="1"
              required
            />
            <Textarea
              placeholder="Reason for holiday"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              required
            />
            <div className="flex gap-2">
              <Button type="submit">Update Holiday</Button>
              <Button type="button" variant="outline" onClick={() => {
                setEditingHoliday(null);
                setDays("");
                setReason("");
              }}>
                Cancel
              </Button>
            </div>
          </form>
        ) : (
          <div className="space-y-4">
            {holidays.length === 0 ? (
              <p className="text-center text-muted-foreground py-4">No holidays found</p>
            ) : (
              holidays.map((holiday) => (
                <div
                  key={holiday.id}
                  className="flex items-center justify-between p-4 rounded-lg border"
                >
                  <div>
                    <p className="font-medium">
                      {differenceInDays(parseISO(holiday.end_date), parseISO(holiday.start_date)) + 1} days
                    </p>
                    <p className="text-sm text-muted-foreground">{holiday.reason}</p>
                    <p className="text-xs text-muted-foreground">
                      {format(parseISO(holiday.start_date), "yyyy-MM-dd")} -{" "}
                      {format(parseISO(holiday.end_date), "yyyy-MM-dd")}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => startEdit(holiday)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(holiday.id)}
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
