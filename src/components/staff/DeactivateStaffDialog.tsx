
import { format } from "date-fns";
import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface DeactivateStaffDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (endDate: Date) => void;
  staffName: string;
}

export const DeactivateStaffDialog = ({
  open,
  onOpenChange,
  onConfirm,
  staffName,
}: DeactivateStaffDialogProps) => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  const handleConfirm = () => {
    onConfirm(selectedDate);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Deactivate Staff Member</DialogTitle>
          <DialogDescription>
            Select the last working date for {staffName}. No salary will be calculated after this date.
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={(date) => date && setSelectedDate(date)}
            className="rounded-md border mx-auto"
          />
          <p className="text-sm text-muted-foreground mt-2 text-center">
            End date: {format(selectedDate, "dd-MM-yyyy")}
          </p>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleConfirm}>
            Deactivate
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
