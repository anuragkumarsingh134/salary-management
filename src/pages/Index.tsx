
import { useState, useEffect } from "react";
import { Plus, DollarSign, Eye } from "lucide-react";
import { useStaffStore } from "@/store/staffStore";
import { Button } from "@/components/ui/button";
import { NavBar } from "@/components/NavBar";
import StaffList from "@/components/StaffList";
import AddStaffDialog from "@/components/AddStaffDialog";
import TransactionList from "@/components/TransactionList";
import AddTransactionDialog from "@/components/AddTransactionDialog";
import { Skeleton } from "@/components/ui/skeleton";

const Index = () => {
  const [addStaffOpen, setAddStaffOpen] = useState(false);
  const [addTransactionOpen, setAddTransactionOpen] = useState(false);
  const [selectedStaffId, setSelectedStaffId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showData, setShowData] = useState(false);
  const { 
    fetchStaff, 
    fetchTransactions, 
    subscribeToStaffChanges, 
    subscribeToTransactionChanges 
  } = useStaffStore();

  useEffect(() => {
    const loadData = async () => {
      try {
        // Fetch data in parallel
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
    
    // Subscribe to real-time updates and store cleanup functions
    const unsubscribeStaff = subscribeToStaffChanges();
    const unsubscribeTransactions = subscribeToTransactionChanges();

    // Cleanup subscriptions on unmount
    return () => {
      unsubscribeStaff();
      unsubscribeTransactions();
    };
  }, [fetchStaff, fetchTransactions, subscribeToStaffChanges, subscribeToTransactionChanges]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <NavBar />
        <div className="container py-8 flex-1 flex flex-col space-y-8">
          <div className="flex justify-between items-center">
            <Skeleton className="h-10 w-32" />
            <div className="space-x-4">
              <Skeleton className="h-10 w-32 inline-block" />
              <Skeleton className="h-10 w-32 inline-block" />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-32 w-full" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      <div className="container py-8 flex-1 flex flex-col space-y-8 animate-fadeIn">
        <div className="flex justify-between items-center">
          <h1 className="text-4xl font-bold">Dashboard</h1>
          <div className="space-x-4">
            {showData && (
              <>
                <Button
                  onClick={() => setAddTransactionOpen(true)}
                  className="bg-primary/90 hover:bg-primary"
                >
                  <DollarSign className="mr-2 h-4 w-4" />
                  Add Transaction
                </Button>
                <Button
                  onClick={() => setAddStaffOpen(true)}
                  className="bg-primary/90 hover:bg-primary"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Staff
                </Button>
              </>
            )}
            <Button
              onClick={() => setShowData(!showData)}
              variant={showData ? "outline" : "default"}
              className="min-w-[140px]"
            >
              <Eye className="mr-2 h-4 w-4" />
              {showData ? "Hide Data" : "Show Data"}
            </Button>
          </div>
        </div>

        {showData && (
          <>
            <StaffList onStaffSelect={setSelectedStaffId} />
            <div className="flex-1 overflow-auto min-h-0">
              <TransactionList selectedStaffId={selectedStaffId} />
            </div>
          </>
        )}

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

