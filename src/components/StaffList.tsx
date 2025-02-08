import { useState } from "react";
import { Card } from "@/components/ui/card";
import { useStaffStore } from "@/store/staffStore";
import { formatDistanceToNow, differenceInDays } from "date-fns";
import { Button } from "@/components/ui/button";
import { X, Edit2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import TransactionList from "@/components/TransactionList";

interface StaffListProps {
  onStaffSelect?: (staffId: string | null) => void;
}

const StaffList = ({ onStaffSelect }: StaffListProps) => {
  const { staff, transactions, updateStaff } = useStaffStore();
  const [selectedStaff, setSelectedStaff] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const { toast } = useToast();

  const handleStaffSelect = (staffId: string | null) => {
    setSelectedStaff(staffId);
    onStaffSelect?.(staffId);
  };

  const selectedStaffMember = staff.find((member) => member.id === selectedStaff);
  const staffTransactions = transactions.filter(
    (transaction) => transaction.staffId === selectedStaff
  );

  const [editForm, setEditForm] = useState({
    name: selectedStaffMember?.name || "",
    position: selectedStaffMember?.position || "",
    salary: selectedStaffMember?.salary || 0,
    startDate: selectedStaffMember?.startDate || ""
  });

  const totalTransactions = staffTransactions.reduce(
    (acc, curr) => acc + curr.amount,
    0
  );

  const calculateSalaryDetails = (staffMember: typeof selectedStaffMember) => {
    if (!staffMember) return null;
    
    const daysWorked = differenceInDays(new Date(), new Date(staffMember.startDate));
    const dailyRate = staffMember.salary / 30;
    const totalEarned = daysWorked * dailyRate;
    
    return {
      daysWorked,
      dailyRate,
      totalEarned
    };
  };

  const handleEdit = () => {
    if (selectedStaffMember) {
      setEditForm({
        name: selectedStaffMember.name,
        position: selectedStaffMember.position,
        salary: selectedStaffMember.salary,
        startDate: selectedStaffMember.startDate
      });
      setIsEditing(true);
    }
  };

  const handleSave = () => {
    if (selectedStaffMember) {
      updateStaff(selectedStaffMember.id, editForm);
      setIsEditing(false);
      toast({
        title: "Staff details updated",
        description: "The staff member's details have been successfully updated.",
      });
    }
  };

  if (selectedStaffMember) {
    const salaryDetails = calculateSalaryDetails(selectedStaffMember);
    return (
      <Card className="p-6 glassmorphism">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold">Staff Details</h2>
          <div className="flex gap-2">
            {!isEditing && (
              <Button
                variant="ghost"
                size="icon"
                onClick={handleEdit}
              >
                <Edit2 className="h-4 w-4" />
              </Button>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                handleStaffSelect(null);
                setIsEditing(false);
              }}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <div className="space-y-6">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="text-2xl font-semibold text-primary">
                {isEditing ? editForm.name[0] : selectedStaffMember.name[0]}
              </span>
            </div>
            {isEditing ? (
              <div className="flex-1 space-y-4">
                <div>
                  <Input
                    value={editForm.name}
                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                    placeholder="Name"
                    className="mb-2"
                  />
                  <Input
                    value={editForm.position}
                    onChange={(e) => setEditForm({ ...editForm, position: e.target.value })}
                    placeholder="Position"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    type="number"
                    value={editForm.salary}
                    onChange={(e) => setEditForm({ ...editForm, salary: Number(e.target.value) })}
                    placeholder="Salary"
                  />
                  <Input
                    type="date"
                    value={editForm.startDate}
                    onChange={(e) => setEditForm({ ...editForm, startDate: e.target.value })}
                  />
                </div>
                <Button onClick={handleSave} className="w-full">Save Changes</Button>
              </div>
            ) : (
              <div>
                <h3 className="text-xl font-semibold">{selectedStaffMember.name}</h3>
                <p className="text-muted-foreground">{selectedStaffMember.position}</p>
              </div>
            )}
          </div>

          {!isEditing && (
            <>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="p-4 rounded-lg bg-secondary/30">
                  <p className="text-sm text-muted-foreground">Monthly Salary</p>
                  <p className="text-xl font-semibold">
                    ₹{selectedStaffMember.salary.toLocaleString()}
                  </p>
                </div>
                <div className="p-4 rounded-lg bg-secondary/30">
                  <p className="text-sm text-muted-foreground">Total Transactions</p>
                  <p className="text-xl font-semibold">
                    ₹{totalTransactions.toLocaleString()}
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-semibold">Employment Information</h4>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="p-4 rounded-lg bg-secondary/30">
                    <p className="text-sm text-muted-foreground">Days Worked</p>
                    <p className="text-xl font-semibold">
                      {salaryDetails?.daysWorked} days
                    </p>
                  </div>
                  <div className="p-4 rounded-lg bg-secondary/30">
                    <p className="text-sm text-muted-foreground">Daily Rate</p>
                    <p className="text-xl font-semibold">
                      ₹{salaryDetails?.dailyRate.toLocaleString()}
                    </p>
                  </div>
                  <div className="p-4 rounded-lg bg-secondary/30">
                    <p className="text-sm text-muted-foreground">Total Earned</p>
                    <p className="text-xl font-semibold">
                      ₹{salaryDetails?.totalEarned.toLocaleString()}
                    </p>
                  </div>
                  <div className="p-4 rounded-lg bg-secondary/30">
                    <p className="text-sm text-muted-foreground">Balance</p>
                    <p className="text-xl font-semibold">
                      {salaryDetails && (salaryDetails.totalEarned > totalTransactions ? (
                        <span className="text-green-600">
                          Pending: ₹{(salaryDetails.totalEarned - totalTransactions).toLocaleString()}
                        </span>
                      ) : (
                        <span className="text-red-600">
                          Advance: ₹{Math.abs(salaryDetails.totalEarned - totalTransactions).toLocaleString()}
                        </span>
                      ))}
                    </p>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">
                  Started {formatDistanceToNow(new Date(selectedStaffMember.startDate))} ago
                </p>
              </div>
            </>
          )}
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6 glassmorphism">
      <h2 className="text-2xl font-semibold mb-4">Staff Members</h2>
      <div className="space-y-4">
        {staff.map((member) => (
          <div
            key={member.id}
            className="flex items-center justify-between p-4 rounded-lg bg-secondary/50 hover:bg-secondary/70 transition-colors cursor-pointer"
            onClick={() => handleStaffSelect(member.id)}
          >
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-lg font-semibold text-primary">
                  {member.name[0]}
                </span>
              </div>
              <div>
                <h3 className="font-medium">{member.name}</h3>
                <p className="text-sm text-muted-foreground">{member.position}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-medium">₹{member.salary.toLocaleString()}/month</p>
              <p className="text-sm text-muted-foreground">
                Joined {formatDistanceToNow(new Date(member.startDate))} ago
              </p>
            </div>
          </div>
        ))}
        {staff.length === 0 && (
          <p className="text-muted-foreground text-center py-8">
            No staff members added yet
          </p>
        )}
      </div>
      <div className="mt-6">
        <TransactionList selectedStaffId={selectedStaff} />
      </div>
    </Card>
  );
};

export default StaffList;
