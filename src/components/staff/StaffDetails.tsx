
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { useState } from "react";
import { StaffMember } from "@/types/staff";
import { StaffHeader } from "./StaffHeader";
import { StaffEditForm } from "./StaffEditForm";
import { StaffInfo } from "./StaffInfo";

interface StaffDetailsProps {
  staff: StaffMember;
  totalTransactions: number;
  onClose: () => void;
  onUpdate: (staffId: string, updates: Partial<StaffMember>) => void;
  onDelete?: (staffId: string) => void;
  onReactivate?: () => void;
  isInactive?: boolean;
}

export const StaffDetails = ({ 
  staff, 
  totalTransactions, 
  onClose, 
  onUpdate,
  onDelete,
  onReactivate,
  isInactive
}: StaffDetailsProps) => {
  const [isEditing, setIsEditing] = useState(false);
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

  const handleStatusChange = (endDate?: Date) => {
    if (isInactive && onReactivate) {
      onReactivate();
    } else if (endDate) {
      // Format the date to YYYY-MM-DD
      const formattedEndDate = endDate.toISOString().split('T')[0];
      onUpdate(staff.id, { 
        active: false,
        endDate: formattedEndDate
      });
      onClose();
      toast({
        title: "Staff member deactivated",
        description: `The staff member has been deactivated effective ${formattedEndDate}.`,
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
    <Card className="p-3 glassmorphism">
      <StaffHeader
        isEditing={isEditing}
        isInactive={isInactive}
        onClose={() => {
          onClose();
          setIsEditing(false);
        }}
        onEdit={() => setIsEditing(true)}
        onDelete={handleDelete}
        onStatusChange={handleStatusChange}
        staffName={staff.name}
      />

      <div className="space-y-2">
        {isEditing ? (
          <StaffEditForm
            editForm={editForm}
            onEditFormChange={(updates) => setEditForm({ ...editForm, ...updates })}
            onSave={handleSave}
          />
        ) : (
          <StaffInfo staff={staff} totalTransactions={totalTransactions} />
        )}
      </div>
    </Card>
  );
};
