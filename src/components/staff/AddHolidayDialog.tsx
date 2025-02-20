import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { CalendarIcon } from "lucide-react";
import { format, parse } from "date-fns";

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
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [reason, setReason] = useState("");
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");
      
      const holidaysTable = `holidays_${user.id.replace(/-/g, '_')}`;

      const startDateISO = format(parse(startDate, "dd-MM-yyyy", new Date()), "yyyy-MM-dd");
      const endDateISO = format(parse(endDate, "dd-MM-yyyy", new Date()), "yyyy-MM-dd");

      const { error } = await supabase
        .from(holidaysTable)
        .insert({
          staff_id: staffId,
          start_date: startDateISO,
          end_date: endDateISO,
          reason,
          status: 'pending'
        }) as { error: any };

      if (error) throw error;

      toast({
        title: "Holiday Added",
        description: "The holiday request has been submitted successfully.",
      });

      onOpenChange(false);
      setStartDate("");
      setEndDate("");
      setReason("");
    } catch (error: any) {
      console.error('Error adding holiday:', error);
      toast({
        title: "Error",
        description: "Failed to add holiday request. Please try again.",
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
          <div className="grid grid-cols-2 gap-2">
            <Input
              type="text"
              placeholder="Start Date (dd-MM-yyyy)"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              required
            />
            <Input
              type="text"
              placeholder="End Date (dd-MM-yyyy)"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              required
            />
          </div>
          <Textarea
            placeholder="Reason for holiday"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
          />
          <Button type="submit">Submit Holiday Request</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};
