
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
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold">Dashboard</h1>
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
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <Button
          onClick={onAddTransaction}
          size="default"
          className="bg-zinc-800 hover:bg-zinc-900 flex items-center justify-center gap-2 h-12"
        >
          <DollarSign className="h-5 w-5" />
          <span className="font-medium">Transaction</span>
        </Button>
        
        {showData && (
          <Button
            onClick={onAddStaff}
            size="default"
            className="bg-zinc-800 hover:bg-zinc-900 flex items-center justify-center gap-2 h-12"
          >
            <Plus className="h-5 w-5" />
            <span className="font-medium">Staff</span>
          </Button>
        )}
        
        <Button
          onClick={onToggleShowData}
          variant="outline"
          size="default"
          className="flex items-center justify-center gap-2 border border-zinc-200 h-12"
        >
          <Eye className="h-5 w-5" />
          <span className="font-medium">{showData ? 'Hide' : 'Show'}</span>
        </Button>
        
        {showData && (
          <Button
            onClick={onChangeKey}
            variant="outline"
            size="default"
            className="flex items-center justify-center gap-2 border border-zinc-200 h-12"
          >
            <LockKeyhole className="h-5 w-5" />
            <span className="font-medium">Key</span>
          </Button>
        )}
      </div>
      
      <EditStoreDialog open={editStoreOpen} onOpenChange={setEditStoreOpen} />
    </div>
  );
};

export default DashboardHeader;
