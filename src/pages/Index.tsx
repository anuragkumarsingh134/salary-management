
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const Index = () => {
  const [addStaffOpen, setAddStaffOpen] = useState(false);
  const [addTransactionOpen, setAddTransactionOpen] = useState(false);
  const [selectedStaffId, setSelectedStaffId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showData, setShowData] = useState(false);
  const [passwordDialogOpen, setPasswordDialogOpen] = useState(false);
  const [password, setPassword] = useState("");
  const { toast } = useToast();
  
  const { 
    fetchStaff, 
    fetchTransactions, 
    subscribeToStaffChanges, 
    subscribeToTransactionChanges 
  } = useStaffStore();

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Get the current user's settings
      const { data: settings, error: fetchError } = await supabase
        .from('user_settings')
        .select('show_data_password')
        .single();

      if (fetchError) {
        if (fetchError.code === 'PGRST116') {
          // No settings found, create initial settings with the entered password
          const { error: insertError } = await supabase
            .from('user_settings')
            .insert([
              {
                show_data_password: password,
                user_id: (await supabase.auth.getUser()).data.user?.id
              }
            ]);

          if (insertError) throw insertError;

          setShowData(true);
          setPasswordDialogOpen(false);
          setPassword("");
          toast({
            title: "Password Set",
            description: "Your password has been set and data is now visible.",
          });
          return;
        }
        throw fetchError;
      }

      if (settings.show_data_password === password) {
        setShowData(true);
        setPasswordDialogOpen(false);
        setPassword("");
        toast({
          title: "Access Granted",
          description: "You now have access to view the data.",
        });
      } else {
        toast({
          title: "Access Denied",
          description: "Incorrect password. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      console.error('Error handling password:', error);
      toast({
        title: "Error",
        description: "An error occurred while checking the password.",
        variant: "destructive",
      });
    }
  };

  const handleShowDataClick = () => {
    if (!showData) {
      setPasswordDialogOpen(true);
    } else {
      setShowData(false);
    }
  };

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
            <Button
              onClick={() => setAddTransactionOpen(true)}
              className="bg-primary/90 hover:bg-primary"
            >
              <DollarSign className="mr-2 h-4 w-4" />
              Add Transaction
            </Button>
            {showData && (
              <Button
                onClick={() => setAddStaffOpen(true)}
                className="bg-primary/90 hover:bg-primary"
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Staff
              </Button>
            )}
            <Button
              onClick={handleShowDataClick}
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

        <Dialog open={passwordDialogOpen} onOpenChange={setPasswordDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Enter Password</DialogTitle>
            </DialogHeader>
            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <Input
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoFocus
              />
              <Button type="submit" className="w-full">
                Submit
              </Button>
            </form>
          </DialogContent>
        </Dialog>

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
