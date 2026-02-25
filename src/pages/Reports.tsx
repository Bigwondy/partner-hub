import { useState } from "react";
import { Download, Calendar, Filter, ArrowUpRight, ArrowDownRight, X } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { exportToCSV, exportToExcel, exportToPDF } from "@/lib/export";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
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
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import { toast } from "sonner";

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
  const [customStartDate, setCustomStartDate] = useState<Date | undefined>();
  const [customEndDate, setCustomEndDate] = useState<Date | undefined>();
  const [startDateOpen, setStartDateOpen] = useState(false);
  const [endDateOpen, setEndDateOpen] = useState(false);

  // More Filters state
  const [terminalIdFilter, setTerminalIdFilter] = useState("");
  const [merchantIdFilter, setMerchantIdFilter] = useState("");
  const [responseFilter, setResponseFilter] = useState("all");
  const [accountNumberFilter, setAccountNumberFilter] = useState("");
  const [filtersApplied, setFiltersApplied] = useState(false);

  const getFilteredTransactionData = () => {
    let data = transactionData;
    if (terminalIdFilter) {
      data = data.filter((tx) => tx.terminalId.toLowerCase().includes(terminalIdFilter.toLowerCase()));
    }
    if (merchantIdFilter) {
      data = data.filter((tx) => tx.merchantId.toLowerCase().includes(merchantIdFilter.toLowerCase()));
    }
    if (responseFilter !== "all") {
      data = data.filter((tx) => tx.response.toLowerCase() === responseFilter.toLowerCase());
    }
    return data;
  };

  const getFilteredSettlementData = () => {
    let data = settlementData;
    if (feeTypeFilter !== "all") {
      data = data.filter(
        (item) => item.feeType.toLowerCase().replace(" ", "") === feeTypeFilter.toLowerCase()
      );
    }
    if (accountNumberFilter) {
      data = data.filter((item) => item.accountNumber.includes(accountNumberFilter));
    }
    return data;
  };

  const handleApplyFilters = () => {
    setFiltersApplied(
      terminalIdFilter !== "" || merchantIdFilter !== "" || responseFilter !== "all" || accountNumberFilter !== ""
    );
    toast.success("Filters applied");
  };

  const handleClearFilters = () => {
    setTerminalIdFilter("");
    setMerchantIdFilter("");
    setResponseFilter("all");
    setAccountNumberFilter("");
    setFiltersApplied(false);
    toast.success("Filters cleared");
  };

  const handleExportCSV = () => {
    const data = activeTab === "transactions" ? getFilteredTransactionData() : getFilteredSettlementData();
    if (data.length === 0) {
      toast.error("No data to export");
      return;
    }
    exportToCSV(data, `${activeTab}-report`);
    toast.success(`${activeTab} report exported as CSV`);
  };

  const handleExportExcel = () => {
    const data = activeTab === "transactions" ? getFilteredTransactionData() : getFilteredSettlementData();
    if (data.length === 0) {
      toast.error("No data to export");
      return;
    }
    exportToExcel(data, `${activeTab}-report`);
    toast.success(`${activeTab} report exported as Excel`);
  };

  const handleExportPDF = () => {
    const data = activeTab === "transactions" ? getFilteredTransactionData() : getFilteredSettlementData();
    if (data.length === 0) {
      toast.error("No data to export");
      return;
    }
    const title = activeTab === "transactions" ? "Transaction Report" : "Settlement Report";
    exportToPDF(data, `${activeTab}-report`, title);
    toast.success(`${activeTab} report exported as PDF`);
  };

  const handleDateRangeChange = (value: string) => {
    setDateRange(value);
    if (value !== "custom") {
      setCustomStartDate(undefined);
      setCustomEndDate(undefined);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div className="page-header">
        <h1 className="page-title">Reports</h1>
        <p className="page-description">View transaction and settlement reports</p>
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

        {/* Filters and Export */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mt-6">
          <div className="flex flex-wrap gap-3 items-center">
            {/* Date Range Selector */}
            <Select value={dateRange} onValueChange={handleDateRangeChange}>
              <SelectTrigger className="w-[160px]">
                <Calendar className="w-4 h-4 text-muted-foreground mr-1" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="last_7_days">Last 7 Days</SelectItem>
                <SelectItem value="last_30_days">Last 30 Days</SelectItem>
                <SelectItem value="this_month">This Month</SelectItem>
                <SelectItem value="last_month">Last Month</SelectItem>
                <SelectItem value="custom">Custom Range</SelectItem>
              </SelectContent>
            </Select>

            {/* Custom Date Range - Input fields with calendar dropdown */}
            {dateRange === "custom" && (
              <div className="flex items-center gap-2">
                <Popover open={startDateOpen} onOpenChange={setStartDateOpen}>
                  <PopoverTrigger asChild>
                    <div className="relative">
                      <Input
                        readOnly
                        value={customStartDate ? format(customStartDate, "dd/MM/yyyy") : ""}
                        placeholder="dd/mm/yyyy"
                        className="w-[130px] h-9 text-sm pr-8 cursor-pointer"
                      />
                      <Calendar className="w-3.5 h-3.5 text-muted-foreground absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <CalendarComponent
                      mode="single"
                      selected={customStartDate}
                      onSelect={(date) => {
                        setCustomStartDate(date);
                        setStartDateOpen(false);
                      }}
                      disabled={(date) => (customEndDate ? date > customEndDate : false)}
                      initialFocus
                      className={cn("p-3 pointer-events-auto")}
                    />
                  </PopoverContent>
                </Popover>
                <span className="text-xs text-muted-foreground">—</span>
                <Popover open={endDateOpen} onOpenChange={setEndDateOpen}>
                  <PopoverTrigger asChild>
                    <div className="relative">
                      <Input
                        readOnly
                        value={customEndDate ? format(customEndDate, "dd/MM/yyyy") : ""}
                        placeholder="dd/mm/yyyy"
                        className="w-[130px] h-9 text-sm pr-8 cursor-pointer"
                      />
                      <Calendar className="w-3.5 h-3.5 text-muted-foreground absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <CalendarComponent
                      mode="single"
                      selected={customEndDate}
                      onSelect={(date) => {
                        setCustomEndDate(date);
                        setEndDateOpen(false);
                      }}
                      disabled={(date) => (customStartDate ? date < customStartDate : false)}
                      initialFocus
                      className={cn("p-3 pointer-events-auto")}
                    />
                  </PopoverContent>
                </Popover>
              </div>
            )}

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

            {/* More Filters */}
            <Sheet>
              <SheetTrigger asChild>
                <button className={cn("btn-secondary", filtersApplied && "ring-2 ring-accent")}>
                  <Filter className="w-4 h-4" />
                  More Filters
                  {filtersApplied && (
                    <span className="ml-1 w-2 h-2 rounded-full bg-accent inline-block" />
                  )}
                </button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>Advanced Filters</SheetTitle>
                </SheetHeader>
                <div className="space-y-5 mt-6">
                  {activeTab === "transactions" ? (
                    <>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground">Terminal ID</label>
                        <Input
                          placeholder="e.g. TRM-45821"
                          value={terminalIdFilter}
                          onChange={(e) => setTerminalIdFilter(e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground">Merchant ID</label>
                        <Input
                          placeholder="e.g. MRC-001"
                          value={merchantIdFilter}
                          onChange={(e) => setMerchantIdFilter(e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground">Response</label>
                        <Select value={responseFilter} onValueChange={setResponseFilter}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All</SelectItem>
                            <SelectItem value="approved">Approved</SelectItem>
                            <SelectItem value="declined">Declined</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground">Account Number</label>
                        <Input
                          placeholder="e.g. 0123456789"
                          value={accountNumberFilter}
                          onChange={(e) => setAccountNumberFilter(e.target.value)}
                        />
                      </div>
                    </>
                  )}
                  <div className="flex gap-3 pt-4">
                    <SheetClose asChild>
                      <Button onClick={handleApplyFilters} className="flex-1">
                        Apply Filters
                      </Button>
                    </SheetClose>
                    <Button variant="outline" onClick={handleClearFilters} className="flex-1">
                      <X className="w-4 h-4 mr-1" />
                      Clear
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
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
              <p className="text-sm text-muted-foreground mt-1">All transactions with details</p>
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
                  {getFilteredTransactionData().map((tx) => (
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
              <span>Showing {getFilteredTransactionData().length} of {transactionData.length} transactions</span>
            </div>
          </div>
        </TabsContent>

        {/* Settlement Tab */}
        <TabsContent value="settlements" className="mt-6">
          <div className="card-elevated">
            <div className="p-6 border-b border-border">
              <h2 className="text-lg font-semibold text-foreground">Settlement Overview</h2>
              <p className="text-sm text-muted-foreground mt-1">Settlement records with fee details</p>
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
