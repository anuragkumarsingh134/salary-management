
import { Button } from "@/components/ui/button";
import { PlusCircle, Eye, EyeOff, Key } from "lucide-react";
import { EditStoreDialog } from "./EditStoreDialog";
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
  const { settings } = useStoreSettings();

  return (
    <div className="mb-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div className="flex items-center">
          <h1 className="text-2xl font-bold tracking-tight mr-2">
            Dashboard
          </h1>
          {showData && (
            <Button 
              variant="ghost" 
              size="sm" 
              className="p-1 h-auto" 
              onClick={() => setEditStoreOpen(true)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="3"></circle>
                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
              </svg>
            </Button>
          )}
        </div>
        <div className="flex flex-wrap gap-2 mt-4 md:mt-0">
          <Button 
            size="sm" 
            onClick={onAddTransaction}
            className="bg-zinc-800 hover:bg-zinc-700"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
            Add Transaction
          </Button>
          
          {showData ? (
            <>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={onAddStaff}
                className="bg-zinc-800 text-white border-zinc-700 hover:bg-zinc-700"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                  <line x1="12" y1="5" x2="12" y2="19"></line>
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                </svg>
                Add Staff
              </Button>
              <Button variant="outline" size="sm" onClick={onToggleShowData} className="bg-transparent border-zinc-200">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                  <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                  <line x1="1" y1="1" x2="23" y2="23"></line>
                </svg>
                Hide Data
              </Button>
            </>
          ) : (
            <Button variant="outline" size="sm" onClick={onToggleShowData} className="bg-transparent border-zinc-200">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                <circle cx="12" cy="12" r="3"></circle>
              </svg>
              Show Data
            </Button>
          )}
          
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onChangeKey}
            className="bg-transparent border-zinc-200"
          >
            <Key className="h-4 w-4 mr-2" />
            Change Key
          </Button>
        </div>
      </div>
      
      <EditStoreDialog open={editStoreOpen} onOpenChange={setEditStoreOpen} />
    </div>
  );
};

export default DashboardHeader;
