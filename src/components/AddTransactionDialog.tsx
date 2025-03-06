
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useStaffStore } from "@/store/staffStore";
import { Transaction } from "@/types/staff";
import { useToast } from "@/components/ui/use-toast";
import { format, parse, isValid } from "date-fns";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";

interface AddTransactionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const AddTransactionDialog = ({ open, onOpenChange }: AddTransactionDialogProps) => {
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
  const isMobile = useIsMobile();

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
      
      onOpenChange(false);
      setFormData({
        staffId: "",
        amount: "",
        type: "salary",
        description: "",
      });
      setDateValue(format(new Date(), "dd-MM-yyyy"));
      setSelectedDate(new Date());
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add transaction. Please try again.",
        variant: "destructive"
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={cn("sm:max-w-[425px]", isMobile && "w-[95vw] max-w-none rounded-lg p-4")}>
        <DialogHeader>
          <DialogTitle className={cn(isMobile && "text-center")}>Add New Transaction</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="staffId">Staff Member</Label>
            <Select
              value={formData.staffId}
              onValueChange={(value) =>
                setFormData({ ...formData, staffId: value })
              }
            >
              <SelectTrigger className={cn(isMobile && "text-sm")}>
                <SelectValue placeholder="Select staff member" />
              </SelectTrigger>
              <SelectContent>
                {activeStaff.map((member) => (
                  <SelectItem key={member.id} value={member.id}>
                    {member.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="amount">Amount (₹)</Label>
            <Input
              id="amount"
              type="number"
              value={formData.amount}
              onChange={(e) =>
                setFormData({ ...formData, amount: e.target.value })
              }
              required
              className={cn(isMobile && "text-sm h-9")}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="type">Type</Label>
            <Select
              value={formData.type}
              onValueChange={(value: Transaction['type']) =>
                setFormData({ ...formData, type: value })
              }
            >
              <SelectTrigger className={cn(isMobile && "text-sm")}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="salary">Salary</SelectItem>
                <SelectItem value="bonus">Bonus</SelectItem>
                <SelectItem value="withdrawal">Withdrawal</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Date</Label>
            <div className="flex gap-2">
              <Input 
                value={dateValue} 
                onChange={handleDateChange} 
                placeholder="DD-MM-YYYY"
                className={cn("w-full", isMobile && "text-sm h-9")}
              />
              <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    type="button"
                    className={cn("w-10 p-0", isMobile && "h-9")}
                    onClick={() => setIsCalendarOpen(true)}
                  >
                    <CalendarIcon className="h-4 w-4" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className={cn("w-auto p-0", isMobile && "w-[calc(95vw-4rem)]")} align="start">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={handleCalendarSelect}
                    initialFocus
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              required
              className={cn(isMobile && "text-sm h-9")}
            />
          </div>
          <Button type="submit" className="w-full">
            Add Transaction
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddTransactionDialog;
