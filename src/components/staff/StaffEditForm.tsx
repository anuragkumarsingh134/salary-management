
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { StaffMember } from "@/types/staff";
import { format, isValid, parse } from "date-fns";
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
  const [dateInputValue, setDateInputValue] = useState<string>(
    editForm.startDate ? format(new Date(editForm.startDate), "dd-MM-yyyy") : ""
  );

  useEffect(() => {
    // Update local date state when editForm prop changes
    if (editForm.startDate) {
      try {
        const parsedDate = new Date(editForm.startDate);
        if (isValid(parsedDate)) {
          setDateInputValue(format(parsedDate, "dd-MM-yyyy"));
        }
      } catch (error) {
        console.error('Error parsing staff start date:', error);
      }
    }
  }, [editForm.startDate]);

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setDateInputValue(value);
    
    // Try to parse the input as a date
    if (value && /^\d{2}-\d{2}-\d{4}$/.test(value)) {
      try {
        const parsedDate = parse(value, "dd-MM-yyyy", new Date());
        if (isValid(parsedDate)) {
          onEditFormChange({ startDate: format(parsedDate, 'yyyy-MM-dd') });
        }
      } catch (error) {
        console.error("Error parsing date:", error);
      }
    } else if (!value) {
      onEditFormChange({ startDate: undefined });
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
          <Input
            id="startDate"
            value={dateInputValue}
            onChange={handleDateChange}
            placeholder="DD-MM-YYYY"
          />
        </div>
      </div>
      <Button onClick={onSave} className="w-full mt-4">Save Changes</Button>
    </div>
  );
};
