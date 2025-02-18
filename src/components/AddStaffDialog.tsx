
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useStaffStore } from "@/store/staffStore";
import { useToast } from "@/components/ui/use-toast";
import { format, parse } from "date-fns";

interface AddStaffDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const AddStaffDialog = ({ open, onOpenChange }: AddStaffDialogProps) => {
  const { toast } = useToast();
  const addStaff = useStaffStore((state) => state.addStaff);
  const [formData, setFormData] = useState({
    name: "",
    position: "",
    salary: "",
    startDate: format(new Date(), "yyyy-MM-dd"),
  });

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputDate = e.target.value;
    // Convert the date to ISO format for storage
    setFormData({ ...formData, startDate: inputDate });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addStaff({
        name: formData.name,
        position: formData.position,
        salary: Number(formData.salary),
        startDate: formData.startDate,
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
        startDate: format(new Date(), "yyyy-MM-dd"),
      });
    } catch (error) {
      toast({
        title: "Error adding staff",
        description: "There was an error adding the staff member. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Convert ISO date to display format for the input
  const displayDate = formData.startDate ? format(new Date(formData.startDate), "dd/MM/yyyy") : "";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Staff Member</DialogTitle>
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
            <Label htmlFor="startDate">Start Date (DD/MM/YYYY)</Label>
            <Input
              id="startDate"
              placeholder="DD/MM/YYYY"
              value={displayDate}
              onChange={(e) => {
                const parts = e.target.value.split('/');
                if (parts.length === 3) {
                  const [day, month, year] = parts;
                  const isoDate = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
                  setFormData({ ...formData, startDate: isoDate });
                } else {
                  setFormData({ ...formData, startDate: e.target.value });
                }
              }}
              required
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
