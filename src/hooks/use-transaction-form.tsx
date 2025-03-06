
import { useState } from "react";
import { format, parse, isValid } from "date-fns";
import { useStaffStore } from "@/store/staffStore";
import { Transaction } from "@/types/staff";
import { useToast } from "@/components/ui/use-toast";

export function useTransactionForm(onSuccess: () => void) {
  const { toast } = useToast();
  const { staff, addTransaction } = useStaffStore();
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [dateValue, setDateValue] = useState(format(new Date(), "dd-MM-yyyy"));
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [formData, setFormData] = useState({
    staffId: "",
    amount: "",
    type: "salary" as Transaction['type'],
    description: "",
  });

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
    
    const selectedStaff = staff.find(s => s.id === formData.staffId);
    if (!selectedStaff || !selectedStaff.active) {
      toast({
        title: "Error",
        description: "Cannot add transaction for inactive staff member.",
        variant: "destructive"
      });
      return;
    }

    // Try to parse the date before submitting
    let transactionDate;
    try {
      if (/^\d{2}-\d{2}-\d{4}$/.test(dateValue)) {
        const parsedDate = parse(dateValue, "dd-MM-yyyy", new Date());
        if (isValid(parsedDate)) {
          transactionDate = format(parsedDate, "dd-MM-yyyy");
        } else {
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
      await addTransaction({
        staffId: formData.staffId,
        amount: Number(formData.amount),
        type: formData.type,
        date: transactionDate,
        description: formData.description,
      });

      toast({
        title: "Transaction added",
        description: "The transaction has been recorded successfully.",
      });
      
      // Reset form and close dialog
      resetForm();
      onSuccess();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add transaction. Please try again.",
        variant: "destructive"
      });
    }
  };

  const resetForm = () => {
    setFormData({
      staffId: "",
      amount: "",
      type: "salary",
      description: "",
    });
    setDateValue(format(new Date(), "dd-MM-yyyy"));
    setSelectedDate(new Date());
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
    handleSubmit,
    resetForm
  };
}
