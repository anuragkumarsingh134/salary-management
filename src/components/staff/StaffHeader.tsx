
import { Button } from "@/components/ui/button";
import { X, Edit2, Trash2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useIsMobile } from "@/hooks/use-mobile";

interface StaffHeaderProps {
  isEditing: boolean;
  isInactive?: boolean;
  onClose: () => void;
  onEdit: () => void;
  onDelete?: () => void;
  onStatusChange: () => void;
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
  const isMobile = useIsMobile();

  return (
    <div className="flex justify-between items-center gap-2 mb-2">
      <h2 className="text-lg font-semibold">Staff Details</h2>
      <div className="flex gap-1 items-center">
        {!isEditing && (
          <>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="ghost"
                  className={`h-8 ${
                    isInactive
                      ? "text-red-500 hover:text-red-700 hover:bg-red-100"
                      : "text-green-500 hover:text-green-700 hover:bg-green-100"
                  }`}
                >
                  {isInactive ? "Inactive" : "Active"}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="sm:max-w-[425px]">
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    {isInactive
                      ? "This will reactivate the staff member's account."
                      : "This will deactivate the staff member's account. They will be moved to the inactive staff list."}
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={onStatusChange}
                    className={isInactive ? "bg-green-500 hover:bg-green-600" : "bg-red-500 hover:bg-red-600"}
                  >
                    {isInactive ? "Reactivate" : "Deactivate"}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
            {!isInactive && (
              <>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-red-500 hover:text-red-700 hover:bg-red-100 h-8 w-8"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent className="sm:max-w-[425px]">
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete {staffName}'s
                        profile and all associated transactions.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={onDelete}
                        className="bg-red-500 hover:bg-red-600"
                      >
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onEdit}
                  className="h-8 w-8"
                >
                  <Edit2 className="h-4 w-4" />
                </Button>
              </>
            )}
          </>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="h-8 w-8"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};
