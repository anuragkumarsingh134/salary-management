
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { format, addDays } from "date-fns";

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
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");
      
      const holidaysTable = `holidays_${user.id.replace(/-/g, '_')}`;
      const startDate = new Date();
      const endDate = addDays(startDate, parseInt(days) - 1);

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

      toast({
        title: "Holiday Added",
        description: `${days} days of holiday have been deducted from working days.`,
      });

      onOpenChange(false);
      setDays("");
      setReason("");
    } catch (error: any) {
      console.error('Error adding holiday:', error);
      toast({
        title: "Error",
        description: "Failed to add holiday. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Holiday for {staffName}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          <div className="space-y-2">
            <Input
              type="number"
              placeholder="Number of days"
              value={days}
              onChange={(e) => setDays(e.target.value)}
              min="1"
              required
            />
          </div>
          <Textarea
            placeholder="Reason for holiday"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            required
          />
          <Button type="submit">Add Holiday</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};
