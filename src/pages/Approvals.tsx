import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
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
} from "@/components/ui/dropdown-menu";
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
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import {
  Search,
  Filter,
  MoreHorizontal,
  CheckCircle,
  XCircle,
  Clock,
  Eye,
  CreditCard,
  Users,
  Settings,
  AlertTriangle,
  ShieldCheck,
  ShieldX,
} from "lucide-react";

interface ApprovalRequest {
  id: string;
  type: "card_request" | "limit_change" | "hotlist" | "reissue" | "status_change" | "user_invite" | "config_change";
  requestedBy: string;
  requestedByEmail: string;
  subject: string;
  description: string;
  status: "pending" | "approved" | "rejected";
  priority: "low" | "medium" | "high";
  createdAt: string;
  updatedAt: string;
  reviewedBy?: string;
  reviewComment?: string;
  metadata?: Record<string, string>;
}

const mockApprovals: ApprovalRequest[] = [
  {
    id: "APR-001",
    type: "card_request",
    requestedBy: "John Smith",
    requestedByEmail: "john.smith@partner.com",
    subject: "Bulk Card Request - 500 Instant Cards",
    description: "Request for 500 instant cards for new customer onboarding campaign",
    status: "pending",
    priority: "high",
    createdAt: "2024-01-15T10:30:00",
    updatedAt: "2024-01-15T10:30:00",
    metadata: {
      cardType: "Instant",
      profile: "Standard Debit",
      quantity: "500",
    },
  },
  {
    id: "APR-002",
    type: "limit_change",
    requestedBy: "Sarah Johnson",
    requestedByEmail: "sarah.j@partner.com",
    subject: "Card Limit Increase - **** 4521",
    description: "Increase daily transaction limit from ₦100,000 to ₦500,000",
    status: "pending",
    priority: "medium",
    createdAt: "2024-01-15T09:15:00",
    updatedAt: "2024-01-15T09:15:00",
    metadata: {
      cardPan: "**** **** **** 4521",
      currentLimit: "₦100,000",
      requestedLimit: "₦500,000",
    },
  },
  {
    id: "APR-003",
    type: "hotlist",
    requestedBy: "Michael Brown",
    requestedByEmail: "m.brown@partner.com",
    subject: "Hotlist Card - Fraud Suspected",
    description: "Customer reported unauthorized transactions, requesting immediate hotlist",
    status: "pending",
    priority: "high",
    createdAt: "2024-01-15T08:45:00",
    updatedAt: "2024-01-15T08:45:00",
    metadata: {
      cardPan: "**** **** **** 7892",
      reason: "Fraud suspected",
      customerName: "Adebayo Olamide",
    },
  },
  {
    id: "APR-004",
    type: "user_invite",
    requestedBy: "Admin User",
    requestedByEmail: "admin@pavilion.com",
    subject: "New User Invitation - Finance Role",
    description: "Invite new finance officer to access settlement reports",
    status: "pending",
    priority: "low",
    createdAt: "2024-01-14T16:20:00",
    updatedAt: "2024-01-14T16:20:00",
    metadata: {
      inviteeEmail: "finance.new@partner.com",
      role: "Finance Officer",
      userType: "Regular",
    },
  },
  {
    id: "APR-005",
    type: "reissue",
    requestedBy: "Emily Davis",
    requestedByEmail: "e.davis@partner.com",
    subject: "Card Reissuance - Expired Card",
    description: "Customer requesting replacement for expired card",
    status: "pending",
    priority: "medium",
    createdAt: "2024-01-14T14:00:00",
    updatedAt: "2024-01-14T14:00:00",
    metadata: {
      cardPan: "**** **** **** 3456",
      reason: "Card Expired",
      customerName: "Chinwe Eze",
    },
  },
  {
    id: "APR-006",
    type: "card_request",
    requestedBy: "David Wilson",
    requestedByEmail: "d.wilson@partner.com",
    subject: "Embossed Card Request - 100 Cards",
    description: "Request for personalized embossed cards with company branding",
    status: "approved",
    priority: "medium",
    createdAt: "2024-01-13T11:00:00",
    updatedAt: "2024-01-14T09:30:00",
    reviewedBy: "Admin User",
    reviewComment: "Approved. Card file verified and production scheduled.",
    metadata: {
      cardType: "Embossed",
      profile: "Premium Debit",
      quantity: "100",
    },
  },
  {
    id: "APR-007",
    type: "status_change",
    requestedBy: "Lisa Anderson",
    requestedByEmail: "l.anderson@partner.com",
    subject: "Deactivate Card - Customer Request",
    description: "Customer requested temporary deactivation while traveling",
    status: "approved",
    priority: "low",
    createdAt: "2024-01-12T15:45:00",
    updatedAt: "2024-01-13T08:00:00",
    reviewedBy: "Support Lead",
    reviewComment: "Approved per customer request. Card can be reactivated upon return.",
    metadata: {
      cardPan: "**** **** **** 9012",
      action: "Deactivate",
      reason: "Travel",
    },
  },
  {
    id: "APR-008",
    type: "config_change",
    requestedBy: "Admin User",
    requestedByEmail: "admin@pavilion.com",
    subject: "Fee Configuration Update",
    description: "Update interchange fee percentage from 1.5% to 1.75%",
    status: "rejected",
    priority: "high",
    createdAt: "2024-01-11T10:00:00",
    updatedAt: "2024-01-12T14:30:00",
    reviewedBy: "Partner Admin",
    reviewComment: "Rejected. Fee increase requires partner agreement renewal first.",
    metadata: {
      configType: "Fee",
      currentValue: "1.5%",
      proposedValue: "1.75%",
    },
  },
];

const typeConfig: Record<string, { label: string; icon: React.ReactNode; color: string }> = {
  card_request: { label: "Card Request", icon: <CreditCard className="h-4 w-4" />, color: "bg-blue-100 text-blue-800" },
  limit_change: { label: "Limit Change", icon: <Settings className="h-4 w-4" />, color: "bg-purple-100 text-purple-800" },
  hotlist: { label: "Hotlist", icon: <AlertTriangle className="h-4 w-4" />, color: "bg-red-100 text-red-800" },
  reissue: { label: "Reissue", icon: <CreditCard className="h-4 w-4" />, color: "bg-orange-100 text-orange-800" },
  status_change: { label: "Status Change", icon: <Settings className="h-4 w-4" />, color: "bg-cyan-100 text-cyan-800" },
  user_invite: { label: "User Invite", icon: <Users className="h-4 w-4" />, color: "bg-green-100 text-green-800" },
  config_change: { label: "Config Change", icon: <Settings className="h-4 w-4" />, color: "bg-yellow-100 text-yellow-800" },
};

const statusConfig: Record<string, { label: string; className: string }> = {
  pending: { label: "Pending", className: "bg-yellow-100 text-yellow-800 border-yellow-200" },
  approved: { label: "Approved", className: "bg-green-100 text-green-800 border-green-200" },
  rejected: { label: "Rejected", className: "bg-red-100 text-red-800 border-red-200" },
};

const priorityConfig: Record<string, { label: string; className: string }> = {
  low: { label: "Low", className: "bg-slate-100 text-slate-600" },
  medium: { label: "Medium", className: "bg-blue-100 text-blue-700" },
  high: { label: "High", className: "bg-red-100 text-red-700" },
};

const Approvals = () => {
  const { toast } = useToast();
  const [approvals, setApprovals] = useState<ApprovalRequest[]>(mockApprovals);
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [activeTab, setActiveTab] = useState("pending");
  const [selectedApproval, setSelectedApproval] = useState<ApprovalRequest | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [actionDialogOpen, setActionDialogOpen] = useState(false);
  const [actionType, setActionType] = useState<"approve" | "reject">("approve");
  const [reviewComment, setReviewComment] = useState("");

  const filteredApprovals = approvals.filter((approval) => {
    const matchesSearch =
      approval.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      approval.requestedBy.toLowerCase().includes(searchQuery.toLowerCase()) ||
      approval.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = typeFilter === "all" || approval.type === typeFilter;
    const matchesStatus = activeTab === "all" || approval.status === activeTab;
    return matchesSearch && matchesType && matchesStatus;
  });

  const pendingCount = approvals.filter((a) => a.status === "pending").length;
  const approvedCount = approvals.filter((a) => a.status === "approved").length;
  const rejectedCount = approvals.filter((a) => a.status === "rejected").length;

  const handleViewDetails = (approval: ApprovalRequest) => {
    setSelectedApproval(approval);
    setViewDialogOpen(true);
  };

  const handleOpenAction = (approval: ApprovalRequest, action: "approve" | "reject") => {
    setSelectedApproval(approval);
    setActionType(action);
    setReviewComment("");
    setActionDialogOpen(true);
  };

  const handleSubmitAction = () => {
    if (!selectedApproval) return;

    setApprovals((prev) =>
      prev.map((a) =>
        a.id === selectedApproval.id
          ? {
              ...a,
              status: actionType === "approve" ? "approved" : "rejected",
              updatedAt: new Date().toISOString(),
              reviewedBy: "Current User",
              reviewComment: reviewComment || undefined,
            }
          : a
      )
    );

    toast({
      title: actionType === "approve" ? "Request Approved" : "Request Rejected",
      description: `${selectedApproval.id} has been ${actionType === "approve" ? "approved" : "rejected"}.`,
    });

    setActionDialogOpen(false);
    setSelectedApproval(null);
    setReviewComment("");
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-NG", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Approvals</h1>
        <p className="text-muted-foreground">
          Review and manage pending approval requests
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pending</p>
                <p className="text-2xl font-bold text-yellow-600">{pendingCount}</p>
              </div>
              <Clock className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Approved</p>
                <p className="text-2xl font-bold text-green-600">{approvedCount}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Rejected</p>
                <p className="text-2xl font-bold text-red-600">{rejectedCount}</p>
              </div>
              <XCircle className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total</p>
                <p className="text-2xl font-bold">{approvals.length}</p>
              </div>
              <ShieldCheck className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs and Filters */}
      <Card>
        <CardHeader className="pb-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full md:w-auto">
              <TabsList>
                <TabsTrigger value="pending" className="gap-2">
                  <Clock className="h-4 w-4" />
                  Pending ({pendingCount})
                </TabsTrigger>
                <TabsTrigger value="approved" className="gap-2">
                  <CheckCircle className="h-4 w-4" />
                  Approved
                </TabsTrigger>
                <TabsTrigger value="rejected" className="gap-2">
                  <XCircle className="h-4 w-4" />
                  Rejected
                </TabsTrigger>
                <TabsTrigger value="all">All</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardHeader>
        <CardContent>
          {/* Search and Filter Bar */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by ID, subject, or requester..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-full md:w-[200px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="card_request">Card Request</SelectItem>
                <SelectItem value="limit_change">Limit Change</SelectItem>
                <SelectItem value="hotlist">Hotlist</SelectItem>
                <SelectItem value="reissue">Reissue</SelectItem>
                <SelectItem value="status_change">Status Change</SelectItem>
                <SelectItem value="user_invite">User Invite</SelectItem>
                <SelectItem value="config_change">Config Change</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Request ID</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Subject</TableHead>
                  <TableHead>Requested By</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredApprovals.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                      No approval requests found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredApprovals.map((approval) => (
                    <TableRow key={approval.id}>
                      <TableCell className="font-medium">{approval.id}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className={typeConfig[approval.type].color}>
                          <span className="mr-1">{typeConfig[approval.type].icon}</span>
                          {typeConfig[approval.type].label}
                        </Badge>
                      </TableCell>
                      <TableCell className="max-w-[200px] truncate">{approval.subject}</TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{approval.requestedBy}</p>
                          <p className="text-xs text-muted-foreground">{approval.requestedByEmail}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary" className={priorityConfig[approval.priority].className}>
                          {priorityConfig[approval.priority].label}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={statusConfig[approval.status].className}>
                          {statusConfig[approval.status].label}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {formatDate(approval.createdAt)}
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleViewDetails(approval)}>
                              <Eye className="h-4 w-4 mr-2" />
                              View Details
                            </DropdownMenuItem>
                            {approval.status === "pending" && (
                              <>
                                <DropdownMenuItem
                                  onClick={() => handleOpenAction(approval, "approve")}
                                  className="text-green-600"
                                >
                                  <ShieldCheck className="h-4 w-4 mr-2" />
                                  Approve
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => handleOpenAction(approval, "reject")}
                                  className="text-red-600"
                                >
                                  <ShieldX className="h-4 w-4 mr-2" />
                                  Reject
                                </DropdownMenuItem>
                              </>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
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
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Request Details</DialogTitle>
            <DialogDescription>
              {selectedApproval?.id} - {selectedApproval?.subject}
            </DialogDescription>
          </DialogHeader>
          {selectedApproval && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Type</p>
                  <Badge variant="outline" className={typeConfig[selectedApproval.type].color}>
                    {typeConfig[selectedApproval.type].label}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  <Badge variant="outline" className={statusConfig[selectedApproval.status].className}>
                    {statusConfig[selectedApproval.status].label}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Priority</p>
                  <Badge variant="secondary" className={priorityConfig[selectedApproval.priority].className}>
                    {priorityConfig[selectedApproval.priority].label}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Created</p>
                  <p className="text-sm font-medium">{formatDate(selectedApproval.createdAt)}</p>
                </div>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">Requested By</p>
                <p className="font-medium">{selectedApproval.requestedBy}</p>
                <p className="text-sm text-muted-foreground">{selectedApproval.requestedByEmail}</p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">Description</p>
                <p className="text-sm">{selectedApproval.description}</p>
              </div>

              {selectedApproval.metadata && (
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Additional Details</p>
                  <div className="bg-muted rounded-md p-3 space-y-1">
                    {Object.entries(selectedApproval.metadata).map(([key, value]) => (
                      <div key={key} className="flex justify-between text-sm">
                        <span className="text-muted-foreground capitalize">
                          {key.replace(/([A-Z])/g, " $1").trim()}:
                        </span>
                        <span className="font-medium">{value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {selectedApproval.reviewedBy && (
                <div className="border-t pt-4">
                  <p className="text-sm text-muted-foreground">Reviewed By</p>
                  <p className="font-medium">{selectedApproval.reviewedBy}</p>
                  {selectedApproval.reviewComment && (
                    <p className="text-sm text-muted-foreground mt-1">
                      "{selectedApproval.reviewComment}"
                    </p>
                  )}
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            {selectedApproval?.status === "pending" && (
              <div className="flex gap-2 w-full">
                <Button
                  variant="outline"
                  className="flex-1 text-red-600 border-red-200 hover:bg-red-50"
                  onClick={() => {
                    setViewDialogOpen(false);
                    handleOpenAction(selectedApproval, "reject");
                  }}
                >
                  <ShieldX className="h-4 w-4 mr-2" />
                  Reject
                </Button>
                <Button
                  className="flex-1 bg-green-600 hover:bg-green-700"
                  onClick={() => {
                    setViewDialogOpen(false);
                    handleOpenAction(selectedApproval, "approve");
                  }}
                >
                  <ShieldCheck className="h-4 w-4 mr-2" />
                  Approve
                </Button>
              </div>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Approve/Reject Dialog */}
      <Dialog open={actionDialogOpen} onOpenChange={setActionDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {actionType === "approve" ? "Approve Request" : "Reject Request"}
            </DialogTitle>
            <DialogDescription>
              {actionType === "approve"
                ? "Are you sure you want to approve this request?"
                : "Please provide a reason for rejecting this request."}
            </DialogDescription>
          </DialogHeader>
          {selectedApproval && (
            <div className="space-y-4">
              <div className="bg-muted rounded-md p-3">
                <p className="font-medium">{selectedApproval.id}</p>
                <p className="text-sm text-muted-foreground">{selectedApproval.subject}</p>
              </div>
              <div>
                <label className="text-sm font-medium">
                  Comment {actionType === "reject" && <span className="text-red-500">*</span>}
                </label>
                <Textarea
                  placeholder={
                    actionType === "approve"
                      ? "Optional approval notes..."
                      : "Reason for rejection..."
                  }
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  className="mt-1"
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setActionDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleSubmitAction}
              disabled={actionType === "reject" && !reviewComment.trim()}
              className={actionType === "approve" ? "bg-green-600 hover:bg-green-700" : "bg-red-600 hover:bg-red-700"}
            >
              {actionType === "approve" ? (
                <>
                  <ShieldCheck className="h-4 w-4 mr-2" />
                  Approve
                </>
              ) : (
                <>
                  <ShieldX className="h-4 w-4 mr-2" />
                  Reject
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Approvals;
