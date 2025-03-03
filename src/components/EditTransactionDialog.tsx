
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useStaffStore } from "@/store/staffStore";
import { Transaction } from "@/types/staff";
import { useToast } from "@/components/ui/use-toast";
import { format } from "date-fns";
import { DatePicker } from "@/components/ui/date-picker";

interface EditTransactionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  transaction: Transaction;
}

const EditTransactionDialog = ({ open, onOpenChange, transaction }: EditTransactionDialogProps) => {
  const { toast } = useToast();
  const { staff, updateTransaction } = useStaffStore();
  const [date, setDate] = useState<Date>(new Date(transaction.date));
  const [formData, setFormData] = useState({
    staffId: transaction.staffId,
    amount: transaction.amount.toString(),
    type: transaction.type,
    description: transaction.description,
  });

  useEffect(() => {
    setFormData({
      staffId: transaction.staffId,
      amount: transaction.amount.toString(),
      type: transaction.type,
      description: transaction.description,
    });
    setDate(new Date(transaction.date));
  }, [transaction]);

  const activeStaff = staff.filter(member => member.active);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const selectedStaff = staff.find(s => s.id === formData.staffId);
    if (!selectedStaff || !selectedStaff.active) {
      toast({
        title: "Error",
        description: "Cannot update transaction for inactive staff member.",
        variant: "destructive"
      });
      return;
    }

    try {
      await updateTransaction(transaction.id, {
        staffId: formData.staffId,
        amount: Number(formData.amount),
        type: formData.type,
        date: format(date, "yyyy-MM-dd"),
        description: formData.description,
      });

      toast({
        title: "Transaction updated",
        description: "The transaction has been updated successfully.",
      });
      
      onOpenChange(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update transaction. Please try again.",
        variant: "destructive"
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Transaction</DialogTitle>
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
            <DatePicker 
              date={date} 
              onDateChange={(newDate) => {
                if (newDate) {
                  setDate(newDate);
                }
              }} 
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
            Update Transaction
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditTransactionDialog;
