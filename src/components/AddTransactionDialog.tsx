
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

interface AddTransactionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const AddTransactionDialog = ({ open, onOpenChange }: AddTransactionDialogProps) => {
  const { toast } = useToast();
  const { staff, addTransaction } = useStaffStore();
  const [dateValue, setDateValue] = useState(format(new Date(), "dd-MM-yyyy"));
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
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Transaction</DialogTitle>
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
              <SelectTrigger>
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
              <SelectTrigger>
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
            <Input 
              value={dateValue} 
              onChange={handleDateChange} 
              placeholder="DD-MM-YYYY"
            />
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
