
import { useState, useEffect } from "react";
import { useStaffStore } from "@/store/staffStore";
import { useStoreSettings } from "@/store/storeSettingsStore";
import { NavBar } from "@/components/NavBar";
import StaffList from "@/components/StaffList";
import AddStaffDialog from "@/components/AddStaffDialog";
import AddTransactionDialog from "@/components/AddTransactionDialog";
import PasswordDialog from "@/components/PasswordDialog";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import LoadingSkeleton from "@/components/dashboard/LoadingSkeleton";
import { usePasswordProtection } from "@/hooks/usePasswordProtection";

const Index = () => {
  const [addStaffOpen, setAddStaffOpen] = useState(false);
  const [addTransactionOpen, setAddTransactionOpen] = useState(false);
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
  } = usePasswordProtection();

  const { 
    fetchStaff, 
    fetchTransactions, 
    subscribeToStaffChanges, 
    subscribeToTransactionChanges 
  } = useStaffStore();

  const { fetchSettings } = useStoreSettings();

  useEffect(() => {
    const loadData = async () => {
      try {
        await Promise.all([
          fetchStaff(),
          fetchTransactions(),
          fetchSettings()
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
  }, [fetchStaff, fetchTransactions, fetchSettings, subscribeToStaffChanges, subscribeToTransactionChanges]);

  const handleChangeKey = () => {
    setPasswordDialogOpen(true);
  };

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      <div className="container py-8 flex-1 flex flex-col space-y-8 animate-fadeIn">
        <DashboardHeader
          onAddTransaction={() => setAddTransactionOpen(true)}
          onAddStaff={() => setAddStaffOpen(true)}
          onToggleShowData={handleShowDataClick}
          onChangeKey={handleChangeKey}
          showData={showData}
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
        />

        <AddStaffDialog open={addStaffOpen} onOpenChange={setAddStaffOpen} />
        <AddTransactionDialog
          open={addTransactionOpen}
          onOpenChange={setAddTransactionOpen}
        />
      </div>
    </div>
  );
};

export default Index;
