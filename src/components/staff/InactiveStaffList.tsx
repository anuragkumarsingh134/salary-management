
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { useStaffStore } from "@/store/staffStore";
import { StaffCard } from "@/components/staff/StaffCard";
import { StaffDetails } from "@/components/staff/StaffDetails";

const InactiveStaffList = () => {
  const { staff, updateStaff } = useStaffStore();
  const [selectedStaff, setSelectedStaff] = useState<string | null>(null);

  const inactiveStaff = staff.filter((member) => !member.active);

  const handleStaffSelect = (staffId: string | null) => {
    setSelectedStaff(staffId);
  };

  const handleReactivate = async (staffId: string) => {
    await updateStaff(staffId, { active: true });
    setSelectedStaff(null);
  };

  const selectedStaffMember = staff.find((member) => member.id === selectedStaff);

  if (selectedStaffMember) {
    return (
      <StaffDetails
        staff={selectedStaffMember}
        totalTransactions={0}
        onClose={() => handleStaffSelect(null)}
        onUpdate={updateStaff}
        onReactivate={() => handleReactivate(selectedStaffMember.id)}
        isInactive
      />
    );
  }

  return (
    <Card className="p-6 glassmorphism">
      <h2 className="text-2xl font-semibold mb-4">Inactive Staff Members</h2>
      <div className="space-y-4">
        {inactiveStaff.map((member) => (
          <StaffCard
            key={member.id}
            staff={member}
            onClick={() => handleStaffSelect(member.id)}
            isInactive
          />
        ))}
        {inactiveStaff.length === 0 && (
          <p className="text-muted-foreground text-center py-8">
            No inactive staff members
          </p>
        )}
      </div>
    </Card>
  );
};

export default InactiveStaffList;
