
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DatePicker } from "@/components/ui/date-picker";
import { StaffMember } from "@/types/staff";
import { parseISO, format } from "date-fns";
import { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";

interface StaffEditFormProps {
  editForm: Pick<StaffMember, 'name' | 'position' | 'salary' | 'startDate'>;
  onEditFormChange: (updates: Partial<Pick<StaffMember, 'name' | 'position' | 'salary' | 'startDate'>>) => void;
  onSave: () => void;
}

export const StaffEditForm = ({
  editForm,
  onEditFormChange,
  onSave,
}: StaffEditFormProps) => {
  const [startDate, setStartDate] = useState<Date | undefined>(
    editForm.startDate ? parseISO(editForm.startDate) : undefined
  );

  useEffect(() => {
    if (editForm.startDate) {
      setStartDate(parseISO(editForm.startDate));
    }
  }, [editForm.startDate]);

  const handleDateChange = (date: Date | undefined) => {
    console.log("Staff start date changed:", date);
    setStartDate(date);
    if (date) {
      onEditFormChange({ startDate: format(date, 'yyyy-MM-dd') });
    }
  };

  return (
    <div className="flex-1 space-y-3">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            value={editForm.name}
            onChange={(e) => onEditFormChange({ name: e.target.value })}
            placeholder="Name"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="position">Position</Label>
          <Input
            id="position"
            value={editForm.position}
            onChange={(e) => onEditFormChange({ position: e.target.value })}
            placeholder="Position"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="salary">Salary (₹)</Label>
          <Input
            id="salary"
            type="number"
            value={editForm.salary}
            onChange={(e) => onEditFormChange({ salary: Number(e.target.value) })}
            placeholder="Salary"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="startDate">Start Date</Label>
          <DatePicker 
            date={startDate} 
            onDateChange={handleDateChange} 
          />
        </div>
      </div>
      <Button onClick={onSave} className="w-full mt-4">Save Changes</Button>
    </div>
  );
};
