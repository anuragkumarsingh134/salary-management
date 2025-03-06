
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { Transaction } from "@/types/staff";

interface TransactionFormProps {
  formData: {
    staffId: string;
    amount: string;
    type: Transaction['type'];
    description: string;
  };
  setFormData: (data: any) => void;
  dateValue: string;
  selectedDate: Date;
  isCalendarOpen: boolean;
  setIsCalendarOpen: (open: boolean) => void;
  activeStaff: { id: string; name: string; active?: boolean }[];
  handleDateChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleCalendarSelect: (date: Date | undefined) => void;
  handleSubmit: (e: React.FormEvent) => void;
  submitLabel?: string;
}

const TransactionForm = ({
  formData,
  setFormData,
  dateValue,
  selectedDate,
  isCalendarOpen,
  setIsCalendarOpen,
  activeStaff,
  handleDateChange,
  handleCalendarSelect,
  handleSubmit,
  submitLabel = "Add Transaction"
}: TransactionFormProps) => {
  const isMobile = useIsMobile();

  return (
    <form onSubmit={handleSubmit} className="space-y-4 w-full">
      <div className="space-y-2">
        <Label htmlFor="staffId">Staff Member</Label>
        <Select
          value={formData.staffId}
          onValueChange={(value) =>
            setFormData({ ...formData, staffId: value })
          }
        >
          <SelectTrigger className={cn(isMobile && "text-sm")}>
            <SelectValue placeholder="Select staff member" />
          </SelectTrigger>
          <SelectContent>
            {activeStaff.map((member) => (
              <SelectItem key={member.id} value={member.id}>
                {member.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="amount">Amount (₹)</Label>
        <Input
          id="amount"
          type="number"
          value={formData.amount}
          onChange={(e) =>
            setFormData({ ...formData, amount: e.target.value })
          }
          required
          className={cn(isMobile && "text-sm h-9")}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="type">Type</Label>
        <Select
          value={formData.type}
          onValueChange={(value: Transaction['type']) =>
            setFormData({ ...formData, type: value })
          }
        >
          <SelectTrigger className={cn(isMobile && "text-sm")}>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="salary">Salary</SelectItem>
            <SelectItem value="bonus">Bonus</SelectItem>
            <SelectItem value="withdrawal">Withdrawal</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label>Date</Label>
        <div className="flex gap-2 max-w-full">
          <Input 
            value={dateValue} 
            onChange={handleDateChange} 
            placeholder="DD-MM-YYYY"
            className={cn("flex-1 min-w-0", isMobile && "text-sm h-9")}
          />
          <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                type="button"
                className={cn("flex-shrink-0 w-10 p-0", isMobile && "h-9")}
                onClick={() => setIsCalendarOpen(true)}
              >
                <CalendarIcon className="h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className={cn("w-auto p-0", isMobile && "w-[calc(100vw-64px)]")} align="start">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={handleCalendarSelect}
                initialFocus
                className="pointer-events-auto"
                disabled={(date) => false} // Ensure no dates are disabled
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Input
          id="description"
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
          required
          className={cn(isMobile && "text-sm h-9")}
        />
      </div>
      <Button type="submit" className="w-full">
        {submitLabel}
      </Button>
    </form>
  );
};

export default TransactionForm;
