import { useState } from "react";
import { FileText, Download, Calendar, Filter, ArrowUpRight, ArrowDownRight, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { exportToCSV, exportToExcel, exportToPDF } from "@/lib/export";

const reportTypes = [
  {
    id: "transactions",
    name: "Transaction Report",
    description: "Detailed transaction history with filters",
    icon: ArrowUpRight,
    color: "text-accent",
    bgColor: "bg-accent/10",
  },
  {
    id: "settlements",
    name: "Settlement Report",
    description: "Settlement summaries and reconciliation",
    icon: ArrowDownRight,
    color: "text-success",
    bgColor: "bg-success/10",
  },
  {
    id: "issuing_fees",
    name: "Issuing Fee Report",
    description: "Card issuance fees by status",
    icon: FileText,
    color: "text-info",
    bgColor: "bg-info/10",
  },
  {
    id: "all_fees",
    name: "Comprehensive Fee Report",
    description: "All fee categories combined",
    icon: TrendingUp,
    color: "text-warning",
    bgColor: "bg-warning/10",
  },
];

const sampleTransactions = [
  {
    id: "TXN-20240105-89432",
    cardMasked: "****4532",
    type: "Purchase",
    merchant: "Amazon.com",
    amount: 45000,
    fee: 450,
    status: "successful",
    date: "2024-01-05 14:32",
  },
  {
    id: "TXN-20240105-89431",
    cardMasked: "****8921",
    type: "ATM Withdrawal",
    merchant: "GTBank ATM",
    amount: 100000,
    fee: 350,
    status: "successful",
    date: "2024-01-05 12:15",
  },
  {
    id: "TXN-20240105-89430",
    cardMasked: "****1287",
    type: "Purchase",
    merchant: "Shoprite",
    amount: 32500,
    fee: 325,
    status: "successful",
    date: "2024-01-05 10:48",
  },
  {
    id: "TXN-20240105-89429",
    cardMasked: "****6754",
    type: "Purchase",
    merchant: "Uber",
    amount: 5600,
    fee: 56,
    status: "declined",
    date: "2024-01-05 09:22",
  },
  {
    id: "TXN-20240105-89428",
    cardMasked: "****3398",
    type: "Purchase",
    merchant: "Netflix",
    amount: 4900,
    fee: 49,
    status: "successful",
    date: "2024-01-05 08:05",
  },
];

export default function Reports() {
  const [selectedReport, setSelectedReport] = useState("transactions");
  const [dateRange, setDateRange] = useState("last_30_days");

  const handleExportCSV = () => {
    const exportData = sampleTransactions.map((tx) => ({
      TransactionID: tx.id,
      Card: tx.cardMasked,
      Type: tx.type,
      Merchant: tx.merchant,
      Amount: tx.amount,
      Fee: tx.fee,
      Status: tx.status,
      Date: tx.date,
    }));
    exportToCSV(exportData, `${selectedReport}-report`);
  };

  const handleExportExcel = () => {
    const exportData = sampleTransactions.map((tx) => ({
      TransactionID: tx.id,
      Card: tx.cardMasked,
      Type: tx.type,
      Merchant: tx.merchant,
      Amount: tx.amount,
      Fee: tx.fee,
      Status: tx.status,
      Date: tx.date,
    }));
    exportToExcel(exportData, `${selectedReport}-report`);
  };

  const handleExportPDF = () => {
    const reportTitle = reportTypes.find((r) => r.id === selectedReport)?.name || "Report";
    const exportData = sampleTransactions.map((tx) => ({
      TransactionID: tx.id,
      Card: tx.cardMasked,
      Type: tx.type,
      Merchant: tx.merchant,
      Amount: `₦${tx.amount.toLocaleString()}`,
      Fee: `₦${tx.fee.toLocaleString()}`,
      Status: tx.status,
      Date: tx.date,
    }));
    exportToPDF(exportData, `${selectedReport}-report`, reportTitle);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div className="page-header">
        <h1 className="page-title">Reports</h1>
        <p className="page-description">
          Generate and download reports for transactions, settlements, and fees
        </p>
      </div>

      {/* Report Type Selection */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {reportTypes.map((report) => (
          <button
            key={report.id}
            onClick={() => setSelectedReport(report.id)}
            className={cn(
              "p-4 rounded-xl border-2 text-left transition-all",
              selectedReport === report.id
                ? "border-accent bg-accent/5"
                : "border-border hover:border-accent/50"
            )}
          >
            <div className={cn("p-2 rounded-lg w-fit", report.bgColor)}>
              <report.icon className={cn("w-5 h-5", report.color)} />
            </div>
            <p className="font-medium text-foreground mt-3">{report.name}</p>
            <p className="text-xs text-muted-foreground mt-1">{report.description}</p>
          </button>
        ))}
      </div>

      {/* Filters and Summary */}
      <div className="card-elevated p-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
          <div className="flex flex-wrap gap-3">
            <div className="flex items-center gap-2 px-3 py-2 bg-muted/50 rounded-lg">
              <Calendar className="w-4 h-4 text-muted-foreground" />
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="bg-transparent text-sm font-medium text-foreground focus:outline-none"
              >
                <option value="today">Today</option>
                <option value="last_7_days">Last 7 Days</option>
                <option value="last_30_days">Last 30 Days</option>
                <option value="this_month">This Month</option>
                <option value="last_month">Last Month</option>
                <option value="custom">Custom Range</option>
              </select>
            </div>
            <button className="btn-secondary">
              <Filter className="w-4 h-4" />
              More Filters
            </button>
          </div>
          <div className="flex gap-2">
            <button className="btn-secondary" onClick={handleExportCSV}>
              <Download className="w-4 h-4" />
              CSV
            </button>
            <button className="btn-secondary" onClick={handleExportExcel}>
              <Download className="w-4 h-4" />
              Excel
            </button>
            <button className="btn-accent" onClick={handleExportPDF}>
              <Download className="w-4 h-4" />
              PDF
            </button>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6 p-4 bg-muted/30 rounded-xl">
          <div>
            <p className="text-sm text-muted-foreground">Total Transactions</p>
            <p className="text-2xl font-bold text-foreground">12,847</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Total Value</p>
            <p className="text-2xl font-bold text-foreground">₦89.4M</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Approval Rate</p>
            <p className="text-2xl font-bold text-success">96.2%</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Total Fees</p>
            <p className="text-2xl font-bold text-foreground">₦894,000</p>
          </div>
        </div>

        {/* Data Table */}
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>Transaction ID</th>
                <th>Card</th>
                <th>Type</th>
                <th>Merchant</th>
                <th>Amount</th>
                <th>Fee</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {sampleTransactions.map((tx) => (
                <tr key={tx.id}>
                  <td>
                    <span className="font-mono text-sm text-foreground">{tx.id}</span>
                  </td>
                  <td className="font-mono text-muted-foreground">{tx.cardMasked}</td>
                  <td className="text-muted-foreground">{tx.type}</td>
                  <td className="text-foreground">{tx.merchant}</td>
                  <td className="font-medium text-foreground">
                    ₦{tx.amount.toLocaleString()}
                  </td>
                  <td className="text-muted-foreground">₦{tx.fee.toLocaleString()}</td>
                  <td>
                    <span
                      className={cn(
                        "status-badge",
                        tx.status === "successful" ? "status-active" : "status-blocked"
                      )}
                    >
                      {tx.status}
                    </span>
                  </td>
                  <td className="text-sm text-muted-foreground">{tx.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between pt-4 border-t border-border mt-4">
          <p className="text-sm text-muted-foreground">
            Showing 1-5 of 12,847 transactions
          </p>
          <div className="flex gap-2">
            <button className="btn-ghost text-sm" disabled>
              Previous
            </button>
            <button className="btn-ghost text-sm">
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
