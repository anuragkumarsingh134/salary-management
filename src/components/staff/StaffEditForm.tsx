
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { StaffMember } from "@/types/staff";

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
  return (
    <div className="flex-1 space-y-3">
      <div className="grid grid-cols-2 gap-2">
        <Input
          value={editForm.name}
          onChange={(e) => onEditFormChange({ name: e.target.value })}
          placeholder="Name"
        />
        <Input
          value={editForm.position}
          onChange={(e) => onEditFormChange({ position: e.target.value })}
          placeholder="Position"
        />
        <Input
          type="number"
          value={editForm.salary}
          onChange={(e) => onEditFormChange({ salary: Number(e.target.value) })}
          placeholder="Salary"
        />
        <Input
          type="date"
          value={editForm.startDate}
          onChange={(e) => onEditFormChange({ startDate: e.target.value })}
        />
      </div>
      <Button onClick={onSave} className="w-full">Save Changes</Button>
    </div>
  );
};
