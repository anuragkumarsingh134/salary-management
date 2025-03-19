
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { useStaffStore } from "@/store/staffStore";
import { StaffDetails } from "@/components/staff/StaffDetails";
import { StaffCard } from "@/components/staff/StaffCard";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useIsMobile } from "@/hooks/use-mobile";
import { useToast } from "@/components/ui/use-toast";
import { ScrollArea } from "@/components/ui/scroll-area";

interface StaffListProps {
  onStaffSelect?: (staffId: string | null) => void;
  activeStaffOnly?: boolean;
}

const StaffList = ({ onStaffSelect, activeStaffOnly: externalActiveStaffOnly }: StaffListProps) => {
  const { staff, transactions, updateStaff, deleteStaff } = useStaffStore();
  const [selectedStaff, setSelectedStaff] = useState<string | null>(null);
  const [internalShowInactive, setInternalShowInactive] = useState(false);
  const isMobile = useIsMobile();
  const { toast } = useToast();

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
    
    // If using internal toggle, switch back to active staff view
    if (externalActiveStaffOnly === undefined) {
      setInternalShowInactive(false);
    }
    
    toast({
      title: "Staff reactivated",
      description: "The staff member has been successfully reactivated.",
      variant: "default",
    });
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
    <Card className={`glassmorphism ${isMobile ? 'p-4' : 'p-6'} flex flex-col h-full`}>
      <div className="flex flex-col h-full space-y-3">
        {renderToggle && (
          <div className="flex items-center space-x-2 mb-2">
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

        <ScrollArea className="flex-1 overflow-auto">
          <div className={`grid gap-${isMobile ? '2' : '3'} pb-4`}>
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
        </ScrollArea>
      </div>
    </Card>
  );
};

export default StaffList;
