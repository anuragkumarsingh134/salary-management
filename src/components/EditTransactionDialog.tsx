
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

interface EditTransactionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  transaction: Transaction;
}

const EditTransactionDialog = ({ open, onOpenChange, transaction }: EditTransactionDialogProps) => {
  const { toast } = useToast();
  const { staff, updateTransaction } = useStaffStore();
  const [formData, setFormData] = useState({
    staffId: transaction.staffId,
    amount: transaction.amount.toString(),
    type: transaction.type,
    date: transaction.date,
    description: transaction.description,
  });

  useEffect(() => {
    setFormData({
      staffId: transaction.staffId,
      amount: transaction.amount.toString(),
      type: transaction.type,
      date: transaction.date,
      description: transaction.description,
    });
  }, [transaction]);

  // Filter to only show active staff members
  const activeStaff = staff.filter(member => member.active);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check if selected staff member exists and is active
    const selectedStaff = staff.find(s => s.id === formData.staffId);
    if (!selectedStaff || !selectedStaff.active) {
      toast({
        title: "Error",
        description: "Cannot add transaction for inactive staff member.",
        variant: "destructive"
      });
      return;
    }

    await updateTransaction(transaction.id, {
      staffId: formData.staffId,
      amount: Number(formData.amount),
      type: formData.type,
      date: formData.date,
      description: formData.description,
    });

    toast({
      title: "Transaction updated",
      description: "The transaction has been updated successfully.",
    });
    
    onOpenChange(false);
  };

  // Convert ISO date to display format for the input
  const displayDate = formData.date ? format(new Date(formData.date), "dd/MM/yyyy") : "";

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
            <Label htmlFor="date">Date (DD/MM/YYYY)</Label>
            <Input
              id="date"
              placeholder="DD/MM/YYYY"
              value={displayDate}
              onChange={(e) => {
                const parts = e.target.value.split('/');
                if (parts.length === 3) {
                  const [day, month, year] = parts;
                  const isoDate = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
                  setFormData({ ...formData, date: isoDate });
                } else {
                  setFormData({ ...formData, date: e.target.value });
                }
              }}
              required
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
