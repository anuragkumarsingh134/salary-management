
import { useState, useEffect } from "react";
import { useStaffStore } from "@/store/staffStore";
import { NavBar } from "@/components/NavBar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { usePasswordProtection } from "@/hooks/usePasswordProtection";
import PasswordDialog from "@/components/PasswordDialog";
import TransactionFilters from "@/components/transactions/TransactionFilters";
import TransactionsTable from "@/components/transactions/TransactionsTable";
import { useTransactionFilters } from "@/hooks/useTransactionFilters";
import ExportOptions from "@/components/transactions/ExportOptions";

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

  const {
    selectedStaffId,
    setSelectedStaffId,
    dateRange,
    setDateRange,
    sortedTransactions,
    resetFilters
  } = useTransactionFilters(transactions);

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

  // Debug logging to help identify the issue
  useEffect(() => {
    console.log("Authentication state:", { 
      showData, 
      isLoading, 
      hasTransactions: transactions.length > 0,
      sortedTransactionsLength: sortedTransactions.length
    });
  }, [showData, isLoading, transactions, sortedTransactions]);

  const getStaffName = (staffId: string) => {
    return staff.find((s) => s.id === staffId)?.name || "Unknown";
  };

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <NavBar />
      <div className="container py-4 flex-1 flex flex-col overflow-hidden">
        <div className="flex items-center justify-between mb-2">
          <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          
          {showData && (
            <ExportOptions 
              transactions={sortedTransactions} 
              getStaffName={getStaffName}
              disabled={isLoading || sortedTransactions.length === 0}
            />
          )}
        </div>

        {showData ? (
          <Card className="glassmorphism flex-1 overflow-hidden flex flex-col pt-3">
            <div className="px-4 pb-3">
              <TransactionFilters
                staff={staff}
                selectedStaffId={selectedStaffId}
                setSelectedStaffId={setSelectedStaffId}
                dateRange={dateRange}
                setDateRange={setDateRange}
                resetFilters={resetFilters}
              />
            </div>
            <CardContent className="p-0 flex-1 overflow-hidden">
              <TransactionsTable
                transactions={sortedTransactions}
                getStaffName={getStaffName}
                isLoading={isLoading}
              />
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
