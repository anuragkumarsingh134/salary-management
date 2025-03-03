
import React from "react";
import { DollarSign, Plus, Eye, EyeOff, KeyRound } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DashboardHeaderProps {
  onAddTransaction: () => void;
  onAddStaff: () => void;
  onToggleShowData: () => void;
  showData: boolean;
  onChangeKey?: () => void;
}

const DashboardHeader = ({
  onAddTransaction,
  onAddStaff,
  onToggleShowData,
  showData,
  onChangeKey,
}: DashboardHeaderProps) => {
  return (
    <div className="flex justify-between items-center py-4">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      <div className="flex space-x-2">
        <Button
          onClick={onAddTransaction}
          variant="default"
          className="bg-gray-800 hover:bg-gray-700"
        >
          <DollarSign className="mr-2 h-4 w-4" />
          Add Transaction
        </Button>
        {showData && (
          <Button
            onClick={onAddStaff}
            variant="default"
            className="bg-gray-800 hover:bg-gray-700"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Staff
          </Button>
        )}
        <Button
          onClick={onToggleShowData}
          variant="outline"
          className="border-gray-300"
        >
          {showData ? (
            <>
              <EyeOff className="mr-2 h-4 w-4" />
              Hide Data
            </>
          ) : (
            <>
              <Eye className="mr-2 h-4 w-4" />
              Show Data
            </>
          )}
        </Button>
        {showData && onChangeKey && (
          <Button
            onClick={onChangeKey}
            variant="outline"
            className="border-gray-300"
          >
            <KeyRound className="mr-2 h-4 w-4" />
            Change Key
          </Button>
        )}
      </div>
    </div>
  );
};

export default DashboardHeader;
