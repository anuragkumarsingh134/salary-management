
import React from "react";
import { Plus, DollarSign, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DashboardHeaderProps {
  onAddTransaction: () => void;
  onAddStaff: () => void;
  onToggleShowData: () => void;
  showData: boolean;
}

const DashboardHeader = ({
  onAddTransaction,
  onAddStaff,
  onToggleShowData,
  showData,
}: DashboardHeaderProps) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-4">
      <h1 className="text-4xl font-bold">Dashboard</h1>
      <div className="flex items-center gap-3 flex-wrap">
        <Button
          onClick={onAddTransaction}
          className="bg-primary/90 hover:bg-primary"
          size="sm"
        >
          <DollarSign className="mr-2 h-4 w-4" />
          Add Transaction
        </Button>
        {showData && (
          <Button
            onClick={onAddStaff}
            className="bg-primary/90 hover:bg-primary"
            size="sm"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Staff
          </Button>
        )}
        <Button
          onClick={onToggleShowData}
          variant={showData ? "outline" : "default"}
          size="sm"
          className="min-w-[120px]"
        >
          <Eye className="mr-2 h-4 w-4" />
          {showData ? "Hide Data" : "Show Data"}
        </Button>
      </div>
    </div>
  );
};

export default DashboardHeader;
