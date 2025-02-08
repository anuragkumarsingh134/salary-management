
import { useState } from "react";
import { Plus, DollarSign } from "lucide-react";
import { useStaffStore } from "@/store/staffStore";
import { Button } from "@/components/ui/button";
import StaffList from "@/components/StaffList";
import AddStaffDialog from "@/components/AddStaffDialog";
import TransactionList from "@/components/TransactionList";
import AddTransactionDialog from "@/components/AddTransactionDialog";

const Index = () => {
  const [addStaffOpen, setAddStaffOpen] = useState(false);
  const [addTransactionOpen, setAddTransactionOpen] = useState(false);
  const [selectedStaffId, setSelectedStaffId] = useState<string | null>(null);

  return (
    <div className="container py-8 flex flex-col h-[calc(100vh-2rem)] space-y-8 animate-fadeIn">
      <div className="flex justify-between items-center">
        <h1 className="text-4xl font-bold">Staff Management</h1>
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

      <div className="flex-none">
        <StaffList onStaffSelect={setSelectedStaffId} />
      </div>

      <div className="flex-1 overflow-auto min-h-0">
        <TransactionList selectedStaffId={selectedStaffId} />
      </div>

      <AddStaffDialog open={addStaffOpen} onOpenChange={setAddStaffOpen} />
      <AddTransactionDialog
        open={addTransactionOpen}
        onOpenChange={setAddTransactionOpen}
      />
    </div>
  );
};

export default Index;
