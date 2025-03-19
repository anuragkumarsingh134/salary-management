
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
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const [addStaffOpen, setAddStaffOpen] = useState(false);
  const [addTransactionOpen, setAddTransactionOpen] = useState(false);
  const [selectedStaffId, setSelectedStaffId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeStaffOnly, setActiveStaffOnly] = useState(true);
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

  const handleShowAllTransactions = () => {
    navigate("/transactions-report");
  };

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-white overflow-hidden">
      <NavBar />
      <div className="container max-w-6xl py-4 flex-1 flex flex-col overflow-hidden">
        <DashboardHeader
          onAddTransaction={() => setAddTransactionOpen(true)}
          onAddStaff={() => setAddStaffOpen(true)}
          onToggleShowData={handleShowDataClick}
          onShowAllTransactions={handleShowAllTransactions}
          showData={showData}
        />

        {showData && (
          <div className="flex-1 flex flex-col overflow-hidden">
            <div className="flex items-center mb-4">
              <Switch 
                id="active-staff" 
                checked={activeStaffOnly}
                onCheckedChange={setActiveStaffOnly}
                className="bg-green-500"
              />
              <Label htmlFor="active-staff" className="ml-2 cursor-pointer">
                Active Staff
              </Label>
            </div>
            <div className="flex-1 overflow-hidden">
              <StaffList 
                onStaffSelect={setSelectedStaffId} 
                activeStaffOnly={activeStaffOnly}
              />
            </div>
          </div>
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
