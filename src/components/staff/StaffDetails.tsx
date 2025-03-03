
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { useState } from "react";
import { StaffMember } from "@/types/staff";
import { StaffHeader } from "./StaffHeader";
import { StaffEditForm } from "./StaffEditForm";
import { StaffInfo } from "./StaffInfo";
import { Dialog } from "@/components/ui/dialog";
import TransactionList from "@/components/TransactionList";

interface StaffDetailsProps {
  staff: StaffMember;
  totalTransactions: number;
  staffTransactions: any[];
  onClose: () => void;
  onUpdate: (staffId: string, updates: Partial<StaffMember>) => void;
  onDelete?: (staffId: string) => void;
  onReactivate?: () => void;
  isInactive?: boolean;
}

export const StaffDetails = ({ 
  staff, 
  totalTransactions,
  staffTransactions,
  onClose, 
  onUpdate,
  onDelete,
  onReactivate,
  isInactive
}: StaffDetailsProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [showTransactions, setShowTransactions] = useState(false);
  const { toast } = useToast();
  
  const [editForm, setEditForm] = useState({
    name: staff.name,
    position: staff.position,
    salary: staff.salary,
    startDate: staff.startDate
  });

  const handleSave = () => {
    onUpdate(staff.id, editForm);
    setIsEditing(false);
    toast({
      title: "Staff details updated",
      description: "The staff member's details have been successfully updated.",
    });
  };

  const handleStatusChange = () => {
    if (isInactive && onReactivate) {
      onReactivate();
      toast({
        title: "Staff member reactivated",
        description: "The staff member has been successfully reactivated.",
      });
    } else {
      onUpdate(staff.id, { active: false });
      onClose();
      toast({
        title: "Staff member deactivated",
        description: "The staff member has been successfully deactivated.",
        variant: "destructive",
      });
    }
  };

  const handleDelete = () => {
    if (onDelete) {
      onDelete(staff.id);
      onClose();
      toast({
        title: "Staff member deleted",
        description: "The staff member and their transactions have been deleted.",
        variant: "destructive",
      });
    }
  };

  return (
    <>
      <Card className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Staff Details</h2>
          <div className="flex items-center space-x-4">
            <span className={`px-3 py-1 rounded-full text-sm ${isInactive ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
              {isInactive ? 'Inactive' : 'Active'}
            </span>
          </div>
        </div>

        <StaffHeader
          isEditing={isEditing}
          isInactive={isInactive}
          onClose={onClose}
          onEdit={() => setIsEditing(true)}
          onDelete={handleDelete}
          onStatusChange={handleStatusChange}
          staffName={staff.name}
        />

        <div className="mt-4">
          {isEditing ? (
            <StaffEditForm
              editForm={editForm}
              onEditFormChange={(updates) => setEditForm({ ...editForm, ...updates })}
              onSave={handleSave}
            />
          ) : (
            <StaffInfo 
              staff={staff} 
              totalTransactions={totalTransactions} 
              onViewTransactions={() => setShowTransactions(true)}
            />
          )}
        </div>
      </Card>

      <Dialog 
        open={showTransactions} 
        onOpenChange={setShowTransactions}
      >
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm" />
        <div className="fixed left-[50%] top-[50%] z-50 grid w-full max-w-4xl translate-x-[-50%] translate-y-[-50%] gap-4 bg-background p-6 shadow-lg duration-200 border rounded-lg">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Transactions for {staff.name}</h2>
            <button 
              className="rounded-full p-1.5 hover:bg-gray-100"
              onClick={() => setShowTransactions(false)}
            >
              ✕
            </button>
          </div>
          <div className="max-h-[500px] overflow-y-auto">
            {staffTransactions.length > 0 ? (
              <div className="space-y-3">
                {staffTransactions.map((transaction) => (
                  <div 
                    key={transaction.id}
                    className="flex justify-between items-center p-4 bg-gray-50 rounded"
                  >
                    <div>
                      <h3 className="font-semibold">{staff.name}</h3>
                      <p className="text-sm text-gray-500">{transaction.description}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">₹{transaction.amount.toLocaleString()}</p>
                      <p className="text-sm text-gray-500">
                        {format(new Date(transaction.date), "d MMM yyyy")}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button className="text-blue-500 hover:text-blue-700">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/></svg>
                      </button>
                      <button className="text-red-500 hover:text-red-700">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center py-10 text-gray-500">No transactions found</p>
            )}
          </div>
        </div>
      </Dialog>
    </>
  );
};
