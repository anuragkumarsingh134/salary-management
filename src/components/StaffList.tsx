
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
}

const StaffList = ({ onStaffSelect }: StaffListProps) => {
  const { staff, transactions, updateStaff, deleteStaff } = useStaffStore();
  const [selectedStaff, setSelectedStaff] = useState<string | null>(null);
  const [showInactive, setShowInactive] = useState(false);
  const isMobile = useIsMobile();

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
    setShowInactive(false);
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

  return (
    <Card className={`glassmorphism ${isMobile ? 'p-4' : 'p-6'}`}>
      <div className={`space-y-${isMobile ? '3' : '4'}`}>
        <div className={`flex items-center space-x-2 ${!isMobile && 'mb-4'}`}>
          <Switch
            id="staff-toggle"
            checked={showInactive}
            onCheckedChange={setShowInactive}
            className="data-[state=checked]:bg-[#ea384c] data-[state=unchecked]:bg-[#00FF00]"
          />
          <Label htmlFor="staff-toggle" className={`font-medium ${isMobile ? 'text-sm' : ''}`}>
            {showInactive ? "Inactive Staff" : "Active Staff"}
          </Label>
        </div>

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
