
import { Card } from "@/components/ui/card";
import { useStaffStore } from "@/store/staffStore";
import { useToast } from "./ui/use-toast";
import { useState } from "react";
import { Transaction } from "@/types/staff";
import EditTransactionDialog from "./EditTransactionDialog";
import TransactionItem from "./transactions/TransactionItem";

interface TransactionListProps {
  selectedStaffId?: string | null;
}

const TransactionList = ({ selectedStaffId }: TransactionListProps) => {
  const { transactions, staff, deleteTransaction } = useStaffStore();
  const { toast } = useToast();
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);

  const getStaffName = (staffId: string) => {
    return staff.find((s) => s.id === staffId)?.name || "Unknown";
  };

  const handleDelete = (transactionId: string) => {
    deleteTransaction(transactionId);
    toast({
      title: "Transaction deleted",
      description: "The transaction has been removed successfully."
    });
  };

  // Don't render the card if no staff is selected
  if (!selectedStaffId) {
    return null;
  }

  // Get the staff member to check if they exist
  const selectedStaffMember = staff.find(s => s.id === selectedStaffId);
  if (!selectedStaffMember) {
    return null;
  }

  // Show transactions for the selected staff member, regardless of active status
  const staffTransactions = transactions.filter(t => t.staffId === selectedStaffId);

  return (
    <>
      <Card className="p-6 glassmorphism">
        <div className="space-y-4">
          {staffTransactions.map((transaction) => (
            <TransactionItem
              key={transaction.id}
              transaction={transaction}
              staffName={getStaffName(transaction.staffId)}
              onEdit={(transaction) => setEditingTransaction(transaction)}
              onDelete={handleDelete}
            />
          ))}
          {staffTransactions.length === 0 && (
            <p className="text-muted-foreground text-center py-8">
              No transactions recorded for this staff member
            </p>
          )}
        </div>
      </Card>
      {editingTransaction && (
        <EditTransactionDialog
          open={!!editingTransaction}
          onOpenChange={(open) => {
            if (!open) setEditingTransaction(null);
          }}
          transaction={editingTransaction}
        />
      )}
    </>
  );
};

export default TransactionList;
