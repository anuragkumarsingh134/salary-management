
import { Button } from "@/components/ui/button";
import { PlusCircle, Eye, EyeOff, Key, BarChart } from "lucide-react";
import EditStoreDialog from "./EditStoreDialog";
import { useState } from "react";
import { useStoreSettings } from "@/store/storeSettingsStore";
import { Link } from "react-router-dom";

interface DashboardHeaderProps {
  onAddStaff: () => void;
  onAddTransaction: () => void;
  onToggleShowData: () => void;
  onChangeKey: () => void;
  showData: boolean;
}

const DashboardHeader = ({
  onAddStaff,
  onAddTransaction,
  onToggleShowData,
  onChangeKey,
  showData
}: DashboardHeaderProps) => {
  const [editStoreOpen, setEditStoreOpen] = useState(false);
  const { storeSettings } = useStoreSettings();

  return (
    <div className="p-6 rounded-lg bg-muted/50 glassmorphism">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {storeSettings?.store_name || "My Store"}
          </h1>
          <p className="text-muted-foreground">
            Manage your staff and transactions
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" onClick={() => setEditStoreOpen(true)}>
            Edit Store
          </Button>
          <Button 
            variant={showData ? "default" : "outline"} 
            size="sm" 
            onClick={onToggleShowData}
          >
            {showData ? (
              <>
                <EyeOff className="h-4 w-4 mr-2" />
                Hide Data
              </>
            ) : (
              <>
                <Eye className="h-4 w-4 mr-2" />
                Show Data
              </>
            )}
          </Button>
          <Button variant="outline" size="sm" onClick={onChangeKey}>
            <Key className="h-4 w-4 mr-2" />
            Change Key
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            asChild
          >
            <Link to="/transactions-report">
              <BarChart className="h-4 w-4 mr-2" />
              Transactions Report
            </Link>
          </Button>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
        <Button onClick={onAddStaff} className="md:col-span-1">
          <PlusCircle className="h-4 w-4 mr-2" />
          Add Staff
        </Button>
        <Button onClick={onAddTransaction} variant="secondary" className="md:col-span-2">
          <PlusCircle className="h-4 w-4 mr-2" />
          Add Transaction
        </Button>
      </div>
      <EditStoreDialog open={editStoreOpen} onOpenChange={setEditStoreOpen} />
    </div>
  );
};

export default DashboardHeader;
