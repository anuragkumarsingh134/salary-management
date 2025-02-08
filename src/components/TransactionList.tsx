
import { Card } from "@/components/ui/card";
import { useStaffStore } from "@/store/staffStore";
import { format } from "date-fns";

const TransactionList = () => {
  const { transactions, staff } = useStaffStore();

  const getStaffName = (staffId: string) => {
    return staff.find((s) => s.id === staffId)?.name || "Unknown";
  };

  return (
    <Card className="p-6 glassmorphism">
      <h2 className="text-2xl font-semibold mb-4">Recent Transactions</h2>
      <div className="space-y-4">
        {transactions.map((transaction) => (
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
            <div className="text-right">
              <p className="font-medium">
                ${transaction.amount.toLocaleString()}
              </p>
              <p className="text-sm text-muted-foreground">
                {format(new Date(transaction.date), "MMM d, yyyy")}
              </p>
            </div>
          </div>
        ))}
        {transactions.length === 0 && (
          <p className="text-muted-foreground text-center py-8">
            No transactions recorded yet
          </p>
        )}
      </div>
    </Card>
  );
};

export default TransactionList;
