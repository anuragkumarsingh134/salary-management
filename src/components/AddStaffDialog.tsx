
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useStaffStore } from "@/store/staffStore";
import { useToast } from "@/components/ui/use-toast";
import { format, parse, isValid } from "date-fns";

interface AddStaffDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const AddStaffDialog = ({ open, onOpenChange }: AddStaffDialogProps) => {
  const { toast } = useToast();
  const addStaff = useStaffStore((state) => state.addStaff);
  const [dateValue, setDateValue] = useState(format(new Date(), "dd-MM-yyyy"));
  const [formData, setFormData] = useState({
    name: "",
    position: "",
    salary: "",
  });

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setDateValue(value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Try to parse the date before submitting
    let startDate;
    try {
      if (/^\d{2}-\d{2}-\d{4}$/.test(dateValue)) {
        const parsedDate = parse(dateValue, "dd-MM-yyyy", new Date());
        if (isValid(parsedDate)) {
          startDate = format(parsedDate, "yyyy-MM-dd");
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
      setFormData({
        name: "",
        position: "",
        salary: "",
      });
      setDateValue(format(new Date(), "dd-MM-yyyy"));
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
            <Input 
              value={dateValue} 
              onChange={handleDateChange} 
              placeholder="DD-MM-YYYY"
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
