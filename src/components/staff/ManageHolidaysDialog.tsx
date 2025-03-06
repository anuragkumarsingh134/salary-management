
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { HolidayDialogContent } from "./HolidayDialogContent";

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
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <HolidayDialogContent 
          staffId={staffId} 
          staffName={staffName} 
          open={open} 
        />
      </DialogContent>
    </Dialog>
  );
};
