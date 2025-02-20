
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
      // Convert display format dates to ISO format for database
      const startDateISO = format(parse(startDate, "dd-MM-yyyy", new Date()), "yyyy-MM-dd");
      const endDateISO = format(parse(endDate, "dd-MM-yyyy", new Date()), "yyyy-MM-dd");

      const { error } = await supabase
        .from('holidays_38e90acd_eb47_44a1_8b1a_0010c7527061')
        .insert([
          {
            staff_id: staffId,
            start_date: startDateISO,
            end_date: endDateISO,
            reason,
          }
        ]);

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
      toast({
        title: "Error",
        description: "Failed to add holiday request. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Holiday for {staffName}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Start Date (DD-MM-YYYY)</label>
            <div className="relative">
              <Input
                type="text"
                placeholder="DD-MM-YYYY"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                pattern="\d{2}-\d{2}-\d{4}"
                required
              />
              <CalendarIcon className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground" />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">End Date (DD-MM-YYYY)</label>
            <div className="relative">
              <Input
                type="text"
                placeholder="DD-MM-YYYY"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                pattern="\d{2}-\d{2}-\d{4}"
                required
              />
              <CalendarIcon className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground" />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Reason</label>
            <Textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Enter reason for holiday..."
              required
            />
          </div>
          <Button type="submit" className="w-full">
            Submit Holiday Request
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};
