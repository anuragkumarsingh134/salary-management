
import { useState, useEffect } from "react";
import { useStaffStore } from "@/store/staffStore";
import { NavBar } from "@/components/NavBar";
import TransactionList from "@/components/TransactionList";
import AddTransactionDialog from "@/components/AddTransactionDialog";
import TransactionEditDialog from "@/components/TransactionEditDialog";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import LoadingSkeleton from "@/components/dashboard/LoadingSkeleton";
import { usePasswordProtection } from "@/hooks/usePasswordProtection";
import PasswordDialog from "@/components/PasswordDialog";

const TransactionsPage = () => {
  const [addTransactionOpen, setAddTransactionOpen] = useState(false);
  const [editTransactionOpen, setEditTransactionOpen] = useState(false);
  const [selectedTransactionId, setSelectedTransactionId] = useState<string | null>(null);
  const [selectedStaffId, setSelectedStaffId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const { 
    showData,
    passwordDialogOpen,
    password,
    setPassword,
    setPasswordDialogOpen,
    handlePasswordSubmit,
    handleShowDataClick,
    handleForgotPassword,
    handleChangeKey,
    isChangingKey,
  } = usePasswordProtection();

  const { 
    fetchStaff, 
    fetchTransactions, 
    subscribeToStaffChanges, 
    subscribeToTransactionChanges 
  } = useStaffStore();

  useEffect(() => {
    const loadData = async () => {
      try {
        await Promise.all([
          fetchStaff(),
          fetchTransactions()
        ]);
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
    
    const unsubscribeStaff = subscribeToStaffChanges();
    const unsubscribeTransactions = subscribeToTransactionChanges();

    return () => {
      unsubscribeStaff();
      unsubscribeTransactions();
    };
  }, [fetchStaff, fetchTransactions, subscribeToStaffChanges, subscribeToTransactionChanges]);

  const handleEditTransaction = (transactionId: string) => {
    setSelectedTransactionId(transactionId);
    setEditTransactionOpen(true);
  };

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      <div className="container py-8 flex-1 flex flex-col space-y-8 animate-fadeIn">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Transactions</h1>
          <div className="flex gap-2">
            <Button onClick={handleShowDataClick} variant="outline">
              {showData ? "Hide Data" : "Show Data"}
            </Button>
            {showData && (
              <Button onClick={handleChangeKey} variant="outline">
                Change Key
              </Button>
            )}
            <Button onClick={() => setAddTransactionOpen(true)}>
              <PlusCircle className="mr-2 h-4 w-4" /> Add Transaction
            </Button>
          </div>
        </div>

        {showData && (
          <div className="flex-1 overflow-auto min-h-0">
            <TransactionList 
              selectedStaffId={selectedStaffId} 
              onStaffSelect={setSelectedStaffId}
              onEditTransaction={handleEditTransaction}
            />
          </div>
        )}

        <PasswordDialog
          open={passwordDialogOpen}
          onOpenChange={setPasswordDialogOpen}
          password={password}
          setPassword={setPassword}
          onSubmit={handlePasswordSubmit}
          onForgotPassword={handleForgotPassword}
          isChangingKey={isChangingKey}
        />

        <AddTransactionDialog
          open={addTransactionOpen}
          onOpenChange={setAddTransactionOpen}
        />
        
        <TransactionEditDialog
          open={editTransactionOpen}
          onOpenChange={setEditTransactionOpen}
          transactionId={selectedTransactionId}
        />
      </div>
    </div>
  );
};

export default TransactionsPage;
