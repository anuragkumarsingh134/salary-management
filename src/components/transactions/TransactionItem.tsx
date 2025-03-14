
import { Transaction } from "@/types/staff";
import { parse } from "date-fns";
import { Trash, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";

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
  const isMobile = useIsMobile();
  
  // Format the date correctly for display as DD-MM-YYYY
  const formatDisplayDate = (dateString: string): string => {
    try {
      // If already in DD-MM-YYYY format, return as is
      if (dateString.match(/^\d{2}-\d{2}-\d{4}$/)) {
        return dateString;
      }
      
      // If in YYYY-MM-DD format, convert to DD-MM-YYYY
      if (dateString.match(/^\d{4}-\d{2}-\d{2}$/)) {
        const [year, month, day] = dateString.split('-');
        return `${day}-${month}-${year}`;
      }
      
      return dateString;
    } catch (error) {
      console.error("Error formatting date for display:", error);
      return dateString;
    }
  };
  
  return (
    <div
      className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 rounded-lg bg-secondary/50 hover:bg-secondary/70 transition-colors w-full"
    >
      <div className="w-full sm:w-auto">
        <h3 className="font-medium">{staffName}</h3>
        <p className="text-sm text-muted-foreground">
          {transaction.description}
        </p>
      </div>
      <div className={`flex ${isMobile ? 'w-full justify-between mt-2' : 'items-center gap-4'}`}>
        <div className={`${isMobile ? '' : 'text-right'}`}>
          <p className="font-medium">
            ₹{transaction.amount.toLocaleString()}
          </p>
          <p className="text-sm text-muted-foreground">
            {formatDisplayDate(transaction.date)}
          </p>
        </div>
        {isMobile ? (
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onEdit(transaction);
              }}
              className="text-blue-500 hover:text-blue-700 h-8 w-8 p-0"
            >
              <Pencil className="h-3 w-3" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(transaction.id);
              }}
              className="text-red-500 hover:text-red-700 h-8 w-8 p-0"
            >
              <Trash className="h-3 w-3" />
            </Button>
          </div>
        ) : (
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
        )}
      </div>
    </div>
  );
};

export default TransactionItem;
