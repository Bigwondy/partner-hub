import { useState } from "react";
import { Search, Filter, Download, Eye, MoreHorizontal, Ban, Pause, Play, Wallet } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
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

const cards = [
  {
    id: "CRD-001",
    maskedPan: "****4532",
    customerName: "Adebayo Johnson",
    customerId: "CUS-0045321",
    type: "Visa Debit",
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
    status: "active",
    expiry: "06/26",
    dailyLimit: 300000,
    monthlyLimit: 3000000,
    issuedAt: "2023-06-12",
  },
];

const statusConfig: Record<string, { label: string; className: string }> = {
  active: { label: "Active", className: "status-active" },
  paused: { label: "Paused", className: "status-paused" },
  blocked: { label: "Blocked", className: "status-blocked" },
  expired: { label: "Expired", className: "bg-muted text-muted-foreground" },
};

export default function CardManagement() {
  const [searchQuery, setSearchQuery] = useState("");
  const [blockDialogOpen, setBlockDialogOpen] = useState(false);
  const [limitsDialogOpen, setLimitsDialogOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState<typeof cards[0] | null>(null);
  const [blockReason, setBlockReason] = useState("");
  const [limits, setLimits] = useState({
    dailyTransaction: "",
    monthlyTransaction: "",
    singleTransaction: "",
    dailyAtm: "",
    monthlyAtm: "",
  });

  const handleBlockCard = (card: typeof cards[0]) => {
    setSelectedCard(card);
    setBlockDialogOpen(true);
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

      {/* Filters Bar */}
      <div className="card-elevated p-4">
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
            <button className="btn-secondary">
              <Download className="w-4 h-4" />
              Export
            </button>
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
              <th>Status</th>
              <th>Expiry</th>
              <th>Daily Limit</th>
              <th>Issued</th>
              <th className="w-16"></th>
            </tr>
          </thead>
          <tbody>
            {cards.map((card) => (
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
                  <DropdownMenu>
                    <DropdownMenuTrigger className="p-2 hover:bg-muted rounded-lg">
                      <MoreHorizontal className="w-4 h-4 text-muted-foreground" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Eye className="w-4 h-4 mr-2" />
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleManageLimits(card)}>
                        <Wallet className="w-4 h-4 mr-2" />
                        Manage Limits
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      {card.status === "active" && (
                        <DropdownMenuItem>
                          <Pause className="w-4 h-4 mr-2" />
                          Pause Card
                        </DropdownMenuItem>
                      )}
                      {card.status === "paused" && (
                        <DropdownMenuItem>
                          <Play className="w-4 h-4 mr-2" />
                          Resume Card
                        </DropdownMenuItem>
                      )}
                      {card.status !== "blocked" && (
                        <DropdownMenuItem 
                          className="text-destructive"
                          onClick={() => handleBlockCard(card)}
                        >
                          <Ban className="w-4 h-4 mr-2" />
                          Block Card
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="flex items-center justify-between px-4 py-3 border-t border-border">
          <p className="text-sm text-muted-foreground">
            Showing 1-5 of 5,085 cards
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

      {/* Block Card Dialog */}
      <Dialog open={blockDialogOpen} onOpenChange={setBlockDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-destructive flex items-center gap-2">
              <Ban className="w-5 h-5" />
              Block Card
            </DialogTitle>
            <DialogDescription>
              This action is <strong>irreversible</strong>. The card {selectedCard?.maskedPan} will be permanently blocked and cannot be used for any transactions.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Reason for blocking
              </label>
              <select
                value={blockReason}
                onChange={(e) => setBlockReason(e.target.value)}
                className="input-field"
              >
                <option value="">Select a reason</option>
                <option value="lost">Card Lost</option>
                <option value="stolen">Card Stolen</option>
                <option value="fraud">Suspected Fraud</option>
                <option value="customer">Customer Request</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div className="p-4 bg-destructive/5 rounded-lg border border-destructive/20">
              <p className="text-sm text-destructive font-medium">Warning</p>
              <p className="text-sm text-muted-foreground mt-1">
                This will immediately stop all card transactions. A new card must be issued if the customer needs continued access.
              </p>
            </div>
          </div>
          <DialogFooter>
            <button className="btn-secondary" onClick={() => setBlockDialogOpen(false)}>
              Cancel
            </button>
            <button className="btn-destructive" onClick={() => setBlockDialogOpen(false)}>
              <Ban className="w-4 h-4" />
              Block Card
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

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
            <button className="btn-secondary" onClick={() => setLimitsDialogOpen(false)}>
              Cancel
            </button>
            <button className="btn-accent" onClick={() => setLimitsDialogOpen(false)}>
              Update Limits
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
