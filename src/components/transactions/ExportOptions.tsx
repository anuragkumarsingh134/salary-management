
import { Button } from "@/components/ui/button";
import { DownloadIcon, FileSpreadsheet } from "lucide-react";
import { Transaction } from "@/types/staff";
import { exportToPDF, exportToExcel } from "@/utils/exportUtils";

interface ExportOptionsProps {
  transactions: Transaction[];
  getStaffName: (staffId: string) => string;
  disabled?: boolean;
}

const ExportOptions = ({ transactions, getStaffName, disabled = false }: ExportOptionsProps) => {
  if (transactions.length === 0) {
    return null;
  }

  return (
    <div className="flex gap-2">
      <Button 
        variant="outline" 
        size="sm" 
        onClick={() => exportToPDF(transactions, getStaffName)}
        disabled={disabled}
      >
        <DownloadIcon className="mr-2 h-4 w-4" />
        Export PDF
      </Button>
      
      <Button 
        variant="outline" 
        size="sm" 
        onClick={() => exportToExcel(transactions, getStaffName)}
        disabled={disabled}
      >
        <FileSpreadsheet className="mr-2 h-4 w-4" />
        Export Excel
      </Button>
    </div>
  );
};

export default ExportOptions;
