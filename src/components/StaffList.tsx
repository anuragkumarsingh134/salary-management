
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { useStaffStore } from "@/store/staffStore";
import { StaffDetails } from "@/components/staff/StaffDetails";
import { StaffCard } from "@/components/staff/StaffCard";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useIsMobile } from "@/hooks/use-mobile";

interface StaffListProps {
  onStaffSelect?: (staffId: string | null) => void;
  activeStaffOnly?: boolean;
}

const StaffList = ({ onStaffSelect, activeStaffOnly: externalActiveStaffOnly }: StaffListProps) => {
  const { staff, transactions, updateStaff, deleteStaff } = useStaffStore();
  const [selectedStaff, setSelectedStaff] = useState<string | null>(null);
  const [internalShowInactive, setInternalShowInactive] = useState(false);
  const isMobile = useIsMobile();

  // Use the external prop if provided, otherwise use internal state
  const showInactive = externalActiveStaffOnly !== undefined ? !externalActiveStaffOnly : internalShowInactive;

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
    setInternalShowInactive(false);
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

  const currentStaff = showInactive ? inactiveStaff : activeStaff;

  // Only render the toggle if externalActiveStaffOnly is not provided
  const renderToggle = externalActiveStaffOnly === undefined;

  return (
    <Card className={`glassmorphism ${isMobile ? 'p-4' : 'p-6'}`}>
      <div className={`space-y-${isMobile ? '3' : '4'}`}>
        {renderToggle && (
          <div className={`flex items-center space-x-2 ${!isMobile && 'mb-4'}`}>
            <Switch
              id="staff-toggle"
              checked={internalShowInactive}
              onCheckedChange={setInternalShowInactive}
              className="data-[state=checked]:bg-[#ea384c] data-[state=unchecked]:bg-[#00FF00]"
            />
            <Label htmlFor="staff-toggle" className={`font-medium ${isMobile ? 'text-sm' : ''}`}>
              {internalShowInactive ? "Inactive Staff" : "Active Staff"}
            </Label>
          </div>
        )}

        <div className={`grid gap-${isMobile ? '2' : '3'}`}>
          {currentStaff.map((member) => (
            <StaffCard
              key={member.id}
              staff={member}
              onClick={() => handleStaffSelect(member.id)}
              isInactive={!member.active}
            />
          ))}
          {currentStaff.length === 0 && (
            <p className={`text-muted-foreground text-center ${isMobile ? 'py-6 text-sm' : 'py-8'}`}>
              No {showInactive ? "inactive" : "active"} staff members found
            </p>
          )}
        </div>
      </div>
    </Card>
  );
};

export default StaffList;
