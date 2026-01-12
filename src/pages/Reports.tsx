import { useState } from "react";
import { Download, Calendar, Filter, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { exportToCSV, exportToExcel, exportToPDF } from "@/lib/export";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// Transaction Report Data
const transactionData = [
  { id: 1, date: "2024-01-05 14:32", terminalId: "TRM-45821", merchantId: "MRC-001", response: "Approved", responseCode: "00", rrn: "400512345678", pan: "****4532" },
  { id: 2, date: "2024-01-05 12:15", terminalId: "TRM-33127", merchantId: "MRC-002", response: "Approved", responseCode: "00", rrn: "400512345679", pan: "****8921" },
  { id: 3, date: "2024-01-05 10:48", terminalId: "TRM-78234", merchantId: "MRC-003", response: "Approved", responseCode: "00", rrn: "400512345680", pan: "****1287" },
  { id: 4, date: "2024-01-05 09:22", terminalId: "TRM-99012", merchantId: "MRC-004", response: "Declined", responseCode: "51", rrn: "400512345681", pan: "****6754" },
  { id: 5, date: "2024-01-05 08:05", terminalId: "TRM-55678", merchantId: "MRC-005", response: "Approved", responseCode: "00", rrn: "400512345682", pan: "****3398" },
  { id: 6, date: "2024-01-04 16:45", terminalId: "TRM-22345", merchantId: "MRC-006", response: "Approved", responseCode: "00", rrn: "400512345683", pan: "****7812" },
  { id: 7, date: "2024-01-04 14:30", terminalId: "TRM-67890", merchantId: "MRC-007", response: "Declined", responseCode: "14", rrn: "400512345684", pan: "****2341" },
  { id: 8, date: "2024-01-04 11:20", terminalId: "TRM-11234", merchantId: "MRC-008", response: "Approved", responseCode: "00", rrn: "400512345685", pan: "****9087" },
];

// Settlement Report Data
const settlementData = [
  { id: 1, settlementDate: "2024-01-05", period: "Daily", accountNumber: "0123456789", amount: 125000, fee: 1875, quantity: 45, feeType: "Processing" },
  { id: 2, settlementDate: "2024-01-05", period: "Daily", accountNumber: "9876543210", amount: 89500, fee: 1343, quantity: 32, feeType: "Settlement" },
  { id: 3, settlementDate: "2024-01-05", period: "Daily", accountNumber: "5432109876", amount: 200000, fee: 350, quantity: 8, feeType: "Issuance" },
  { id: 4, settlementDate: "2024-01-04", period: "Daily", accountNumber: "1357924680", amount: 67800, fee: 1017, quantity: 24, feeType: "ThreeDS" },
  { id: 5, settlementDate: "2024-01-04", period: "Daily", accountNumber: "2468013579", amount: 15600, fee: 234, quantity: 12, feeType: "IRF" },
  { id: 6, settlementDate: "2024-01-04", period: "Daily", accountNumber: "3692581470", amount: 4900, fee: 74, quantity: 5, feeType: "Safe token" },
  { id: 7, settlementDate: "2024-01-03", period: "Daily", accountNumber: "7418529630", amount: 8200, fee: 123, quantity: 7, feeType: "Processing" },
  { id: 8, settlementDate: "2024-01-03", period: "Daily", accountNumber: "8529637410", amount: 45000, fee: 675, quantity: 18, feeType: "Others" },
];

const feeTypeOptions = [
  { value: "all", label: "All" },
  { value: "processing", label: "Processing" },
  { value: "settlement", label: "Settlement" },
  { value: "issuance", label: "Issuance" },
  { value: "threeds", label: "ThreeDS" },
  { value: "irf", label: "IRF" },
  { value: "safetoken", label: "Safe token" },
  { value: "others", label: "Others" },
];

export default function Reports() {
  const [activeTab, setActiveTab] = useState("transactions");
  const [dateRange, setDateRange] = useState("last_30_days");
  const [feeTypeFilter, setFeeTypeFilter] = useState("all");

  const getFilteredSettlementData = () => {
    if (feeTypeFilter === "all") return settlementData;
    return settlementData.filter(
      (item) => item.feeType.toLowerCase().replace(" ", "") === feeTypeFilter.toLowerCase()
    );
  };

  const handleExportCSV = () => {
    const data = activeTab === "transactions" ? transactionData : getFilteredSettlementData();
    exportToCSV(data, `${activeTab}-report`);
  };

  const handleExportExcel = () => {
    const data = activeTab === "transactions" ? transactionData : getFilteredSettlementData();
    exportToExcel(data, `${activeTab}-report`);
  };

  const handleExportPDF = () => {
    const data = activeTab === "transactions" ? transactionData : getFilteredSettlementData();
    const title = activeTab === "transactions" ? "Transaction Report" : "Settlement Report";
    exportToPDF(data, `${activeTab}-report`, title);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div className="page-header">
        <h1 className="page-title">Reports</h1>
        <p className="page-description">
          View transaction and settlement reports
        </p>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="transactions" className="flex items-center gap-2">
            <ArrowUpRight className="w-4 h-4" />
            Transactions
          </TabsTrigger>
          <TabsTrigger value="settlements" className="flex items-center gap-2">
            <ArrowDownRight className="w-4 h-4" />
            Settlement
          </TabsTrigger>
        </TabsList>

        {/* Filters and Export - Common for both tabs */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mt-6">
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
            
            {activeTab === "settlements" && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Fee Type:</span>
                <Select value={feeTypeFilter} onValueChange={setFeeTypeFilter}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Select fee type" />
                  </SelectTrigger>
                  <SelectContent>
                    {feeTypeOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

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

        {/* Transactions Tab */}
        <TabsContent value="transactions" className="mt-6">
          <div className="card-elevated">
            <div className="p-6 border-b border-border">
              <h2 className="text-lg font-semibold text-foreground">Transaction Overview</h2>
              <p className="text-sm text-muted-foreground mt-1">
                All transactions with details
              </p>
            </div>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>S/N</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Terminal ID</TableHead>
                    <TableHead>Merchant ID</TableHead>
                    <TableHead>Response</TableHead>
                    <TableHead>Response Code</TableHead>
                    <TableHead>RRN</TableHead>
                    <TableHead>PAN</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transactionData.map((tx) => (
                    <TableRow key={tx.id}>
                      <TableCell className="font-medium">{tx.id}</TableCell>
                      <TableCell className="text-muted-foreground">{tx.date}</TableCell>
                      <TableCell className="font-mono text-sm">{tx.terminalId}</TableCell>
                      <TableCell className="font-mono text-sm">{tx.merchantId}</TableCell>
                      <TableCell>
                        <span className={cn(
                          "status-badge",
                          tx.response === "Approved" ? "status-active" : "status-blocked"
                        )}>
                          {tx.response}
                        </span>
                      </TableCell>
                      <TableCell className="font-mono text-sm">{tx.responseCode}</TableCell>
                      <TableCell className="font-mono text-sm text-muted-foreground">{tx.rrn}</TableCell>
                      <TableCell className="font-mono text-sm text-muted-foreground">{tx.pan}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            <div className="p-4 border-t border-border flex items-center justify-between text-sm text-muted-foreground">
              <span>Showing {transactionData.length} of {transactionData.length} transactions</span>
            </div>
          </div>
        </TabsContent>

        {/* Settlement Tab */}
        <TabsContent value="settlements" className="mt-6">
          <div className="card-elevated">
            <div className="p-6 border-b border-border">
              <h2 className="text-lg font-semibold text-foreground">Settlement Overview</h2>
              <p className="text-sm text-muted-foreground mt-1">
                Settlement records with fee details
              </p>
            </div>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>S/N</TableHead>
                    <TableHead>Settlement Date</TableHead>
                    <TableHead>Period</TableHead>
                    <TableHead>Account Number</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Fee</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Fee Type</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {getFilteredSettlementData().map((stl) => (
                    <TableRow key={stl.id}>
                      <TableCell className="font-medium">{stl.id}</TableCell>
                      <TableCell className="text-muted-foreground">{stl.settlementDate}</TableCell>
                      <TableCell className="text-muted-foreground">{stl.period}</TableCell>
                      <TableCell className="font-mono text-sm">{stl.accountNumber}</TableCell>
                      <TableCell className="font-medium text-foreground">₦{stl.amount.toLocaleString()}</TableCell>
                      <TableCell className="text-muted-foreground">₦{stl.fee.toLocaleString()}</TableCell>
                      <TableCell className="text-foreground">{stl.quantity}</TableCell>
                      <TableCell>
                        <span className="px-2 py-1 bg-muted rounded text-xs font-medium">
                          {stl.feeType}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            <div className="p-4 border-t border-border flex items-center justify-between text-sm text-muted-foreground">
              <span>Showing {getFilteredSettlementData().length} of {settlementData.length} settlements</span>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
