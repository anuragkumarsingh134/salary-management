
import { useState, useEffect } from "react";
import { useStaffStore } from "@/store/staffStore";
import { NavBar } from "@/components/NavBar";
import StaffList from "@/components/StaffList";
import AddStaffDialog from "@/components/AddStaffDialog";
import PasswordDialog from "@/components/PasswordDialog";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import LoadingSkeleton from "@/components/dashboard/LoadingSkeleton";
import { usePasswordProtection } from "@/hooks/usePasswordProtection";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";

const Index = () => {
  const [addStaffOpen, setAddStaffOpen] = useState(false);
  const [selectedStaffId, setSelectedStaffId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  
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

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  const handleAddTransaction = () => {
    navigate("/transactions");
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <NavBar />
      <div className="container py-6 flex-1 flex flex-col space-y-6 animate-fadeIn">
        <DashboardHeader
          onAddStaff={() => setAddStaffOpen(true)}
          onToggleShowData={handleShowDataClick}
          showData={showData}
          onChangeKey={handleChangeKey}
          onAddTransaction={handleAddTransaction}
        />

        {showData && (
          <StaffList onStaffSelect={setSelectedStaffId} />
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

        <AddStaffDialog open={addStaffOpen} onOpenChange={setAddStaffOpen} />
      </div>
    </div>
  );
};

export default Index;
