
import { Button } from "@/components/ui/button";
import { X, Pencil, Trash2, UserX, UserCheck } from "lucide-react";
import { useState } from "react";
import { DeactivateStaffDialog } from "./DeactivateStaffDialog";

interface StaffHeaderProps {
  isEditing: boolean;
  isInactive?: boolean;
  onClose: () => void;
  onEdit: () => void;
  onDelete?: () => void;
  onStatusChange: (endDate?: Date) => void;
  staffName: string;
}

export const StaffHeader = ({
  isEditing,
  isInactive,
  onClose,
  onEdit,
  onDelete,
  onStatusChange,
  staffName,
}: StaffHeaderProps) => {
  const [isDeactivateDialogOpen, setIsDeactivateDialogOpen] = useState(false);

  const handleStatusChange = () => {
    if (isInactive) {
      // If staff is inactive, reactivate immediately
      onStatusChange();
    } else {
      // If staff is active, show dialog to get end date
      setIsDeactivateDialogOpen(true);
    }
  };

  return (
    <div className="flex justify-between items-center mb-4">
      <h3 className="text-lg font-semibold line-clamp-1">{staffName}</h3>
      <div className="flex space-x-1">
        {!isEditing && (
          <>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleStatusChange}
              title={isInactive ? "Reactivate" : "Deactivate"}
            >
              {isInactive ? (
                <UserCheck className="h-5 w-5 text-green-500" />
              ) : (
                <UserX className="h-5 w-5 text-red-500" />
              )}
            </Button>
            {onDelete && (
              <Button
                variant="ghost"
                size="icon"
                onClick={onDelete}
                title="Delete"
              >
                <Trash2 className="h-5 w-5 text-red-500" />
              </Button>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={onEdit}
              title="Edit"
            >
              <Pencil className="h-5 w-5" />
            </Button>
          </>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          title="Close"
        >
          <X className="h-5 w-5" />
        </Button>
      </div>
      
      <DeactivateStaffDialog
        open={isDeactivateDialogOpen}
        onOpenChange={setIsDeactivateDialogOpen}
        onConfirm={(endDate) => onStatusChange(endDate)}
        staffName={staffName}
      />
    </div>
  );
};
