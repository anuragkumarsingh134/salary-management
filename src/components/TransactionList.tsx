
import { Card } from "@/components/ui/card";
import { useStaffStore } from "@/store/staffStore";
import { format, differenceInDays } from "date-fns";
import { Trash } from "lucide-react";
import { Button } from "./ui/button";
import { useToast } from "./ui/use-toast";

interface TransactionListProps {
  selectedStaffId?: string | null;
}

const TransactionList = ({ selectedStaffId }: TransactionListProps) => {
  const { transactions, staff, deleteTransaction } = useStaffStore();
  const { toast } = useToast();

  const getStaffName = (staffId: string) => {
    return staff.find((s) => s.id === staffId)?.name || "Unknown";
  };

  const calculateEarnedSalary = (staffId: string) => {
    const staffMember = staff.find((s) => s.id === staffId);
    if (!staffMember) return 0;

    const daysWorked = differenceInDays(new Date(), new Date(staffMember.startDate));
    const dailyRate = staffMember.salary / 30; // Assuming 30 days per month
    return daysWorked * dailyRate;
  };

  const calculateBalance = (staffId: string) => {
    const earnedSalary = calculateEarnedSalary(staffId);
    const totalTransactions = transactions
      .filter((t) => t.staffId === staffId)
      .reduce((acc, curr) => acc + curr.amount, 0);
    
    return earnedSalary - totalTransactions;
  };

  const handleDelete = (transactionId: string) => {
    deleteTransaction(transactionId);
    toast({
      title: "Transaction deleted",
      description: "The transaction has been removed successfully."
    });
  };

  // Filter transactions based on selected staff
  const filteredTransactions = selectedStaffId 
    ? transactions.filter(t => t.staffId === selectedStaffId)
    : transactions;

  if (!selectedStaffId) {
    return (
      <Card className="p-6 glassmorphism">
        <h2 className="text-2xl font-semibold mb-4">Recent Transactions</h2>
        <p className="text-muted-foreground text-center py-8">
          Select a staff member to view their transactions
        </p>
      </Card>
    );
  }

  return (
    <Card className="p-6 glassmorphism">
      <h2 className="text-2xl font-semibold mb-4">Recent Transactions</h2>
      <div className="space-y-4">
        {filteredTransactions.map((transaction) => {
          const balance = calculateBalance(transaction.staffId);
          return (
            <div
              key={transaction.id}
              className="flex items-center justify-between p-4 rounded-lg bg-secondary/50 hover:bg-secondary/70 transition-colors"
            >
              <div>
                <h3 className="font-medium">{getStaffName(transaction.staffId)}</h3>
                <p className="text-sm text-muted-foreground">
                  {transaction.description}
                </p>
                <p className="text-sm mt-1">
                  {balance > 0 ? (
                    <span className="text-green-600">Pending: ₹{balance.toLocaleString()}</span>
                  ) : (
                    <span className="text-red-600">Advance: ₹{Math.abs(balance).toLocaleString()}</span>
                  )}
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
                  onClick={() => handleDelete(transaction.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        )}
        {filteredTransactions.length === 0 && (
          <p className="text-muted-foreground text-center py-8">
            No transactions recorded for this staff member
          </p>
        )}
      </div>
    </Card>
  );
};

export default TransactionList;

