import { useState, useEffect } from "react";
import { useStaffStore } from "@/store/staffStore";
import { NavBar } from "@/components/NavBar";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { formatDateForDisplay } from "@/utils/dateUtils";
import { Transaction } from "@/types/staff";
import { usePasswordProtection } from "@/hooks/usePasswordProtection";
import PasswordDialog from "@/components/PasswordDialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell
} from "@/components/ui/table";

const TransactionsReport = () => {
  const { transactions, staff, fetchTransactions, fetchStaff } = useStaffStore();
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const { 
    showData,
    passwordDialogOpen,
    password,
    setPassword,
    setPasswordDialogOpen,
    handlePasswordSubmit,
    handleForgotPassword,
  } = usePasswordProtection();

  useEffect(() => {
    const loadData = async () => {
      try {
        await Promise.all([fetchStaff(), fetchTransactions()]);
      } catch (error) {
        console.error("Error loading data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [fetchStaff, fetchTransactions]);

  // Show password dialog when first loading the page
  useEffect(() => {
    if (!showData && !isLoading) {
      setPasswordDialogOpen(true);
    }
  }, [showData, isLoading, setPasswordDialogOpen]);

  const getStaffName = (staffId: string) => {
    return staff.find((s) => s.id === staffId)?.name || "Unknown";
  };

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

  // Sort transactions by date (newest first)
  const sortedTransactions = [...transactions].sort((a, b) => {
    const dateA = parseDate(a.date);
    const dateB = parseDate(b.date);
    return dateB.getTime() - dateA.getTime();
  });

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

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <NavBar />
      <div className="container py-8 flex-1 flex flex-col space-y-4 animate-fadeIn overflow-hidden">
        <div className="flex items-center justify-between">
          <Button variant="ghost" onClick={() => navigate(-1)}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <h1 className="text-2xl font-bold">Transactions Report</h1>
          <div className="w-[100px]"></div> {/* Spacer for alignment */}
        </div>

        {showData ? (
          <Card className="glassmorphism flex-1 flex flex-col overflow-hidden">
            <CardHeader className="flex-shrink-0">
              <CardTitle>All Transactions</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 p-0 overflow-hidden">
              {isLoading ? (
                <div className="flex justify-center p-8">
                  <p>Loading transactions...</p>
                </div>
              ) : (
                <div className="h-full flex flex-col">
                  <div className="bg-background py-3 border-b">
                    <div className="px-4 flex">
                      <div className="w-1/5 font-medium">Staff Name</div>
                      <div className="w-1/5 font-medium">Date</div>
                      <div className="w-1/5 font-medium">Type</div>
                      <div className="w-1/5 font-medium">Amount</div>
                      <div className="w-1/5 font-medium">Description</div>
                    </div>
                  </div>
                  <ScrollArea className="h-[calc(100vh-240px)]">
                    <Table>
                      <TableBody>
                        {sortedTransactions.map((transaction) => (
                          <TableRow key={transaction.id} className="hover:bg-secondary/20">
                            <TableCell>{getStaffName(transaction.staffId)}</TableCell>
                            <TableCell>{formatDateForDisplay(transaction.date)}</TableCell>
                            <TableCell className={getTypeColor(transaction.type)}>
                              {transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)}
                            </TableCell>
                            <TableCell>₹{transaction.amount.toLocaleString()}</TableCell>
                            <TableCell>{transaction.description}</TableCell>
                          </TableRow>
                        ))}
                        {sortedTransactions.length === 0 && (
                          <TableRow>
                            <TableCell colSpan={5} className="p-8 text-center text-muted-foreground">
                              No transactions found
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </ScrollArea>
                </div>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="flex flex-col items-center justify-center p-12 glassmorphism bg-muted/50 rounded-lg">
            <p className="text-lg mb-4">Data is protected</p>
            <Button 
              onClick={() => setPasswordDialogOpen(true)}
              variant="default"
            >
              View Transactions
            </Button>
          </div>
        )}
      </div>

      <PasswordDialog
        open={passwordDialogOpen}
        onOpenChange={setPasswordDialogOpen}
        password={password}
        setPassword={setPassword}
        onSubmit={handlePasswordSubmit}
        onForgotPassword={handleForgotPassword}
      />
    </div>
  );
};

export default TransactionsReport;
