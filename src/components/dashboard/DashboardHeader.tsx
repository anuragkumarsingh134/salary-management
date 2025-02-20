
import React, { useState } from "react";
import { Plus, DollarSign, Eye, LockKeyhole, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useStoreSettings } from "@/store/storeSettingsStore";
import { EditStoreDialog } from "./EditStoreDialog";
import { Card } from "@/components/ui/card";

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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between w-full">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h1 className="text-4xl font-bold shrink-0">Dashboard</h1>
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
          <p className="text-muted-foreground">{settings?.storeName}</p>
        </div>
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

      {showData && settings && (
        <Card className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="space-y-2">
              <h3 className="font-medium">Store Information</h3>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Store Name</p>
                <p className="font-medium">{settings.storeName}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Owner</p>
                <p className="font-medium">{settings.ownerName}</p>
              </div>
            </div>
            <div className="space-y-2">
              <h3 className="font-medium">Contact Details</h3>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Phone</p>
                <p className="font-medium">{settings.phone}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Country</p>
                <p className="font-medium">{settings.country}</p>
              </div>
            </div>
            <div className="space-y-2">
              <h3 className="font-medium">Location</h3>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Address</p>
                <p className="font-medium">{settings.address}</p>
              </div>
            </div>
          </div>
        </Card>
      )}

      <EditStoreDialog open={editStoreOpen} onOpenChange={setEditStoreOpen} />
    </div>
  );
};

export default DashboardHeader;
