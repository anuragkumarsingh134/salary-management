
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useStaffStore } from "@/store/staffStore";
import { useToast } from "@/components/ui/use-toast";
import { format, parse, isValid } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface AddStaffDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const AddStaffDialog = ({ open, onOpenChange }: AddStaffDialogProps) => {
  const { toast } = useToast();
  const addStaff = useStaffStore((state) => state.addStaff);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [dateValue, setDateValue] = useState(format(new Date(), "dd-MM-yyyy"));
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [formData, setFormData] = useState({
    name: "",
    position: "",
    salary: "",
  });

  useEffect(() => {
    // Reset the form when dialog opens
    if (open) {
      const today = new Date();
      setSelectedDate(today);
      setDateValue(format(today, "dd-MM-yyyy"));
      setFormData({
        name: "",
        position: "",
        salary: "",
      });
    }
  }, [open]);

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setDateValue(value);
    
    // Try to parse the manually entered date
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
    
    // Try to parse the date before submitting
    let startDate;
    try {
      if (isValid(selectedDate)) {
        startDate = format(selectedDate, "yyyy-MM-dd");
      } else {
        toast({
          title: "Invalid date",
          description: "Please enter a valid date in the format DD-MM-YYYY",
          variant: "destructive",
        });
        return;
      }
    } catch (error) {
      toast({
        title: "Error processing date",
        description: "Please enter a valid date in the format DD-MM-YYYY",
        variant: "destructive",
      });
      return;
    }

    try {
      await addStaff({
        name: formData.name,
        position: formData.position,
        salary: Number(formData.salary),
        startDate,
        active: true,
      });
      toast({
        title: "Staff member added",
        description: `${formData.name} has been added to the staff list.`,
      });
      onOpenChange(false);
    } catch (error) {
      toast({
        title: "Error adding staff",
        description: "There was an error adding the staff member. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Staff Member</DialogTitle>
          <DialogDescription>
            Fill in the details below to add a new staff member.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="position">Position</Label>
            <Input
              id="position"
              value={formData.position}
              onChange={(e) =>
                setFormData({ ...formData, position: e.target.value })
              }
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="salary">Monthly Salary (₹)</Label>
            <Input
              id="salary"
              type="number"
              value={formData.salary}
              onChange={(e) =>
                setFormData({ ...formData, salary: e.target.value })
              }
              required
            />
          </div>
          <div className="space-y-2">
            <Label>Start Date</Label>
            <div className="flex gap-2">
              <Input 
                value={dateValue} 
                onChange={handleDateChange} 
                placeholder="DD-MM-YYYY"
                className="w-full"
              />
              <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    type="button"
                    className="w-10 p-0"
                    onClick={() => setIsCalendarOpen(true)}
                  >
                    <CalendarIcon className="h-4 w-4" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
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
          <Button type="submit" className="w-full">
            Add Staff Member
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddStaffDialog;
