
import { useEffect } from "react";
import { DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { HolidayList } from "./HolidayList";
import { EditHolidayForm } from "./EditHolidayForm";
import { useHolidayManagement } from "@/hooks/useHolidayManagement";

interface HolidayDialogContentProps {
  staffId: string;
  staffName: string;
  open: boolean;
}

export const HolidayDialogContent = ({
  staffId,
  staffName,
  open
}: HolidayDialogContentProps) => {
  const {
    holidays,
    editingHoliday,
    days,
    reason,
    startDate,
    fetchHolidays,
    handleDelete,
    handleDateChange,
    handleEdit,
    startEdit,
    resetEditingState,
    setDays,
    setReason
  } = useHolidayManagement(staffId);

  useEffect(() => {
    if (open) {
      fetchHolidays();
    }
  }, [open, staffId]);

  return (
    <>
      <DialogHeader>
        <DialogTitle>Manage Holidays for {staffName}</DialogTitle>
      </DialogHeader>

      {editingHoliday ? (
        <EditHolidayForm
          days={days}
          reason={reason}
          startDate={startDate}
          onDaysChange={setDays}
          onReasonChange={setReason}
          onDateChange={handleDateChange}
          onSubmit={handleEdit}
          onCancel={resetEditingState}
        />
      ) : (
        <HolidayList 
          holidays={holidays} 
          onEdit={startEdit} 
          onDelete={handleDelete} 
        />
      )}
    </>
  );
};
