
import React, { useState } from "react";
import { Plus, DollarSign, Eye, LockKeyhole, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useStoreSettings } from "@/store/storeSettingsStore";
import { EditStoreDialog } from "./EditStoreDialog";
import { useIsMobile } from "@/hooks/use-mobile";

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
  const { settings } = useStoreSettings();
  const [editStoreOpen, setEditStoreOpen] = useState(false);
  const isMobile = useIsMobile();

  return (
    <div className="flex flex-col w-full gap-4">
      <div className="flex items-center justify-between w-full">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h1 className="text-3xl sm:text-4xl font-bold shrink-0">Dashboard</h1>
            {showData && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setEditStoreOpen(true)}
                className="h-8 w-8"
              >
                <Settings className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
        {!isMobile && (
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
        )}
      </div>
      
      {isMobile && (
        <div className="flex flex-wrap gap-2 w-full">
          <Button
            onClick={onAddTransaction}
            size="sm"
            className="bg-primary/90 hover:bg-primary flex items-center gap-1 px-2 flex-grow"
          >
            <DollarSign className="h-3 w-3" />
            Add Transaction
          </Button>
          {showData && (
            <Button
              onClick={onAddStaff}
              size="sm"
              className="bg-primary/90 hover:bg-primary flex items-center gap-1 px-2 flex-grow"
            >
              <Plus className="h-3 w-3" />
              Add Staff
            </Button>
          )}
          <Button
            onClick={onToggleShowData}
            variant={showData ? "outline" : "default"}
            size="sm"
            className="flex items-center gap-1 px-2 flex-grow"
          >
            <Eye className="h-3 w-3" />
            {showData ? "Hide" : "Show"}
          </Button>
          {showData && (
            <Button
              onClick={onChangeKey}
              variant="outline"
              size="sm"
              className="flex items-center gap-1 px-2 flex-grow"
            >
              <LockKeyhole className="h-3 w-3" />
              Key
            </Button>
          )}
        </div>
      )}
      
      <EditStoreDialog open={editStoreOpen} onOpenChange={setEditStoreOpen} />
    </div>
  );
};

export default DashboardHeader;
