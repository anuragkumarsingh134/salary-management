
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { useStaffStore } from "@/store/staffStore";
import { StaffDetails } from "@/components/staff/StaffDetails";
import { StaffCard } from "@/components/staff/StaffCard";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

interface StaffListProps {
  onStaffSelect?: (staffId: string | null) => void;
}

const StaffList = ({ onStaffSelect }: StaffListProps) => {
  const { staff, transactions, updateStaff, deleteStaff } = useStaffStore();
  const [selectedStaff, setSelectedStaff] = useState<string | null>(null);
  const [viewType, setViewType] = useState<"active" | "inactive">("active");

  const activeStaff = staff.filter((member) => member.active);
  const inactiveStaff = staff.filter((member) => !member.active);

  const handleStaffSelect = (staffId: string | null) => {
    setSelectedStaff(staffId);
    onStaffSelect?.(staffId);
  };

  const handleReactivate = async (staffId: string) => {
    await updateStaff(staffId, { active: true });
    setSelectedStaff(null);
    onStaffSelect?.(null);
    setViewType("active");
  };

  const selectedStaffMember = staff.find((member) => member.id === selectedStaff);
  const staffTransactions = transactions.filter(
    (transaction) => transaction.staffId === selectedStaff
  );

  const totalTransactions = staffTransactions.reduce(
    (acc, curr) => acc + curr.amount,
    0
  );

  if (selectedStaffMember) {
    return (
      <StaffDetails
        staff={selectedStaffMember}
        totalTransactions={totalTransactions}
        onClose={() => handleStaffSelect(null)}
        onUpdate={updateStaff}
        onDelete={deleteStaff}
        onReactivate={!selectedStaffMember.active ? () => handleReactivate(selectedStaffMember.id) : undefined}
        isInactive={!selectedStaffMember.active}
      />
    );
  }

  const currentStaff = viewType === "active" ? activeStaff : inactiveStaff;

  return (
    <Card className="p-6 glassmorphism">
      <div className="space-y-4">
        <ToggleGroup
          type="single"
          value={viewType}
          onValueChange={(value) => value && setViewType(value as "active" | "inactive")}
          className="justify-start"
        >
          <ToggleGroupItem value="active" aria-label="Show active staff">
            Active Staff
          </ToggleGroupItem>
          <ToggleGroupItem value="inactive" aria-label="Show inactive staff">
            Inactive Staff
          </ToggleGroupItem>
        </ToggleGroup>

        <div className="space-y-4">
          {currentStaff.map((member) => (
            <StaffCard
              key={member.id}
              staff={member}
              onClick={() => handleStaffSelect(member.id)}
              isInactive={!member.active}
            />
          ))}
          {currentStaff.length === 0 && (
            <p className="text-muted-foreground text-center py-8">
              No {viewType} staff members found
            </p>
          )}
        </div>
      </div>
    </Card>
  );
};

export default StaffList;
