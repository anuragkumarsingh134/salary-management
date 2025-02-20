
import React from "react";
import { Plus, DollarSign, Eye, LockKeyhole } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DashboardHeaderProps {
  onAddTransaction: () => void;
  onAddStaff: () => void;
  onToggleShowData: () => void;
  onChangeKey: () => void;
  showData: boolean;
}

const DashboardHeader = ({
  onAddTransaction,
  onAddStaff,
  onToggleShowData,
  onChangeKey,
  showData,
}: DashboardHeaderProps) => {
  return (
    <div className="flex items-center justify-between w-full">
      <h1 className="text-4xl font-bold shrink-0">Dashboard</h1>
      <div className="flex items-center gap-2">
        <Button
          onClick={onAddTransaction}
          size="sm"
          className="bg-primary/90 hover:bg-primary flex items-center gap-2"
        >
          <DollarSign className="h-4 w-4" />
          Add Transaction
        </Button>
        {showData && (
          <Button
            onClick={onAddStaff}
            size="sm"
            className="bg-primary/90 hover:bg-primary flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Add Staff
          </Button>
        )}
        <Button
          onClick={onToggleShowData}
          variant={showData ? "outline" : "default"}
          size="sm"
          className="min-w-[120px] flex items-center gap-2"
        >
          <Eye className="h-4 w-4" />
          {showData ? "Hide Data" : "Show Data"}
        </Button>
        {showData && (
          <Button
            onClick={onChangeKey}
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
          >
            <LockKeyhole className="h-4 w-4" />
            Change Key
          </Button>
        )}
      </div>
    </div>
  );
};

export default DashboardHeader;
