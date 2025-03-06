
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
    <div className="flex flex-col gap-3">
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
      
      <div className="grid grid-cols-2 gap-2">
        <Button
          onClick={onAddTransaction}
          size="sm"
          className="bg-primary/90 hover:bg-primary flex items-center justify-center gap-1 px-3 h-10"
        >
          <DollarSign className="h-4 w-4" />
          Transaction
        </Button>
        {showData && (
          <Button
            onClick={onAddStaff}
            size="sm"
            className="bg-primary/90 hover:bg-primary flex items-center justify-center gap-1 px-3 h-10"
          >
            <Plus className="h-4 w-4" />
            Staff
          </Button>
        )}
        <Button
          onClick={onToggleShowData}
          variant={showData ? "outline" : "default"}
          size="sm"
          className="flex items-center justify-center gap-1 px-3 h-10"
        >
          <Eye className="h-4 w-4" />
          {showData ? 'Hide' : 'Show'}
        </Button>
        {showData && (
          <Button
            onClick={onChangeKey}
            variant="outline"
            size="sm"
            className="flex items-center justify-center gap-1 px-3 h-10"
          >
            <LockKeyhole className="h-4 w-4" />
            Key
          </Button>
        )}
      </div>
      
      <EditStoreDialog open={editStoreOpen} onOpenChange={setEditStoreOpen} />
    </div>
  );
};

export default DashboardHeader;
