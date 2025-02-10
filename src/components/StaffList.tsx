
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { useStaffStore } from "@/store/staffStore";
import { StaffDetails } from "@/components/staff/StaffDetails";
import { StaffCard } from "@/components/staff/StaffCard";

interface StaffListProps {
  onStaffSelect?: (staffId: string | null) => void;
}

const StaffList = ({ onStaffSelect }: StaffListProps) => {
  const { staff, transactions, updateStaff, deleteStaff } = useStaffStore();
  const [selectedStaff, setSelectedStaff] = useState<string | null>(null);

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

  return (
    <Card className="p-6 glassmorphism">
      <div className="space-y-4">
        {activeStaff.length > 0 && (
          <>
            <h3 className="font-semibold text-lg">Active Staff</h3>
            <div className="space-y-4">
              {activeStaff.map((member) => (
                <StaffCard
                  key={member.id}
                  staff={member}
                  onClick={() => handleStaffSelect(member.id)}
                />
              ))}
            </div>
          </>
        )}
        
        {inactiveStaff.length > 0 && (
          <>
            <h3 className="font-semibold text-lg mt-6">Inactive Staff</h3>
            <div className="space-y-4">
              {inactiveStaff.map((member) => (
                <StaffCard
                  key={member.id}
                  staff={member}
                  onClick={() => handleStaffSelect(member.id)}
                  isInactive
                />
              ))}
            </div>
          </>
        )}
        
        {staff.length === 0 && (
          <p className="text-muted-foreground text-center py-8">
            No staff members found
          </p>
        )}
      </div>
    </Card>
  );
};

export default StaffList;
