import { useState } from "react";
import { Search, Filter, Download, FileSpreadsheet, FileText as FilePdf, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { exportToCSV, exportToExcel, exportToPDF } from "@/lib/export";

interface SettlementRecord {
  id: string;
  transactionDate: string;
  merchantName: string;
  terminalId: string;
  transactionAmount: number;
  charges: number;
  settledAmount: number;
  settlementDate: string;
  status: "Settled" | "Pending" | "Failed";
}

const mockSettlements: SettlementRecord[] = [
  {
    id: "STL001",
    transactionDate: "2024-01-05",
    merchantName: "Shoprite Nigeria",
    terminalId: "TID-2340001",
    transactionAmount: 125000,
    charges: 1875,
    settledAmount: 123125,
    settlementDate: "2024-01-06",
    status: "Settled",
  },
  {
    id: "STL002",
    transactionDate: "2024-01-05",
    merchantName: "Total Energies",
    terminalId: "TID-2340002",
    transactionAmount: 45000,
    charges: 675,
    settledAmount: 44325,
    settlementDate: "2024-01-06",
    status: "Settled",
  },
  {
    id: "STL003",
    transactionDate: "2024-01-05",
    merchantName: "Chicken Republic",
    terminalId: "TID-2340003",
    transactionAmount: 8500,
    charges: 127.5,
    settledAmount: 8372.5,
    settlementDate: "2024-01-06",
    status: "Settled",
  },
  {
    id: "STL004",
    transactionDate: "2024-01-04",
    merchantName: "Jumia Express",
    terminalId: "TID-2340004",
    transactionAmount: 78000,
    charges: 1170,
    settledAmount: 76830,
    settlementDate: "-",
    status: "Pending",
  },
  {
    id: "STL005",
    transactionDate: "2024-01-04",
    merchantName: "KFC Nigeria",
    terminalId: "TID-2340005",
    transactionAmount: 15200,
    charges: 228,
    settledAmount: 14972,
    settlementDate: "2024-01-05",
    status: "Settled",
  },
  {
    id: "STL006",
    transactionDate: "2024-01-04",
    merchantName: "Uber Nigeria",
    terminalId: "TID-2340006",
    transactionAmount: 3500,
    charges: 52.5,
    settledAmount: 0,
    settlementDate: "-",
    status: "Failed",
  },
  {
    id: "STL007",
    transactionDate: "2024-01-03",
    merchantName: "Game Stores",
    terminalId: "TID-2340007",
    transactionAmount: 250000,
    charges: 3750,
    settledAmount: 246250,
    settlementDate: "2024-01-04",
    status: "Settled",
  },
  {
    id: "STL008",
    transactionDate: "2024-01-03",
    merchantName: "Spar Nigeria",
    terminalId: "TID-2340008",
    transactionAmount: 67800,
    charges: 1017,
    settledAmount: 66783,
    settlementDate: "2024-01-04",
    status: "Settled",
  },
];

const statusConfig: Record<string, { label: string; className: string }> = {
  Settled: { label: "Settled", className: "status-badge status-active" },
  Pending: { label: "Pending", className: "status-badge status-pending" },
  Failed: { label: "Failed", className: "status-badge status-blocked" },
};

const allColumns = [
  { key: "id", label: "Settlement ID" },
  { key: "transactionDate", label: "Transaction Date" },
  { key: "merchantName", label: "Merchant Name" },
  { key: "terminalId", label: "Terminal ID" },
  { key: "transactionAmount", label: "Transaction Amount" },
  { key: "charges", label: "Charges" },
  { key: "settledAmount", label: "Settled Amount" },
  { key: "settlementDate", label: "Settlement Date" },
  { key: "status", label: "Status" },
];

export default function SettlementReports() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [visibleColumns, setVisibleColumns] = useState<string[]>(
    allColumns.map((c) => c.key)
  );

  const filteredSettlements = mockSettlements.filter((settlement) => {
    const matchesSearch =
      settlement.merchantName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      settlement.terminalId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      settlement.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || settlement.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 2,
    }).format(value);
  };

  const handleExportCSV = () => {
    const data = filteredSettlements.map((s) => ({
      "Settlement ID": s.id,
      "Transaction Date": s.transactionDate,
      "Merchant Name": s.merchantName,
      "Terminal ID": s.terminalId,
      "Transaction Amount": s.transactionAmount,
      Charges: s.charges,
      "Settled Amount": s.settledAmount,
      "Settlement Date": s.settlementDate,
      Status: s.status,
    }));
    exportToCSV(data, "settlement-report");
  };

  const handleExportExcel = () => {
    const data = filteredSettlements.map((s) => ({
      "Settlement ID": s.id,
      "Transaction Date": s.transactionDate,
      "Merchant Name": s.merchantName,
      "Terminal ID": s.terminalId,
      "Transaction Amount": s.transactionAmount,
      Charges: s.charges,
      "Settled Amount": s.settledAmount,
      "Settlement Date": s.settlementDate,
      Status: s.status,
    }));
    exportToExcel(data, "settlement-report");
  };

  const handleExportPDF = () => {
    const data = filteredSettlements.map((s) => ({
      "Settlement ID": s.id,
      "Transaction Date": s.transactionDate,
      "Merchant Name": s.merchantName,
      "Terminal ID": s.terminalId,
      "Transaction Amount": formatCurrency(s.transactionAmount),
      Charges: formatCurrency(s.charges),
      "Settled Amount": formatCurrency(s.settledAmount),
      "Settlement Date": s.settlementDate,
      Status: s.status,
    }));
    exportToPDF(data, "settlement-report", "Settlement Report");
  };

  const toggleColumn = (key: string) => {
    setVisibleColumns((prev) =>
      prev.includes(key) ? prev.filter((c) => c !== key) : [...prev, key]
    );
  };

  // Calculate totals
  const totals = filteredSettlements.reduce(
    (acc, s) => ({
      transactionAmount: acc.transactionAmount + s.transactionAmount,
      charges: acc.charges + s.charges,
      settledAmount: acc.settledAmount + s.settledAmount,
    }),
    { transactionAmount: 0, charges: 0, settledAmount: 0 }
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="page-header">
        <h1 className="page-title">Settlement Report</h1>
        <p className="page-description">
          View and export settlement records
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="metric-card">
          <p className="metric-label">Total Transaction Amount</p>
          <p className="metric-value mt-2">{formatCurrency(totals.transactionAmount)}</p>
        </div>
        <div className="metric-card">
          <p className="metric-label">Total Charges</p>
          <p className="metric-value mt-2">{formatCurrency(totals.charges)}</p>
        </div>
        <div className="metric-card">
          <p className="metric-label">Total Settled Amount</p>
          <p className="metric-value mt-2">{formatCurrency(totals.settledAmount)}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search by merchant, terminal ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="Settled">Settled</SelectItem>
            <SelectItem value="Pending">Pending</SelectItem>
            <SelectItem value="Failed">Failed</SelectItem>
          </SelectContent>
        </Select>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="gap-2">
              <Eye className="w-4 h-4" />
              Columns
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuLabel>Toggle Columns</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {allColumns.map((column) => (
              <DropdownMenuCheckboxItem
                key={column.key}
                checked={visibleColumns.includes(column.key)}
                onCheckedChange={() => toggleColumn(column.key)}
              >
                {column.label}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2" onClick={handleExportCSV}>
            <Download className="w-4 h-4" />
            CSV
          </Button>
          <Button variant="outline" className="gap-2" onClick={handleExportExcel}>
            <FileSpreadsheet className="w-4 h-4" />
            Excel
          </Button>
          <Button variant="outline" className="gap-2" onClick={handleExportPDF}>
            <FilePdf className="w-4 h-4" />
            PDF
          </Button>
        </div>
      </div>

      {/* Data Table */}
      <div className="card-elevated overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              {visibleColumns.includes("id") && <TableHead>ID</TableHead>}
              {visibleColumns.includes("transactionDate") && (
                <TableHead>Trans. Date</TableHead>
              )}
              {visibleColumns.includes("merchantName") && (
                <TableHead>Merchant</TableHead>
              )}
              {visibleColumns.includes("terminalId") && (
                <TableHead>Terminal ID</TableHead>
              )}
              {visibleColumns.includes("transactionAmount") && (
                <TableHead className="text-right">Trans. Amount</TableHead>
              )}
              {visibleColumns.includes("charges") && (
                <TableHead className="text-right">Charges</TableHead>
              )}
              {visibleColumns.includes("settledAmount") && (
                <TableHead className="text-right">Settled Amount</TableHead>
              )}
              {visibleColumns.includes("settlementDate") && (
                <TableHead>Settlement Date</TableHead>
              )}
              {visibleColumns.includes("status") && <TableHead>Status</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredSettlements.map((settlement) => (
              <TableRow key={settlement.id}>
                {visibleColumns.includes("id") && (
                  <TableCell className="font-medium">{settlement.id}</TableCell>
                )}
                {visibleColumns.includes("transactionDate") && (
                  <TableCell>{settlement.transactionDate}</TableCell>
                )}
                {visibleColumns.includes("merchantName") && (
                  <TableCell>{settlement.merchantName}</TableCell>
                )}
                {visibleColumns.includes("terminalId") && (
                  <TableCell className="font-mono text-sm">
                    {settlement.terminalId}
                  </TableCell>
                )}
                {visibleColumns.includes("transactionAmount") && (
                  <TableCell className="text-right">
                    {formatCurrency(settlement.transactionAmount)}
                  </TableCell>
                )}
                {visibleColumns.includes("charges") && (
                  <TableCell className="text-right">
                    {formatCurrency(settlement.charges)}
                  </TableCell>
                )}
                {visibleColumns.includes("settledAmount") && (
                  <TableCell className="text-right">
                    {formatCurrency(settlement.settledAmount)}
                  </TableCell>
                )}
                {visibleColumns.includes("settlementDate") && (
                  <TableCell>{settlement.settlementDate}</TableCell>
                )}
                {visibleColumns.includes("status") && (
                  <TableCell>
                    <span className={statusConfig[settlement.status].className}>
                      {statusConfig[settlement.status].label}
                    </span>
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Showing {filteredSettlements.length} of {mockSettlements.length} records
        </p>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" disabled>
            Previous
          </Button>
          <Button variant="outline" size="sm" disabled>
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
