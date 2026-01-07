import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import {
  Percent,
  DollarSign,
  TrendingUp,
  Settings,
  Eye,
  Edit,
  Info,
  PiggyBank,
  Building2,
  CreditCard,
  ArrowRightLeft,
  Receipt,
  Wallet,
} from "lucide-react";

interface FeeConfig {
  id: string;
  name: string;
  category: "interchange" | "processing" | "issuance" | "maintenance" | "transaction";
  feeType: "percentage" | "flat" | "hybrid";
  totalFee: number;
  partnerShare: number;
  bankShare: number;
  currency: string;
  status: "active" | "pending" | "inactive";
  effectiveDate: string;
  description: string;
}

const feeConfigs: FeeConfig[] = [
  {
    id: "FEE-001",
    name: "POS Transaction Fee",
    category: "interchange",
    feeType: "percentage",
    totalFee: 1.5,
    partnerShare: 60,
    bankShare: 40,
    currency: "NGN",
    status: "active",
    effectiveDate: "2024-01-01",
    description: "Fee charged on all POS transactions",
  },
  {
    id: "FEE-002",
    name: "ATM Withdrawal Fee",
    category: "transaction",
    feeType: "flat",
    totalFee: 35,
    partnerShare: 50,
    bankShare: 50,
    currency: "NGN",
    status: "active",
    effectiveDate: "2024-01-01",
    description: "Flat fee for ATM cash withdrawals",
  },
  {
    id: "FEE-003",
    name: "Card Issuance Fee",
    category: "issuance",
    feeType: "flat",
    totalFee: 1000,
    partnerShare: 70,
    bankShare: 30,
    currency: "NGN",
    status: "active",
    effectiveDate: "2024-01-01",
    description: "One-time fee for new card issuance",
  },
  {
    id: "FEE-004",
    name: "Monthly Maintenance Fee",
    category: "maintenance",
    feeType: "flat",
    totalFee: 100,
    partnerShare: 80,
    bankShare: 20,
    currency: "NGN",
    status: "active",
    effectiveDate: "2024-01-01",
    description: "Monthly account maintenance fee",
  },
  {
    id: "FEE-005",
    name: "Online Transaction Fee",
    category: "processing",
    feeType: "percentage",
    totalFee: 1.25,
    partnerShare: 55,
    bankShare: 45,
    currency: "NGN",
    status: "active",
    effectiveDate: "2024-01-01",
    description: "Fee for online/e-commerce transactions",
  },
  {
    id: "FEE-006",
    name: "International Transaction Fee",
    category: "interchange",
    feeType: "percentage",
    totalFee: 3.5,
    partnerShare: 45,
    bankShare: 55,
    currency: "NGN",
    status: "active",
    effectiveDate: "2024-01-01",
    description: "Fee for cross-border transactions",
  },
  {
    id: "FEE-007",
    name: "Card Replacement Fee",
    category: "issuance",
    feeType: "flat",
    totalFee: 500,
    partnerShare: 75,
    bankShare: 25,
    currency: "NGN",
    status: "active",
    effectiveDate: "2024-01-01",
    description: "Fee for replacing lost/damaged cards",
  },
  {
    id: "FEE-008",
    name: "Balance Inquiry Fee",
    category: "transaction",
    feeType: "flat",
    totalFee: 10,
    partnerShare: 50,
    bankShare: 50,
    currency: "NGN",
    status: "inactive",
    effectiveDate: "2024-01-01",
    description: "Fee for ATM balance inquiries",
  },
  {
    id: "FEE-009",
    name: "Transfer Fee",
    category: "processing",
    feeType: "hybrid",
    totalFee: 25,
    partnerShare: 60,
    bankShare: 40,
    currency: "NGN",
    status: "pending",
    effectiveDate: "2024-02-01",
    description: "Fee for fund transfers (₦25 + 0.5%)",
  },
];

const categoryConfig: Record<string, { label: string; icon: React.ReactNode; color: string }> = {
  interchange: { label: "Interchange", icon: <ArrowRightLeft className="h-4 w-4" />, color: "bg-blue-100 text-blue-800" },
  processing: { label: "Processing", icon: <Settings className="h-4 w-4" />, color: "bg-purple-100 text-purple-800" },
  issuance: { label: "Issuance", icon: <CreditCard className="h-4 w-4" />, color: "bg-green-100 text-green-800" },
  maintenance: { label: "Maintenance", icon: <Receipt className="h-4 w-4" />, color: "bg-orange-100 text-orange-800" },
  transaction: { label: "Transaction", icon: <Wallet className="h-4 w-4" />, color: "bg-cyan-100 text-cyan-800" },
};

const statusConfig: Record<string, { label: string; className: string }> = {
  active: { label: "Active", className: "bg-green-100 text-green-800 border-green-200" },
  pending: { label: "Pending Approval", className: "bg-yellow-100 text-yellow-800 border-yellow-200" },
  inactive: { label: "Inactive", className: "bg-slate-100 text-slate-600 border-slate-200" },
};

const FeeConfiguration = () => {
  const { toast } = useToast();
  const [fees] = useState<FeeConfig[]>(feeConfigs);
  const [activeTab, setActiveTab] = useState("all");
  const [selectedFee, setSelectedFee] = useState<FeeConfig | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    partnerShare: 0,
    bankShare: 0,
  });

  const filteredFees = fees.filter((fee) => {
    if (activeTab === "all") return true;
    return fee.category === activeTab;
  });

  const activeFees = fees.filter((f) => f.status === "active").length;
  const pendingFees = fees.filter((f) => f.status === "pending").length;

  // Calculate summary metrics
  const avgPartnerShare = Math.round(
    fees.filter((f) => f.status === "active").reduce((acc, f) => acc + f.partnerShare, 0) /
      fees.filter((f) => f.status === "active").length
  );

  const handleViewDetails = (fee: FeeConfig) => {
    setSelectedFee(fee);
    setViewDialogOpen(true);
  };

  const handleEditFee = (fee: FeeConfig) => {
    setSelectedFee(fee);
    setEditForm({
      partnerShare: fee.partnerShare,
      bankShare: fee.bankShare,
    });
    setEditDialogOpen(true);
  };

  const handlePartnerShareChange = (value: string) => {
    const partnerShare = Math.min(100, Math.max(0, parseInt(value) || 0));
    setEditForm({
      partnerShare,
      bankShare: 100 - partnerShare,
    });
  };

  const handleSubmitEdit = () => {
    toast({
      title: "Change Request Submitted",
      description: "Your fee configuration change has been submitted for approval.",
    });
    setEditDialogOpen(false);
    setSelectedFee(null);
  };

  const formatFee = (fee: FeeConfig) => {
    if (fee.feeType === "percentage") {
      return `${fee.totalFee}%`;
    } else if (fee.feeType === "flat") {
      return `₦${fee.totalFee.toLocaleString()}`;
    } else {
      return `₦${fee.totalFee} + %`;
    }
  };

  const formatCurrency = (amount: number) => {
    return `₦${amount.toLocaleString()}`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Fee Configuration</h1>
        <p className="text-muted-foreground">
          View and manage fee-sharing arrangements between partners and the bank
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Fees</p>
                <p className="text-2xl font-bold text-green-600">{activeFees}</p>
              </div>
              <DollarSign className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pending Changes</p>
                <p className="text-2xl font-bold text-yellow-600">{pendingFees}</p>
              </div>
              <Settings className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg Partner Share</p>
                <p className="text-2xl font-bold text-primary">{avgPartnerShare}%</p>
              </div>
              <PiggyBank className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg Bank Share</p>
                <p className="text-2xl font-bold text-muted-foreground">{100 - avgPartnerShare}%</p>
              </div>
              <Building2 className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Fee Sharing Visualization */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Fee Sharing Overview
          </CardTitle>
          <CardDescription>Visual breakdown of partner vs bank fee allocation</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(categoryConfig).map(([key, config]) => {
              const categoryFees = fees.filter((f) => f.category === key && f.status === "active");
              if (categoryFees.length === 0) return null;
              const avgPartner = Math.round(
                categoryFees.reduce((acc, f) => acc + f.partnerShare, 0) / categoryFees.length
              );
              return (
                <div key={key} className="p-4 border rounded-lg">
                  <div className="flex items-center gap-2 mb-3">
                    <Badge variant="outline" className={config.color}>
                      {config.icon}
                      <span className="ml-1">{config.label}</span>
                    </Badge>
                    <span className="text-xs text-muted-foreground">({categoryFees.length} fees)</span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Partner</span>
                      <span className="font-medium text-primary">{avgPartner}%</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary rounded-full transition-all"
                        style={{ width: `${avgPartner}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Bank</span>
                      <span className="font-medium">{100 - avgPartner}%</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Fee Table */}
      <Card>
        <CardHeader className="pb-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <CardTitle>Fee Configurations</CardTitle>
              <CardDescription>All configured fees and their sharing arrangements</CardDescription>
            </div>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList>
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="interchange">Interchange</TabsTrigger>
                <TabsTrigger value="processing">Processing</TabsTrigger>
                <TabsTrigger value="issuance">Issuance</TabsTrigger>
                <TabsTrigger value="transaction">Transaction</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Fee Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Fee Amount</TableHead>
                  <TableHead>Partner Share</TableHead>
                  <TableHead>Bank Share</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredFees.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                      No fees found in this category
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredFees.map((fee) => (
                    <TableRow key={fee.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{fee.name}</p>
                          <p className="text-xs text-muted-foreground">{fee.id}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={categoryConfig[fee.category].color}>
                          {categoryConfig[fee.category].icon}
                          <span className="ml-1">{categoryConfig[fee.category].label}</span>
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <span className="font-medium">{formatFee(fee)}</span>
                        <span className="text-xs text-muted-foreground ml-1">
                          ({fee.feeType})
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-2 bg-muted rounded-full overflow-hidden">
                            <div
                              className="h-full bg-primary rounded-full"
                              style={{ width: `${fee.partnerShare}%` }}
                            />
                          </div>
                          <span className="text-sm font-medium text-primary">{fee.partnerShare}%</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-2 bg-muted rounded-full overflow-hidden">
                            <div
                              className="h-full bg-slate-400 rounded-full"
                              style={{ width: `${fee.bankShare}%` }}
                            />
                          </div>
                          <span className="text-sm font-medium text-muted-foreground">{fee.bankShare}%</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={statusConfig[fee.status].className}>
                          {statusConfig[fee.status].label}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleViewDetails(fee)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEditFee(fee)}
                            disabled={fee.status === "pending"}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* View Details Dialog */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Fee Details</DialogTitle>
            <DialogDescription>{selectedFee?.name}</DialogDescription>
          </DialogHeader>
          {selectedFee && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Fee ID</p>
                  <p className="font-medium">{selectedFee.id}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  <Badge variant="outline" className={statusConfig[selectedFee.status].className}>
                    {statusConfig[selectedFee.status].label}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Category</p>
                  <Badge variant="outline" className={categoryConfig[selectedFee.category].color}>
                    {categoryConfig[selectedFee.category].label}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Fee Type</p>
                  <p className="font-medium capitalize">{selectedFee.feeType}</p>
                </div>
              </div>

              <Separator />

              <div>
                <p className="text-sm text-muted-foreground mb-2">Fee Amount</p>
                <p className="text-2xl font-bold">{formatFee(selectedFee)}</p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground mb-3">Fee Sharing Split</p>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="flex items-center gap-2">
                        <PiggyBank className="h-4 w-4 text-primary" />
                        Partner Share
                      </span>
                      <span className="font-bold text-primary">{selectedFee.partnerShare}%</span>
                    </div>
                    <div className="h-3 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary rounded-full"
                        style={{ width: `${selectedFee.partnerShare}%` }}
                      />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="flex items-center gap-2">
                        <Building2 className="h-4 w-4 text-slate-500" />
                        Bank Share
                      </span>
                      <span className="font-bold text-slate-600">{selectedFee.bankShare}%</span>
                    </div>
                    <div className="h-3 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-slate-400 rounded-full"
                        style={{ width: `${selectedFee.bankShare}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <p className="text-sm text-muted-foreground">Description</p>
                <p className="text-sm">{selectedFee.description}</p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">Effective Date</p>
                <p className="text-sm font-medium">
                  {new Date(selectedFee.effectiveDate).toLocaleDateString("en-NG", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setViewDialogOpen(false)}>
              Close
            </Button>
            {selectedFee?.status !== "pending" && (
              <Button
                onClick={() => {
                  setViewDialogOpen(false);
                  handleEditFee(selectedFee!);
                }}
              >
                <Edit className="h-4 w-4 mr-2" />
                Request Change
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Fee Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Request Fee Change</DialogTitle>
            <DialogDescription>
              Modify the fee sharing arrangement. Changes require approval.
            </DialogDescription>
          </DialogHeader>
          {selectedFee && (
            <div className="space-y-4">
              <div className="p-3 bg-muted rounded-lg">
                <p className="font-medium">{selectedFee.name}</p>
                <p className="text-sm text-muted-foreground">
                  Current: Partner {selectedFee.partnerShare}% / Bank {selectedFee.bankShare}%
                </p>
              </div>

              <div className="flex items-center gap-2 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                <Info className="h-4 w-4 text-yellow-600" />
                <p className="text-sm text-yellow-800">
                  Fee changes are subject to partner agreement review and approval.
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="partnerShare">Partner Share (%)</Label>
                  <Input
                    id="partnerShare"
                    type="number"
                    min="0"
                    max="100"
                    value={editForm.partnerShare}
                    onChange={(e) => handlePartnerShareChange(e.target.value)}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="bankShare">Bank Share (%)</Label>
                  <Input
                    id="bankShare"
                    type="number"
                    value={editForm.bankShare}
                    disabled
                    className="mt-1 bg-muted"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Automatically calculated (100% - Partner Share)
                  </p>
                </div>

                {/* Preview */}
                <div className="p-4 border rounded-lg">
                  <p className="text-sm font-medium mb-3">New Split Preview</p>
                  <div className="h-4 bg-muted rounded-full overflow-hidden flex">
                    <div
                      className="h-full bg-primary transition-all"
                      style={{ width: `${editForm.partnerShare}%` }}
                    />
                    <div
                      className="h-full bg-slate-400 transition-all"
                      style={{ width: `${editForm.bankShare}%` }}
                    />
                  </div>
                  <div className="flex justify-between mt-2 text-sm">
                    <span className="text-primary font-medium">Partner: {editForm.partnerShare}%</span>
                    <span className="text-slate-600 font-medium">Bank: {editForm.bankShare}%</span>
                  </div>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmitEdit}>Submit for Approval</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default FeeConfiguration;
