
import { Card } from "@/components/ui/card";
import { useStaffStore } from "@/store/staffStore";
import { format } from "date-fns";
import { Pencil, Trash2 } from "lucide-react";
import { Button } from "./ui/button";
import { useToast } from "./ui/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";

interface TransactionListProps {
  selectedStaffId?: string | null;
  onStaffSelect?: (staffId: string) => void;
  onEditTransaction?: (transactionId: string) => void;
}

const TransactionList = ({ selectedStaffId, onStaffSelect, onEditTransaction }: TransactionListProps) => {
  const { transactions, staff, deleteTransaction } = useStaffStore();
  const { toast } = useToast();

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

  // Filter transactions based on selectedStaffId if provided
  const filteredTransactions = selectedStaffId 
    ? transactions.filter(t => t.staffId === selectedStaffId)
    : transactions;

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold">Transactions</h2>
        
        {onStaffSelect && (
          <div className="w-64">
            <Select 
              value={selectedStaffId || ""} 
              onValueChange={(value) => onStaffSelect(value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Filter by staff member" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Staff Members</SelectItem>
                {staff.map((member) => (
                  <SelectItem key={member.id} value={member.id}>
                    {member.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
      </div>
      
      <div className="space-y-3">
        {filteredTransactions.length > 0 ? (
          filteredTransactions.map((transaction) => (
            <div
              key={transaction.id}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
            >
              <div>
                <h3 className="font-semibold">{getStaffName(transaction.staffId)}</h3>
                <p className="text-sm text-gray-500">
                  {transaction.description}
                </p>
              </div>
              <div className="flex items-center gap-6">
                <div className="text-right">
                  <p className="font-semibold">
                    ₹{transaction.amount.toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-500">
                    {format(new Date(transaction.date), "d MMM yyyy")}
                  </p>
                </div>
                <div className="flex gap-2">
                  {onEditTransaction && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation();
                        onEditTransaction(transaction.id);
                      }}
                      className="text-blue-500 hover:text-blue-700 hover:bg-blue-50"
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(transaction.id);
                    }}
                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-center py-8">
            No transactions found
          </p>
        )}
      </div>
    </Card>
  );
};

export default TransactionList;
