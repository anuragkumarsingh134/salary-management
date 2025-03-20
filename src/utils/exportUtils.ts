
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { Transaction } from '@/types/staff';

// Add the missing types for jsPDF with autotable
declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: any) => jsPDF;
  }
}

// Prepare transaction data for export
export const prepareTransactionData = (
  transactions: Transaction[],
  getStaffName: (staffId: string) => string
) => {
  return transactions.map(transaction => ({
    'Staff Name': getStaffName(transaction.staffId),
    'Date': transaction.date,
    'Type': transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1),
    'Amount': `₹${transaction.amount.toLocaleString()}`,
    'Description': transaction.description
  }));
};

// Export transactions to PDF
export const exportToPDF = (
  transactions: Transaction[],
  getStaffName: (staffId: string) => string,
  title = 'Transactions Report'
) => {
  const doc = new jsPDF();
  const data = prepareTransactionData(transactions, getStaffName);
  
  // Add title
  doc.setFontSize(18);
  doc.text(title, 14, 22);
  doc.setFontSize(11);
  doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 30);
  
  // Create the table
  doc.autoTable({
    head: [Object.keys(data[0] || {})],
    body: data.map(item => Object.values(item)),
    startY: 40,
    styles: { fontSize: 10, cellPadding: 3 },
    headStyles: { fillColor: [66, 66, 66] },
  });
  
  // Save the PDF
  doc.save('transactions-report.pdf');
};

// Export transactions to Excel
export const exportToExcel = (
  transactions: Transaction[],
  getStaffName: (staffId: string) => string,
  title = 'Transactions Report'
) => {
  const data = prepareTransactionData(transactions, getStaffName);
  
  // Create worksheet from the data
  const worksheet = XLSX.utils.json_to_sheet(data);
  
  // Create workbook and add the worksheet
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Transactions');
  
  // Save the file
  XLSX.writeFile(workbook, 'transactions-report.xlsx');
};
