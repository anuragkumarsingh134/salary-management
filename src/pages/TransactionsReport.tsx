
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
    <div className="min-h-screen flex flex-col">
      <NavBar />
      <div className="container py-8 flex-1 flex flex-col space-y-4 animate-fadeIn">
        <div className="flex items-center justify-between">
          <Button variant="ghost" onClick={() => navigate(-1)}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <h1 className="text-2xl font-bold">Transactions Report</h1>
          <div className="w-[100px]"></div> {/* Spacer for alignment */}
        </div>

        {showData ? (
          <Card className="glassmorphism flex-1 flex flex-col">
            <CardHeader className="flex-shrink-0">
              <CardTitle>All Transactions</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 p-0 h-[calc(100vh-220px)]">
              {isLoading ? (
                <div className="flex justify-center p-8">
                  <p>Loading transactions...</p>
                </div>
              ) : (
                <ScrollArea className="h-full px-6 pb-6">
                  <div className="space-y-4">
                    <div className="overflow-x-auto">
                      <table className="w-full border-collapse">
                        <thead className="sticky top-0 bg-background z-10">
                          <tr className="border-b">
                            <th className="text-left p-2">Staff Name</th>
                            <th className="text-left p-2">Date</th>
                            <th className="text-left p-2">Type</th>
                            <th className="text-left p-2">Amount</th>
                            <th className="text-left p-2">Description</th>
                          </tr>
                        </thead>
                        <tbody>
                          {sortedTransactions.map((transaction) => (
                            <tr key={transaction.id} className="border-b hover:bg-secondary/20">
                              <td className="p-2">{getStaffName(transaction.staffId)}</td>
                              <td className="p-2">{formatDateForDisplay(transaction.date)}</td>
                              <td className={`p-2 ${getTypeColor(transaction.type)}`}>
                                {transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)}
                              </td>
                              <td className="p-2">₹{transaction.amount.toLocaleString()}</td>
                              <td className="p-2">{transaction.description}</td>
                            </tr>
                          ))}
                          {sortedTransactions.length === 0 && (
                            <tr>
                              <td colSpan={5} className="p-8 text-center text-muted-foreground">
                                No transactions found
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </ScrollArea>
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
