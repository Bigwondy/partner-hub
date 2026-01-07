import { useState } from "react";
import { FileText, Download, Calendar, Filter, ArrowUpRight, ArrowDownRight, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";
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

// Transaction Report Data
const transactionData = [
  { id: "TXN-20240105-89432", cardMasked: "****4532", type: "Purchase", merchant: "Amazon.com", amount: 45000, fee: 450, status: "successful", date: "2024-01-05 14:32" },
  { id: "TXN-20240105-89431", cardMasked: "****8921", type: "ATM Withdrawal", merchant: "GTBank ATM", amount: 100000, fee: 350, status: "successful", date: "2024-01-05 12:15" },
  { id: "TXN-20240105-89430", cardMasked: "****1287", type: "Purchase", merchant: "Shoprite", amount: 32500, fee: 325, status: "successful", date: "2024-01-05 10:48" },
  { id: "TXN-20240105-89429", cardMasked: "****6754", type: "Purchase", merchant: "Uber", amount: 5600, fee: 56, status: "declined", date: "2024-01-05 09:22" },
  { id: "TXN-20240105-89428", cardMasked: "****3398", type: "Purchase", merchant: "Netflix", amount: 4900, fee: 49, status: "successful", date: "2024-01-05 08:05" },
];

// Settlement Report Data
const settlementData = [
  { id: "STL-2024010501", date: "2024-01-05", transactionCount: 1248, grossAmount: 45890000, fees: 458900, netAmount: 45431100, status: "completed" },
  { id: "STL-2024010401", date: "2024-01-04", transactionCount: 1156, grossAmount: 38750000, fees: 387500, netAmount: 38362500, status: "completed" },
  { id: "STL-2024010301", date: "2024-01-03", transactionCount: 987, grossAmount: 32100000, fees: 321000, netAmount: 31779000, status: "completed" },
  { id: "STL-2024010201", date: "2024-01-02", transactionCount: 1089, grossAmount: 41230000, fees: 412300, netAmount: 40817700, status: "pending" },
  { id: "STL-2024010101", date: "2024-01-01", transactionCount: 756, grossAmount: 28900000, fees: 289000, netAmount: 28611000, status: "completed" },
];

// Issuing Fee Report Data
const issuingFeeData = [
  { id: "ISF-001", cardType: "Visa Debit", category: "Instant Card", issuedCount: 245, feePerCard: 2500, totalFees: 612500, partnerShare: 306250, bankShare: 306250, period: "Jan 2024" },
  { id: "ISF-002", cardType: "Mastercard Prepaid", category: "Embossed Card", issuedCount: 128, feePerCard: 5000, totalFees: 640000, partnerShare: 320000, bankShare: 320000, period: "Jan 2024" },
  { id: "ISF-003", cardType: "Visa Virtual", category: "Virtual Card", issuedCount: 512, feePerCard: 500, totalFees: 256000, partnerShare: 128000, bankShare: 128000, period: "Jan 2024" },
  { id: "ISF-004", cardType: "Visa Debit", category: "Reissue", issuedCount: 67, feePerCard: 2000, totalFees: 134000, partnerShare: 67000, bankShare: 67000, period: "Jan 2024" },
  { id: "ISF-005", cardType: "Mastercard Prepaid", category: "Instant Card", issuedCount: 189, feePerCard: 2500, totalFees: 472500, partnerShare: 236250, bankShare: 236250, period: "Jan 2024" },
];

// Comprehensive Fee Report Data
const comprehensiveFeeData = [
  { id: "FEE-001", category: "Card Issuance", subCategory: "Instant Cards", transactionCount: 434, grossFees: 1085000, partnerShare: 542500, bankShare: 542500, period: "Jan 2024" },
  { id: "FEE-002", category: "Card Issuance", subCategory: "Embossed Cards", transactionCount: 128, grossFees: 640000, partnerShare: 320000, bankShare: 320000, period: "Jan 2024" },
  { id: "FEE-003", category: "Card Issuance", subCategory: "Virtual Cards", transactionCount: 512, grossFees: 256000, partnerShare: 128000, bankShare: 128000, period: "Jan 2024" },
  { id: "FEE-004", category: "Transaction Fees", subCategory: "POS Transactions", transactionCount: 8456, grossFees: 845600, partnerShare: 422800, bankShare: 422800, period: "Jan 2024" },
  { id: "FEE-005", category: "Transaction Fees", subCategory: "ATM Withdrawals", transactionCount: 2341, grossFees: 819350, partnerShare: 409675, bankShare: 409675, period: "Jan 2024" },
  { id: "FEE-006", category: "Transaction Fees", subCategory: "Online Purchases", transactionCount: 5678, grossFees: 567800, partnerShare: 283900, bankShare: 283900, period: "Jan 2024" },
  { id: "FEE-007", category: "Maintenance Fees", subCategory: "Monthly Fees", transactionCount: 4520, grossFees: 452000, partnerShare: 226000, bankShare: 226000, period: "Jan 2024" },
  { id: "FEE-008", category: "Other Fees", subCategory: "PIN Remail", transactionCount: 89, grossFees: 44500, partnerShare: 22250, bankShare: 22250, period: "Jan 2024" },
];

interface StatItem {
  label: string;
  value: string;
  className?: string;
}

interface ReportStats {
  stat1: StatItem;
  stat2: StatItem;
  stat3: StatItem;
  stat4: StatItem;
}

const summaryStats: Record<string, ReportStats> = {
  transactions: {
    stat1: { label: "Total Transactions", value: "12,847" },
    stat2: { label: "Total Value", value: "₦89.4M" },
    stat3: { label: "Approval Rate", value: "96.2%", className: "text-success" },
    stat4: { label: "Total Fees", value: "₦894,000" },
  },
  settlements: {
    stat1: { label: "Total Settlements", value: "31" },
    stat2: { label: "Gross Amount", value: "₦186.8M" },
    stat3: { label: "Total Fees", value: "₦1.87M" },
    stat4: { label: "Net Settled", value: "₦185M", className: "text-success" },
  },
  issuing_fees: {
    stat1: { label: "Cards Issued", value: "1,141" },
    stat2: { label: "Total Fees", value: "₦2.11M" },
    stat3: { label: "Partner Share", value: "₦1.06M", className: "text-success" },
    stat4: { label: "Bank Share", value: "₦1.06M" },
  },
  all_fees: {
    stat1: { label: "Fee Categories", value: "8" },
    stat2: { label: "Gross Fees", value: "₦4.71M" },
    stat3: { label: "Partner Revenue", value: "₦2.35M", className: "text-success" },
    stat4: { label: "Bank Revenue", value: "₦2.35M" },
  },
};

export default function Reports() {
  const [selectedReport, setSelectedReport] = useState("transactions");
  const [dateRange, setDateRange] = useState("last_30_days");

  const getCurrentData = () => {
    switch (selectedReport) {
      case "transactions": return transactionData;
      case "settlements": return settlementData;
      case "issuing_fees": return issuingFeeData;
      case "all_fees": return comprehensiveFeeData;
      default: return transactionData;
    }
  };

  const handleExportCSV = () => {
    exportToCSV(getCurrentData(), `${selectedReport}-report`);
  };

  const handleExportExcel = () => {
    exportToExcel(getCurrentData(), `${selectedReport}-report`);
  };

  const handleExportPDF = () => {
    const reportTitle = reportTypes.find((r) => r.id === selectedReport)?.name || "Report";
    exportToPDF(getCurrentData(), `${selectedReport}-report`, reportTitle);
  };

  const currentStats = summaryStats[selectedReport as keyof typeof summaryStats];

  const renderTransactionTable = () => (
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
        {transactionData.map((tx) => (
          <tr key={tx.id}>
            <td><span className="font-mono text-sm text-foreground">{tx.id}</span></td>
            <td className="font-mono text-muted-foreground">{tx.cardMasked}</td>
            <td className="text-muted-foreground">{tx.type}</td>
            <td className="text-foreground">{tx.merchant}</td>
            <td className="font-medium text-foreground">₦{tx.amount.toLocaleString()}</td>
            <td className="text-muted-foreground">₦{tx.fee.toLocaleString()}</td>
            <td>
              <span className={cn("status-badge", tx.status === "successful" ? "status-active" : "status-blocked")}>
                {tx.status}
              </span>
            </td>
            <td className="text-sm text-muted-foreground">{tx.date}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );

  const renderSettlementTable = () => (
    <table className="data-table">
      <thead>
        <tr>
          <th>Settlement ID</th>
          <th>Date</th>
          <th>Transactions</th>
          <th>Gross Amount</th>
          <th>Fees</th>
          <th>Net Amount</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        {settlementData.map((stl) => (
          <tr key={stl.id}>
            <td><span className="font-mono text-sm text-foreground">{stl.id}</span></td>
            <td className="text-muted-foreground">{stl.date}</td>
            <td className="text-foreground">{stl.transactionCount.toLocaleString()}</td>
            <td className="font-medium text-foreground">₦{stl.grossAmount.toLocaleString()}</td>
            <td className="text-muted-foreground">₦{stl.fees.toLocaleString()}</td>
            <td className="font-medium text-success">₦{stl.netAmount.toLocaleString()}</td>
            <td>
              <span className={cn("status-badge", stl.status === "completed" ? "status-active" : "status-paused")}>
                {stl.status}
              </span>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );

  const renderIssuingFeeTable = () => (
    <table className="data-table">
      <thead>
        <tr>
          <th>ID</th>
          <th>Card Type</th>
          <th>Category</th>
          <th>Cards Issued</th>
          <th>Fee/Card</th>
          <th>Total Fees</th>
          <th>Partner Share</th>
          <th>Bank Share</th>
          <th>Period</th>
        </tr>
      </thead>
      <tbody>
        {issuingFeeData.map((fee) => (
          <tr key={fee.id}>
            <td><span className="font-mono text-sm text-foreground">{fee.id}</span></td>
            <td className="text-foreground">{fee.cardType}</td>
            <td className="text-muted-foreground">{fee.category}</td>
            <td className="text-foreground">{fee.issuedCount}</td>
            <td className="text-muted-foreground">₦{fee.feePerCard.toLocaleString()}</td>
            <td className="font-medium text-foreground">₦{fee.totalFees.toLocaleString()}</td>
            <td className="text-success">₦{fee.partnerShare.toLocaleString()}</td>
            <td className="text-muted-foreground">₦{fee.bankShare.toLocaleString()}</td>
            <td className="text-sm text-muted-foreground">{fee.period}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );

  const renderComprehensiveFeeTable = () => (
    <table className="data-table">
      <thead>
        <tr>
          <th>ID</th>
          <th>Category</th>
          <th>Sub-Category</th>
          <th>Count</th>
          <th>Gross Fees</th>
          <th>Partner Share</th>
          <th>Bank Share</th>
          <th>Period</th>
        </tr>
      </thead>
      <tbody>
        {comprehensiveFeeData.map((fee) => (
          <tr key={fee.id}>
            <td><span className="font-mono text-sm text-foreground">{fee.id}</span></td>
            <td className="text-foreground font-medium">{fee.category}</td>
            <td className="text-muted-foreground">{fee.subCategory}</td>
            <td className="text-foreground">{fee.transactionCount.toLocaleString()}</td>
            <td className="font-medium text-foreground">₦{fee.grossFees.toLocaleString()}</td>
            <td className="text-success">₦{fee.partnerShare.toLocaleString()}</td>
            <td className="text-muted-foreground">₦{fee.bankShare.toLocaleString()}</td>
            <td className="text-sm text-muted-foreground">{fee.period}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );

  const renderTable = () => {
    switch (selectedReport) {
      case "transactions": return renderTransactionTable();
      case "settlements": return renderSettlementTable();
      case "issuing_fees": return renderIssuingFeeTable();
      case "all_fees": return renderComprehensiveFeeTable();
      default: return renderTransactionTable();
    }
  };

  const getRowCount = () => {
    switch (selectedReport) {
      case "transactions": return { showing: transactionData.length, total: "12,847" };
      case "settlements": return { showing: settlementData.length, total: "31" };
      case "issuing_fees": return { showing: issuingFeeData.length, total: "24" };
      case "all_fees": return { showing: comprehensiveFeeData.length, total: "8" };
      default: return { showing: 5, total: "100" };
    }
  };

  const rowCount = getRowCount();

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
            <p className="text-sm text-muted-foreground">{currentStats.stat1.label}</p>
            <p className={cn("text-2xl font-bold", currentStats.stat1.className || "text-foreground")}>
              {currentStats.stat1.value}
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">{currentStats.stat2.label}</p>
            <p className={cn("text-2xl font-bold", currentStats.stat2.className || "text-foreground")}>
              {currentStats.stat2.value}
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">{currentStats.stat3.label}</p>
            <p className={cn("text-2xl font-bold", currentStats.stat3.className || "text-foreground")}>
              {currentStats.stat3.value}
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">{currentStats.stat4.label}</p>
            <p className={cn("text-2xl font-bold", currentStats.stat4.className || "text-foreground")}>
              {currentStats.stat4.value}
            </p>
          </div>
        </div>

        {/* Data Table */}
        <div className="overflow-x-auto">
          {renderTable()}
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between pt-4 border-t border-border mt-4">
          <p className="text-sm text-muted-foreground">
            Showing 1-{rowCount.showing} of {rowCount.total} records
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
