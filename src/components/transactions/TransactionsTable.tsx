
import { Transaction } from "@/types/staff";
import { formatDateForDisplay } from "@/utils/dateUtils";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Table,
  TableBody,
  TableRow,
  TableCell
} from "@/components/ui/table";

interface TransactionsTableProps {
  transactions: Transaction[];
  getStaffName: (staffId: string) => string;
  isLoading: boolean;
}

const TransactionsTable = ({ transactions, getStaffName, isLoading }: TransactionsTableProps) => {
  // Get type color
  const getTypeColor = (type: Transaction['type']) => {
    switch (type) {
      case 'salary':
        return 'text-blue-600';
      case 'bonus':
        return 'text-green-600';
      case 'withdrawal':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center p-4">
        <p>Loading transactions...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full overflow-hidden border rounded-md">
      <div className="bg-background py-2 border-b sticky top-0 z-10 flex-shrink-0">
        <div className="px-4 flex text-sm">
          <div className="w-1/5 font-medium">Staff Name</div>
          <div className="w-1/5 font-medium">Date</div>
          <div className="w-1/5 font-medium">Type</div>
          <div className="w-1/5 font-medium">Amount</div>
          <div className="w-1/5 font-medium">Description</div>
        </div>
      </div>
      <ScrollArea className="h-[calc(100vh-270px)] flex-1">
        <Table>
          <TableBody>
            {transactions.map((transaction) => (
              <TableRow key={transaction.id} className="hover:bg-secondary/20">
                <TableCell className="py-2">{getStaffName(transaction.staffId)}</TableCell>
                <TableCell className="py-2">{formatDateForDisplay(transaction.date)}</TableCell>
                <TableCell className={`py-2 ${getTypeColor(transaction.type)}`}>
                  {transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)}
                </TableCell>
                <TableCell className="py-2">₹{transaction.amount.toLocaleString()}</TableCell>
                <TableCell className="py-2">{transaction.description}</TableCell>
              </TableRow>
            ))}
            {transactions.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="p-4 text-center text-muted-foreground">
                  No transactions match your filters
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </ScrollArea>
    </div>
  );
};

export default TransactionsTable;
