
import { Card } from "@/components/ui/card";
import { useStaffStore } from "@/store/staffStore";
import { useToast } from "./ui/use-toast";
import { useState } from "react";
import { Transaction } from "@/types/staff";
import EditTransactionDialog from "./EditTransactionDialog";
import TransactionItem from "./transactions/TransactionItem";
import ExportOptions from "./transactions/ExportOptions";

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

  // Helper function to convert a date string to a Date object regardless of format
  const parseDate = (dateString: string): Date => {
    try {
      // Try DD-MM-YYYY format first
      if (dateString.match(/^\d{2}-\d{2}-\d{4}$/)) {
        const [day, month, year] = dateString.split('-').map(Number);
        return new Date(year, month - 1, day);
      }
      // Try YYYY-MM-DD format
      if (dateString.match(/^\d{4}-\d{2}-\d{2}$/)) {
        return new Date(dateString);
      }
      // Default to current date if parsing fails
      return new Date();
    } catch (error) {
      console.error("Error parsing date:", error, dateString);
      return new Date();
    }
  };

  // Show transactions for the selected staff member, sorted by date (newest first)
  const staffTransactions = transactions
    .filter(t => t.staffId === selectedStaffId)
    .sort((a, b) => {
      const dateA = parseDate(a.date);
      const dateB = parseDate(b.date);
      return dateB.getTime() - dateA.getTime();
    });

  return (
    <>
      <Card className="p-6 glassmorphism">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">Transactions</h3>
          {staffTransactions.length > 0 && (
            <ExportOptions
              transactions={staffTransactions}
              getStaffName={getStaffName}
            />
          )}
        </div>
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
