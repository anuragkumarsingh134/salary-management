
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { useTransactionForm } from "@/hooks/use-transaction-form";
import TransactionForm from "./transactions/TransactionForm";

interface AddTransactionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const AddTransactionDialog = ({ open, onOpenChange }: AddTransactionDialogProps) => {
  const isMobile = useIsMobile();
  
  const {
    formData,
    setFormData,
    dateValue,
    selectedDate,
    isCalendarOpen,
    setIsCalendarOpen,
    activeStaff,
    handleDateChange,
    handleCalendarSelect,
    handleSubmit
  } = useTransactionForm(() => onOpenChange(false));

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={cn(
        "sm:max-w-[425px]", 
        isMobile && "w-[calc(100vw-32px)] max-w-none rounded-lg p-4 mx-auto overflow-hidden"
      )}>
        <DialogHeader>
          <DialogTitle className={cn(isMobile && "text-center")}>Add New Transaction</DialogTitle>
        </DialogHeader>
        <TransactionForm
          formData={formData}
          setFormData={setFormData}
          dateValue={dateValue}
          selectedDate={selectedDate}
          isCalendarOpen={isCalendarOpen}
          setIsCalendarOpen={setIsCalendarOpen}
          activeStaff={activeStaff}
          handleDateChange={handleDateChange}
          handleCalendarSelect={handleCalendarSelect}
          handleSubmit={handleSubmit}
        />
      </DialogContent>
    </Dialog>
  );
};

export default AddTransactionDialog;
