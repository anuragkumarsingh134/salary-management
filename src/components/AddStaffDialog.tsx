
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useStaffStore } from "@/store/staffStore";
import { useToast } from "@/components/ui/use-toast";
import { format } from "date-fns";
import { DatePicker } from "@/components/ui/date-picker";

interface AddStaffDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const AddStaffDialog = ({ open, onOpenChange }: AddStaffDialogProps) => {
  const { toast } = useToast();
  const addStaff = useStaffStore((state) => state.addStaff);
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [formData, setFormData] = useState({
    name: "",
    position: "",
    salary: "",
  });

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      console.log("New date selected in AddStaffDialog:", date);
      setStartDate(date);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addStaff({
        name: formData.name,
        position: formData.position,
        salary: Number(formData.salary),
        startDate: format(startDate, "yyyy-MM-dd"),
        active: true,
      });
      toast({
        title: "Staff member added",
        description: `${formData.name} has been added to the staff list.`,
      });
      onOpenChange(false);
      setFormData({
        name: "",
        position: "",
        salary: "",
      });
      setStartDate(new Date());
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
            <DatePicker 
              date={startDate} 
              onDateChange={handleDateSelect} 
            />
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
