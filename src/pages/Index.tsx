
import { useState, useEffect } from "react";
import { Plus, DollarSign } from "lucide-react";
import { useStaffStore } from "@/store/staffStore";
import { Button } from "@/components/ui/button";
import { NavBar } from "@/components/NavBar";
import StaffList from "@/components/StaffList";
import InactiveStaffList from "@/components/staff/InactiveStaffList";
import AddStaffDialog from "@/components/AddStaffDialog";
import TransactionList from "@/components/TransactionList";
import AddTransactionDialog from "@/components/AddTransactionDialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Index = () => {
  const [addStaffOpen, setAddStaffOpen] = useState(false);
  const [addTransactionOpen, setAddTransactionOpen] = useState(false);
  const [selectedStaffId, setSelectedStaffId] = useState<string | null>(null);
  const { fetchStaff, fetchTransactions, subscribeToStaffChanges } = useStaffStore();

  useEffect(() => {
    fetchStaff();
    fetchTransactions();
    
    // Subscribe to real-time updates and store cleanup function
    const unsubscribe = subscribeToStaffChanges();

    // Cleanup subscription on unmount
    return () => {
      unsubscribe();
    };
  }, [fetchStaff, fetchTransactions, subscribeToStaffChanges]);

  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      <div className="container py-8 flex-1 flex flex-col space-y-8 animate-fadeIn">
        <div className="flex justify-between items-center">
          <h1 className="text-4xl font-bold">Dashboard</h1>
          <div className="space-x-4">
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
          </div>
        </div>

        <Tabs defaultValue="active" className="flex-none">
          <TabsList>
            <TabsTrigger value="active">Active Staff</TabsTrigger>
            <TabsTrigger value="inactive">Inactive Staff</TabsTrigger>
          </TabsList>
          <TabsContent value="active">
            <StaffList onStaffSelect={setSelectedStaffId} />
          </TabsContent>
          <TabsContent value="inactive">
            <InactiveStaffList />
          </TabsContent>
        </Tabs>

        <div className="flex-1 overflow-auto min-h-0">
          <TransactionList selectedStaffId={selectedStaffId} />
        </div>

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
