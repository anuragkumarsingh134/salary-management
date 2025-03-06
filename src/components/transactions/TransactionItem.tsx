
import { Transaction } from "@/types/staff";
import { format } from "date-fns";
import { Trash, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";

interface TransactionItemProps {
  transaction: Transaction;
  staffName: string;
  onEdit: (transaction: Transaction) => void;
  onDelete: (transactionId: string) => void;
}

const TransactionItem = ({ 
  transaction, 
  staffName, 
  onEdit, 
  onDelete 
}: TransactionItemProps) => {
  return (
    <div
      className="flex items-center justify-between p-4 rounded-lg bg-secondary/50 hover:bg-secondary/70 transition-colors"
    >
      <div>
        <h3 className="font-medium">{staffName}</h3>
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
            {format(new Date(transaction.date), "yyyy-MM-dd")}
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => {
              e.stopPropagation();
              onEdit(transaction);
            }}
            className="text-blue-500 hover:text-blue-700"
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(transaction.id);
            }}
            className="text-red-500 hover:text-red-700"
          >
            <Trash className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TransactionItem;
