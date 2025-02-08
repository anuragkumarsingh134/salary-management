
import { useState } from "react";
import { Plus, DollarSign, Users, BarChart3 } from "lucide-react";
import { useStaffStore } from "@/store/staffStore";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import StaffList from "@/components/StaffList";
import AddStaffDialog from "@/components/AddStaffDialog";
import TransactionList from "@/components/TransactionList";
import AddTransactionDialog from "@/components/AddTransactionDialog";

const Index = () => {
  const [addStaffOpen, setAddStaffOpen] = useState(false);
  const [addTransactionOpen, setAddTransactionOpen] = useState(false);
  const [selectedStaffId, setSelectedStaffId] = useState<string | null>(null);
  const { staff, transactions } = useStaffStore();

  const totalSalaries = staff.reduce((acc, curr) => acc + curr.salary, 0);
  const totalTransactions = transactions.reduce((acc, curr) => acc + curr.amount, 0);

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

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="p-6 glassmorphism card-hover">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-primary/10 rounded-full">
              <Users className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Staff</p>
              <h3 className="text-2xl font-bold">{staff.length}</h3>
            </div>
          </div>
        </Card>
        
        <Card className="p-6 glassmorphism card-hover">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-primary/10 rounded-full">
              <DollarSign className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Salaries</p>
              <h3 className="text-2xl font-bold">₹{totalSalaries.toLocaleString()}</h3>
            </div>
          </div>
        </Card>

        <Card className="p-6 glassmorphism card-hover">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-primary/10 rounded-full">
              <BarChart3 className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Transactions</p>
              <h3 className="text-2xl font-bold">₹{totalTransactions.toLocaleString()}</h3>
            </div>
          </div>
        </Card>
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
