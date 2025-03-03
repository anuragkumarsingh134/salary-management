
import * as React from "react"
import { format, parse } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Input } from "@/components/ui/input"

interface DatePickerProps {
  date: Date | undefined
  onDateChange: (date: Date | undefined) => void
  placeholder?: string
}

export function DatePicker({ date, onDateChange, placeholder = "Select date" }: DatePickerProps) {
  const [open, setOpen] = React.useState(false);
  const [inputValue, setInputValue] = React.useState<string>(date ? format(date, "yyyy-MM-dd") : '');

  // Update input value when date prop changes
  React.useEffect(() => {
    if (date) {
      setInputValue(format(date, "yyyy-MM-dd"));
    } else {
      setInputValue('');
    }
  }, [date]);

  // Handle date selection from calendar
  const handleSelect = (newDate: Date | undefined) => {
    console.log("Calendar date selected:", newDate);
    if (newDate) {
      // Create a new Date to avoid any reference issues
      const selectedDate = new Date(newDate);
      onDateChange(selectedDate);
    } else {
      onDateChange(undefined);
    }
    setOpen(false); // Close the popover after selection
  };

  // Handle manual date input
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    
    // Try to parse the input as a date
    if (value && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
      try {
        const parsedDate = parse(value, "yyyy-MM-dd", new Date());
        if (!isNaN(parsedDate.getTime())) {
          onDateChange(parsedDate);
        }
      } catch (error) {
        console.error("Error parsing date:", error);
      }
    } else if (!value) {
      onDateChange(undefined);
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <div className="relative">
        <Input
          value={inputValue}
          onChange={handleInputChange}
          placeholder="YYYY-MM-DD"
          className="w-full pr-10"
        />
        <PopoverTrigger asChild>
          <Button
            variant={"outline"} 
            size="icon"
            className="absolute right-0 top-0 h-full rounded-l-none"
          >
            <CalendarIcon className="h-4 w-4" />
          </Button>
        </PopoverTrigger>
      </div>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={date}
          onSelect={handleSelect}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  )
}
