
import { useState, useEffect } from "react";
import { Transaction } from "@/types/staff";
import { useStaffStore } from "@/store/staffStore";
import { useToast } from "@/components/ui/use-toast";
import { parse, isValid, format } from "date-fns";

export function useEditTransactionForm(
  transaction: Transaction,
  onSuccess: () => void
) {
  const { toast } = useToast();
  const { staff, updateTransaction } = useStaffStore();
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [dateValue, setDateValue] = useState(transaction.date);
  const [selectedDate, setSelectedDate] = useState<Date>(() => {
    try {
      const parsedDate = parse(transaction.date, "dd-MM-yyyy", new Date());
      return isValid(parsedDate) ? parsedDate : new Date();
    } catch (error) {
      console.error("Error parsing initial date:", error);
      return new Date();
    }
  });
  
  const [formData, setFormData] = useState({
    staffId: transaction.staffId,
    amount: transaction.amount.toString(),
    type: transaction.type,
    description: transaction.description,
  });

  // Update local state when transaction prop changes
  useEffect(() => {
    setFormData({
      staffId: transaction.staffId,
      amount: transaction.amount.toString(),
      type: transaction.type,
      description: transaction.description,
    });
    
    setDateValue(transaction.date);
    
    try {
      const parsedDate = parse(transaction.date, "dd-MM-yyyy", new Date());
      if (isValid(parsedDate)) {
        setSelectedDate(parsedDate);
      }
    } catch (error) {
      console.error("Error parsing date on transaction update:", error);
    }
  }, [transaction]);

  const activeStaff = staff.filter(member => member.active);

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setDateValue(value);
    
    // Try to parse the input as a date
    if (value && /^\d{2}-\d{2}-\d{4}$/.test(value)) {
      try {
        const parsedDate = parse(value, "dd-MM-yyyy", new Date());
        if (isValid(parsedDate)) {
          setSelectedDate(parsedDate);
        }
      } catch (error) {
        console.error("Error parsing date:", error);
      }
    }
  };

  const handleCalendarSelect = (date: Date | undefined) => {
    if (date) {
      setSelectedDate(date);
      try {
        setDateValue(format(date, "dd-MM-yyyy"));
      } catch (e) {
        console.error("Error formatting selected date:", e);
      }
      setIsCalendarOpen(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const selectedStaffMember = staff.find(s => s.id === formData.staffId);
    if (!selectedStaffMember || !selectedStaffMember.active) {
      toast({
        title: "Error",
        description: "Cannot update transaction for inactive staff member.",
        variant: "destructive"
      });
      return;
    }

    // Validate the date format
    try {
      if (/^\d{2}-\d{2}-\d{4}$/.test(dateValue)) {
        const parsedDate = parse(dateValue, "dd-MM-yyyy", new Date());
        if (!isValid(parsedDate)) {
          toast({
            title: "Invalid date",
            description: "Please enter a valid date in the format DD-MM-YYYY",
            variant: "destructive",
          });
          return;
        }
      } else {
        toast({
          title: "Invalid date format",
          description: "Please enter the date in the format DD-MM-YYYY",
          variant: "destructive",
        });
        return;
      }
    } catch (error) {
      toast({
        title: "Error parsing date",
        description: "Please enter a valid date in the format DD-MM-YYYY",
        variant: "destructive",
      });
      return;
    }

    try {
      console.log("Updating transaction with date:", dateValue);
      await updateTransaction(transaction.id, {
        staffId: formData.staffId,
        amount: Number(formData.amount),
        type: formData.type,
        date: dateValue,
        description: formData.description,
      });

      toast({
        title: "Transaction updated",
        description: "The transaction has been updated successfully.",
      });
      
      onSuccess();
    } catch (error) {
      console.error("Transaction update error:", error);
      toast({
        title: "Error",
        description: "Failed to update transaction. Please try again.",
        variant: "destructive"
      });
    }
  };

  return {
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
  };
}
