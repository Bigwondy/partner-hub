import { useState } from "react";
import { Clock, Download, Eye, Filter, Search, Wallet } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { exportToCSV, exportToExcel, exportToPDF } from "@/lib/export";
import { CardDetailsSheet } from "@/components/cards/CardDetailsSheet";
import { useToast } from "@/hooks/use-toast";

const cards = [
  {
    id: "CRD-001",
    maskedPan: "****4532",
    customerName: "Adebayo Johnson",
    customerId: "CUS-0045321",
    type: "Visa Debit",
    cardCategory: "instant",
    status: "active",
    expiry: "12/26",
    dailyLimit: 500000,
    monthlyLimit: 5000000,
    issuedAt: "2024-01-05",
  },
  {
    id: "CRD-002",
    maskedPan: "****8921",
    customerName: "Chioma Okafor",
    customerId: "CUS-0045320",
    type: "Mastercard Prepaid",
    cardCategory: "embossed",
    status: "active",
    expiry: "08/25",
    dailyLimit: 200000,
    monthlyLimit: 2000000,
    issuedAt: "2023-08-15",
  },
  {
    id: "CRD-003",
    maskedPan: "****1287",
    customerName: "Emmanuel Nnamdi",
    customerId: "CUS-0045319",
    type: "Visa Debit",
    cardCategory: "virtual",
    status: "paused",
    expiry: "03/27",
    dailyLimit: 500000,
    monthlyLimit: 5000000,
    issuedAt: "2024-03-20",
  },
  {
    id: "CRD-004",
    maskedPan: "****6754",
    customerName: "Fatima Abdullahi",
    customerId: "CUS-0045318",
    type: "Visa Debit",
    cardCategory: "instant",
    status: "blocked",
    expiry: "11/25",
    dailyLimit: 500000,
    monthlyLimit: 5000000,
    issuedAt: "2022-11-08",
  },
  {
    id: "CRD-005",
    maskedPan: "****3398",
    customerName: "Oluwaseun Bakare",
    customerId: "CUS-0045317",
    type: "Mastercard Prepaid",
    cardCategory: "embossed",
    status: "active",
    expiry: "06/26",
    dailyLimit: 300000,
    monthlyLimit: 3000000,
    issuedAt: "2023-06-12",
  },
  {
    id: "CRD-006",
    maskedPan: "****7721",
    customerName: "Grace Eze",
    customerId: "CUS-0045316",
    type: "Visa Virtual",
    cardCategory: "virtual",
    status: "active",
    expiry: "09/27",
    dailyLimit: 100000,
    monthlyLimit: 1000000,
    issuedAt: "2024-01-10",
  },
];

const statusConfig: Record<string, { label: string; className: string }> = {
  active: { label: "Active", className: "status-active" },
  paused: { label: "Paused", className: "status-paused" },
  blocked: { label: "Blocked", className: "status-blocked" },
  expired: { label: "Expired", className: "bg-muted text-muted-foreground" },
};

const cardCategoryLabels: Record<string, string> = {
  instant: "Instant Card",
  embossed: "Embossed Card",
  virtual: "Virtual Card",
};

export default function CardManagement() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [detailsSheetOpen, setDetailsSheetOpen] = useState(false);
  const [limitsDialogOpen, setLimitsDialogOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState<typeof cards[0] | null>(null);
  const [limits, setLimits] = useState({
    dailyTransaction: "",
    monthlyTransaction: "",
    singleTransaction: "",
    dailyAtm: "",
    monthlyAtm: "",
  });
  const { toast } = useToast();

  const filteredCards = cards.filter((card) => {
    const matchesSearch =
      card.maskedPan.toLowerCase().includes(searchQuery.toLowerCase()) ||
      card.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      card.customerId.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesTab =
      activeTab === "all" ||
      card.cardCategory === activeTab;

    return matchesSearch && matchesTab;
  });

  const handleViewDetails = (card: typeof cards[0]) => {
    setSelectedCard(card);
    setDetailsSheetOpen(true);
  };

  const handleManageLimits = (card: typeof cards[0]) => {
    setSelectedCard(card);
    setLimits({
      dailyTransaction: card.dailyLimit.toString(),
      monthlyTransaction: card.monthlyLimit.toString(),
      singleTransaction: "100000",
      dailyAtm: "200000",
      monthlyAtm: "1000000",
    });
    setLimitsDialogOpen(true);
  };

  const handleSubmitLimits = () => {
    toast({
      title: "Approval Request Submitted",
      description: "Your limit change request has been submitted for approval.",
    });
    setLimitsDialogOpen(false);
  };

  const handleExportCSV = () => {
    const exportData = filteredCards.map((card) => ({
      CardNumber: card.maskedPan,
      CustomerName: card.customerName,
      CustomerID: card.customerId,
      Type: card.type,
      Category: cardCategoryLabels[card.cardCategory],
      Status: statusConfig[card.status].label,
      Expiry: card.expiry,
      DailyLimit: card.dailyLimit,
      IssuedAt: card.issuedAt,
    }));
    exportToCSV(exportData, "cards-export");
  };

  const handleExportExcel = () => {
    const exportData = filteredCards.map((card) => ({
      CardNumber: card.maskedPan,
      CustomerName: card.customerName,
      CustomerID: card.customerId,
      Type: card.type,
      Category: cardCategoryLabels[card.cardCategory],
      Status: statusConfig[card.status].label,
      Expiry: card.expiry,
      DailyLimit: card.dailyLimit,
      IssuedAt: card.issuedAt,
    }));
    exportToExcel(exportData, "cards-export");
  };

  const handleExportPDF = () => {
    const exportData = filteredCards.map((card) => ({
      CardNumber: card.maskedPan,
      CustomerName: card.customerName,
      Type: card.type,
      Category: cardCategoryLabels[card.cardCategory],
      Status: statusConfig[card.status].label,
      Expiry: card.expiry,
    }));
    exportToPDF(exportData, "cards-export", "Card Management Report");
  };

  const getCardCounts = () => ({
    all: cards.length,
    instant: cards.filter((c) => c.cardCategory === "instant").length,
    embossed: cards.filter((c) => c.cardCategory === "embossed").length,
    virtual: cards.filter((c) => c.cardCategory === "virtual").length,
  });

  const counts = getCardCounts();

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div className="page-header">
        <h1 className="page-title">Card Management</h1>
        <p className="page-description">
          View and manage customer cards - block, pause, resume, and adjust limits
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-success/10 border border-success/20">
          <p className="text-2xl font-bold text-success">4,520</p>
          <p className="text-sm text-success/80">Active Cards</p>
        </div>
        <div className="p-4 rounded-xl bg-warning/10 border border-warning/20">
          <p className="text-2xl font-bold text-warning">320</p>
          <p className="text-sm text-warning/80">Paused Cards</p>
        </div>
        <div className="p-4 rounded-xl bg-destructive/10 border border-destructive/20">
          <p className="text-2xl font-bold text-destructive">89</p>
          <p className="text-sm text-destructive/80">Blocked Cards</p>
        </div>
        <div className="p-4 rounded-xl bg-muted border border-border">
          <p className="text-2xl font-bold text-muted-foreground">156</p>
          <p className="text-sm text-muted-foreground">Expired Cards</p>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:inline-grid">
          <TabsTrigger value="all">All Cards ({counts.all})</TabsTrigger>
          <TabsTrigger value="instant">Instant ({counts.instant})</TabsTrigger>
          <TabsTrigger value="embossed">Embossed ({counts.embossed})</TabsTrigger>
          <TabsTrigger value="virtual">Virtual ({counts.virtual})</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-6">
          {/* Filters Bar */}
          <div className="card-elevated p-4 mb-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search by last 4 digits, customer name, or ID..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="input-field pl-10"
                />
              </div>
              <div className="flex gap-2">
                <button className="btn-secondary">
                  <Filter className="w-4 h-4" />
                  Filters
                </button>
                <DropdownMenu>
                  <DropdownMenuTrigger className="btn-secondary">
                    <Download className="w-4 h-4" />
                    Export
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={handleExportCSV}>
                      Export as CSV
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleExportExcel}>
                      Export as Excel
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleExportPDF}>
                      Export as PDF
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>

          {/* Cards Table */}
          <div className="card-elevated overflow-hidden">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Card Number</th>
                  <th>Customer</th>
                  <th>Type</th>
                  <th>Category</th>
                  <th>Status</th>
                  <th>Expiry</th>
                  <th>Daily Limit</th>
                  <th>Issued</th>
                  <th className="w-24">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredCards.map((card) => (
                  <tr key={card.id}>
                    <td>
                      <span className="font-mono font-medium text-foreground">{card.maskedPan}</span>
                    </td>
                    <td>
                      <div>
                        <p className="font-medium text-foreground">{card.customerName}</p>
                        <p className="text-xs text-muted-foreground">{card.customerId}</p>
                      </div>
                    </td>
                    <td className="text-muted-foreground">{card.type}</td>
                    <td>
                      <Badge variant="outline" className="text-xs">
                        {cardCategoryLabels[card.cardCategory]}
                      </Badge>
                    </td>
                    <td>
                      <Badge className={statusConfig[card.status].className}>
                        {statusConfig[card.status].label}
                      </Badge>
                    </td>
                    <td className="text-muted-foreground font-mono">{card.expiry}</td>
                    <td className="text-muted-foreground">
                      ₦{card.dailyLimit.toLocaleString()}
                    </td>
                    <td className="text-muted-foreground text-sm">{card.issuedAt}</td>
                    <td>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewDetails(card)}
                        className="gap-2"
                      >
                        <Eye className="w-4 h-4" />
                        View
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Pagination */}
            <div className="flex items-center justify-between px-4 py-3 border-t border-border">
              <p className="text-sm text-muted-foreground">
                Showing 1-{filteredCards.length} of {filteredCards.length} cards
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
        </TabsContent>
      </Tabs>

      {/* Card Details Sheet */}
      <CardDetailsSheet
        open={detailsSheetOpen}
        onOpenChange={setDetailsSheetOpen}
        card={selectedCard}
        onManageLimits={handleManageLimits}
      />

      {/* Manage Limits Dialog */}
      <Dialog open={limitsDialogOpen} onOpenChange={setLimitsDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Wallet className="w-5 h-5 text-accent" />
              Manage Spending Limits
            </DialogTitle>
            <DialogDescription>
              Update limits for card {selectedCard?.maskedPan}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="p-3 rounded-lg bg-warning/10 border border-warning/20">
              <div className="flex items-center gap-2 text-warning text-sm">
                <Clock className="w-4 h-4" />
                <span>This request requires supervisor approval</span>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Daily Transaction Limit
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">₦</span>
                <input
                  type="text"
                  value={limits.dailyTransaction}
                  onChange={(e) => setLimits({ ...limits, dailyTransaction: e.target.value })}
                  className="input-field pl-8"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Monthly Transaction Limit
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">₦</span>
                <input
                  type="text"
                  value={limits.monthlyTransaction}
                  onChange={(e) => setLimits({ ...limits, monthlyTransaction: e.target.value })}
                  className="input-field pl-8"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Single Transaction Limit
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">₦</span>
                <input
                  type="text"
                  value={limits.singleTransaction}
                  onChange={(e) => setLimits({ ...limits, singleTransaction: e.target.value })}
                  className="input-field pl-8"
                />
              </div>
            </div>
            <div className="pt-2 border-t border-border">
              <p className="text-xs text-muted-foreground mb-3">ATM Withdrawal Limits</p>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Daily ATM
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">₦</span>
                    <input
                      type="text"
                      value={limits.dailyAtm}
                      onChange={(e) => setLimits({ ...limits, dailyAtm: e.target.value })}
                      className="input-field pl-8 text-sm"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Monthly ATM
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">₦</span>
                    <input
                      type="text"
                      value={limits.monthlyAtm}
                      onChange={(e) => setLimits({ ...limits, monthlyAtm: e.target.value })}
                      className="input-field pl-8 text-sm"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setLimitsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmitLimits}>
              Submit for Approval
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
