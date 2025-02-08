
import { Card } from "@/components/ui/card";
import { useStaffStore } from "@/store/staffStore";
import { format } from "date-fns";
import { Trash, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "./ui/button";
import { useToast } from "./ui/use-toast";
import { useState } from "react";

interface TransactionListProps {
  selectedStaffId?: string | null;
}

const TransactionList = ({ selectedStaffId }: TransactionListProps) => {
  const { transactions, staff, deleteTransaction } = useStaffStore();
  const { toast } = useToast();
  const [isExpanded, setIsExpanded] = useState(false);

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

  // Get the staff member to check if they exist and are active
  const selectedStaffMember = staff.find(s => s.id === selectedStaffId);
  if (!selectedStaffMember || !selectedStaffMember.active) {
    return null;
  }

  // Only show transactions that belong to this specific active staff member
  const staffTransactions = transactions.filter(t => 
    t.staffId === selectedStaffId && 
    staff.some(s => s.id === t.staffId && s.active)
  );

  return (
    <Card className="p-6 glassmorphism">
      <div 
        className="flex items-center justify-between cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <h2 className="text-2xl font-semibold">
          Recent Transactions for {selectedStaffMember.name}
        </h2>
        <Button variant="ghost" size="icon">
          {isExpanded ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </Button>
      </div>
      
      {isExpanded && (
        <div className="space-y-4 mt-4">
          {staffTransactions.map((transaction) => (
            <div
              key={transaction.id}
              className="flex items-center justify-between p-4 rounded-lg bg-secondary/50 hover:bg-secondary/70 transition-colors"
            >
              <div>
                <h3 className="font-medium">{getStaffName(transaction.staffId)}</h3>
                <p className="text-sm text-muted-foreground">
                  {transaction.description}
                </p>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="font-medium">
                    ₹{transaction.amount.toLocaleString()}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {format(new Date(transaction.date), "MMM d, yyyy")}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(transaction.id);
                  }}
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
          {staffTransactions.length === 0 && (
            <p className="text-muted-foreground text-center py-8">
              No transactions recorded for this staff member
            </p>
          )}
        </div>
      )}
    </Card>
  );
};

export default TransactionList;
