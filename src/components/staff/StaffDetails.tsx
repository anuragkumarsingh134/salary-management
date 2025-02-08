
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X, Edit2 } from "lucide-react";
import { formatDistanceToNow, differenceInDays } from "date-fns";
import { useToast } from "@/components/ui/use-toast";
import { useState } from "react";
import { StaffMember } from "@/store/staffStore";

interface StaffDetailsProps {
  staff: StaffMember;
  totalTransactions: number;
  onClose: () => void;
  onUpdate: (staffId: string, updates: Partial<StaffMember>) => void;
}

export const StaffDetails = ({ staff, totalTransactions, onClose, onUpdate }: StaffDetailsProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const { toast } = useToast();
  
  const [editForm, setEditForm] = useState({
    name: staff.name,
    position: staff.position,
    salary: staff.salary,
    startDate: staff.startDate
  });

  const calculateSalaryDetails = () => {
    const daysWorked = differenceInDays(new Date(), new Date(staff.startDate));
    const dailyRate = staff.salary / 30;
    const totalEarned = daysWorked * dailyRate;
    
    return {
      daysWorked,
      dailyRate,
      totalEarned
    };
  };

  const salaryDetails = calculateSalaryDetails();

  const handleSave = () => {
    onUpdate(staff.id, editForm);
    setIsEditing(false);
    toast({
      title: "Staff details updated",
      description: "The staff member's details have been successfully updated.",
    });
  };

  return (
    <Card className="p-6 glassmorphism">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Staff Details</h2>
        <div className="flex gap-2">
          {!isEditing && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsEditing(true)}
            >
              <Edit2 className="h-4 w-4" />
            </Button>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              onClose();
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
              {isEditing ? editForm.name[0] : staff.name[0]}
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
              <h3 className="text-xl font-semibold">{staff.name}</h3>
              <p className="text-muted-foreground">{staff.position}</p>
            </div>
          )}
        </div>

        {!isEditing && (
          <>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="p-4 rounded-lg bg-secondary/30">
                <p className="text-sm text-muted-foreground">Monthly Salary</p>
                <p className="text-xl font-semibold">₹{staff.salary.toLocaleString()}</p>
              </div>
              <div className="p-4 rounded-lg bg-secondary/30">
                <p className="text-sm text-muted-foreground">Total Transactions</p>
                <p className="text-xl font-semibold">₹{totalTransactions.toLocaleString()}</p>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold">Employment Information</h4>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="p-4 rounded-lg bg-secondary/30">
                  <p className="text-sm text-muted-foreground">Days Worked</p>
                  <p className="text-xl font-semibold">{salaryDetails.daysWorked} days</p>
                </div>
                <div className="p-4 rounded-lg bg-secondary/30">
                  <p className="text-sm text-muted-foreground">Daily Rate</p>
                  <p className="text-xl font-semibold">₹{salaryDetails.dailyRate.toLocaleString()}</p>
                </div>
                <div className="p-4 rounded-lg bg-secondary/30">
                  <p className="text-sm text-muted-foreground">Total Earned</p>
                  <p className="text-xl font-semibold">₹{salaryDetails.totalEarned.toLocaleString()}</p>
                </div>
                <div className="p-4 rounded-lg bg-secondary/30">
                  <p className="text-sm text-muted-foreground">Balance</p>
                  <p className="text-xl font-semibold">
                    {salaryDetails.totalEarned > totalTransactions ? (
                      <span className="text-green-600">
                        Pending: ₹{(salaryDetails.totalEarned - totalTransactions).toLocaleString()}
                      </span>
                    ) : (
                      <span className="text-red-600">
                        Advance: ₹{Math.abs(salaryDetails.totalEarned - totalTransactions).toLocaleString()}
                      </span>
                    )}
                  </p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                Started {formatDistanceToNow(new Date(staff.startDate))} ago
              </p>
            </div>
          </>
        )}
      </div>
    </Card>
  );
};
