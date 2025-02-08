
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { useStaffStore } from "@/store/staffStore";
import { StaffDetails } from "@/components/staff/StaffDetails";
import { StaffCard } from "@/components/staff/StaffCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface StaffListProps {
  onStaffSelect?: (staffId: string | null) => void;
}

const StaffList = ({ onStaffSelect }: StaffListProps) => {
  const { staff, transactions, updateStaff, deleteStaff } = useStaffStore();
  const [selectedStaff, setSelectedStaff] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"active" | "inactive">("active");

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
    setActiveTab("active");
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
      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "active" | "inactive")} className="flex-none">
        <TabsList>
          <TabsTrigger value="active">Active Staff</TabsTrigger>
          <TabsTrigger value="inactive">Inactive Staff</TabsTrigger>
        </TabsList>
        <TabsContent value="active">
          <div className="space-y-4">
            {activeStaff.map((member) => (
              <StaffCard
                key={member.id}
                staff={member}
                onClick={() => handleStaffSelect(member.id)}
              />
            ))}
            {activeStaff.length === 0 && (
              <p className="text-muted-foreground text-center py-8">
                No active staff members
              </p>
            )}
          </div>
        </TabsContent>
        <TabsContent value="inactive">
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
        </TabsContent>
      </Tabs>
    </Card>
  );
};

export default StaffList;
