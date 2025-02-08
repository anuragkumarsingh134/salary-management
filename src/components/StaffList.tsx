
import { Card } from "@/components/ui/card";
import { useStaffStore } from "@/store/staffStore";
import { formatDistanceToNow } from "date-fns";

const StaffList = () => {
  const { staff } = useStaffStore();

  return (
    <Card className="p-6 glassmorphism">
      <h2 className="text-2xl font-semibold mb-4">Staff Members</h2>
      <div className="space-y-4">
        {staff.map((member) => (
          <div
            key={member.id}
            className="flex items-center justify-between p-4 rounded-lg bg-secondary/50 hover:bg-secondary/70 transition-colors"
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
              <p className="font-medium">${member.salary.toLocaleString()}/month</p>
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
    </Card>
  );
};

export default StaffList;
