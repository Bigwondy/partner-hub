import { useState } from "react";
import { Check, X, Eye, Clock, Search, Filter } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

interface ApprovalRequest {
  id: string;
  type: "card_request" | "limit_change" | "hotlist" | "reissue" | "status_change";
  requestedBy: string;
  requestedByEmail: string;
  subject: string;
  description: string;
  status: "pending" | "approved" | "rejected";
  priority: "low" | "medium" | "high";
  createdAt: string;
  metadata?: Record<string, string>;
}

const initialApprovals: ApprovalRequest[] = [
  {
    id: "APR-001",
    type: "card_request",
    requestedBy: "John Smith",
    requestedByEmail: "john.smith@partner.com",
    subject: "Bulk Card Request - 500 Instant Cards",
    description: "Request for 500 instant cards for new customer onboarding campaign",
    status: "pending",
    priority: "high",
    createdAt: "2024-01-15 10:30",
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
    createdAt: "2024-01-15 09:15",
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
    createdAt: "2024-01-15 08:45",
    metadata: {
      cardPan: "**** **** **** 7892",
      reason: "Fraud suspected",
      customerName: "Adebayo Olamide",
    },
  },
  {
    id: "APR-004",
    type: "card_request",
    requestedBy: "David Wilson",
    requestedByEmail: "d.wilson@partner.com",
    subject: "Embossed Card Request - 100 Cards",
    description: "Request for personalized embossed cards with company branding",
    status: "approved",
    priority: "medium",
    createdAt: "2024-01-13 11:00",
    metadata: {
      cardType: "Embossed",
      profile: "Premium Debit",
      quantity: "100",
    },
  },
  {
    id: "APR-005",
    type: "status_change",
    requestedBy: "Lisa Anderson",
    requestedByEmail: "l.anderson@partner.com",
    subject: "Deactivate Card - Customer Request",
    description: "Customer requested temporary deactivation while traveling",
    status: "approved",
    priority: "low",
    createdAt: "2024-01-12 15:45",
    metadata: {
      cardPan: "**** **** **** 9012",
      action: "Deactivate",
      reason: "Travel",
    },
  },
  {
    id: "APR-006",
    type: "reissue",
    requestedBy: "Admin User",
    requestedByEmail: "admin@pavilion.com",
    subject: "Card Reissue - Lost Card",
    description: "Customer reported card lost, requesting replacement",
    status: "rejected",
    priority: "medium",
    createdAt: "2024-01-11 10:00",
    metadata: {
      cardPan: "**** **** **** 3456",
      reason: "Lost Card",
    },
  },
];

const typeConfig: Record<string, { label: string; className: string }> = {
  card_request: { label: "Card Request", className: "bg-info/10 text-info" },
  limit_change: { label: "Limit Change", className: "bg-accent/10 text-accent" },
  hotlist: { label: "Hotlist", className: "bg-destructive/10 text-destructive" },
  reissue: { label: "Reissue", className: "bg-warning/10 text-warning" },
  status_change: { label: "Status Change", className: "bg-primary/10 text-primary" },
};

const statusConfig: Record<string, { label: string; className: string }> = {
  pending: { label: "Pending", className: "bg-warning/10 text-warning" },
  approved: { label: "Approved", className: "bg-success/10 text-success" },
  rejected: { label: "Rejected", className: "bg-destructive/10 text-destructive" },
};

const priorityConfig: Record<string, { label: string; className: string }> = {
  low: { label: "Low", className: "bg-muted text-muted-foreground" },
  medium: { label: "Medium", className: "bg-info/10 text-info" },
  high: { label: "High", className: "bg-destructive/10 text-destructive" },
};

export default function Approvals() {
  const [approvals, setApprovals] = useState<ApprovalRequest[]>(initialApprovals);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedApproval, setSelectedApproval] = useState<ApprovalRequest | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [actionDialogOpen, setActionDialogOpen] = useState(false);
  const [actionType, setActionType] = useState<"approve" | "reject">("approve");
  const [comment, setComment] = useState("");
  const { toast } = useToast();

  const pendingApprovals = approvals.filter((a) => a.status === "pending");
  const processedApprovals = approvals.filter((a) => a.status !== "pending");

  const filteredPending = pendingApprovals.filter(
    (a) =>
      a.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.requestedBy.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredProcessed = processedApprovals.filter(
    (a) =>
      a.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.requestedBy.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleViewDetails = (approval: ApprovalRequest) => {
    setSelectedApproval(approval);
    setDetailsOpen(true);
  };

  const handleAction = (approval: ApprovalRequest, action: "approve" | "reject") => {
    setSelectedApproval(approval);
    setActionType(action);
    setActionDialogOpen(true);
  };

  const confirmAction = () => {
    if (!selectedApproval) return;

    setApprovals((prev) =>
      prev.map((a) =>
        a.id === selectedApproval.id
          ? { ...a, status: actionType === "approve" ? "approved" : "rejected" }
          : a
      )
    );

    toast({
      title: actionType === "approve" ? "Request Approved" : "Request Rejected",
      description: `${selectedApproval.subject} has been ${actionType === "approve" ? "approved" : "rejected"}.`,
    });

    setActionDialogOpen(false);
    setComment("");
  };

  const ApprovalTable = ({ data }: { data: ApprovalRequest[] }) => (
    <div className="card-elevated overflow-hidden">
      <table className="data-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Subject</th>
            <th>Type</th>
            <th>Requested By</th>
            <th>Priority</th>
            <th>Status</th>
            <th className="w-32">Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan={7} className="text-center py-8 text-muted-foreground">
                No requests found
              </td>
            </tr>
          ) : (
            data.map((approval) => (
              <tr key={approval.id}>
                <td className="text-muted-foreground text-sm">{approval.createdAt}</td>
                <td>
                  <span className="font-medium text-foreground">{approval.subject}</span>
                </td>
                <td>
                  <Badge className={typeConfig[approval.type].className}>
                    {typeConfig[approval.type].label}
                  </Badge>
                </td>
                <td className="text-muted-foreground">{approval.requestedBy}</td>
                <td>
                  <Badge className={priorityConfig[approval.priority].className}>
                    {priorityConfig[approval.priority].label}
                  </Badge>
                </td>
                <td>
                  <Badge className={statusConfig[approval.status].className}>
                    {statusConfig[approval.status].label}
                  </Badge>
                </td>
                <td>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleViewDetails(approval)}
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                    {approval.status === "pending" && (
                      <>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-success hover:text-success hover:bg-success/10"
                          onClick={() => handleAction(approval, "approve")}
                        >
                          <Check className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-destructive hover:text-destructive hover:bg-destructive/10"
                          onClick={() => handleAction(approval, "reject")}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      <div className="flex items-center justify-between px-4 py-3 border-t border-border">
        <p className="text-sm text-muted-foreground">
          Showing {data.length} {data.length === 1 ? "request" : "requests"}
        </p>
      </div>
    </div>
  );

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div className="page-header">
        <h1 className="page-title">Approvals</h1>
        <p className="page-description">
          Review and process pending approval requests
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-warning/10 border border-warning/20">
          <div className="flex items-center gap-3">
            <Clock className="w-5 h-5 text-warning" />
            <div>
              <p className="text-2xl font-bold text-warning">{pendingApprovals.length}</p>
              <p className="text-sm text-warning/80">Pending</p>
            </div>
          </div>
        </div>
        <div className="p-4 rounded-xl bg-success/10 border border-success/20">
          <div className="flex items-center gap-3">
            <Check className="w-5 h-5 text-success" />
            <div>
              <p className="text-2xl font-bold text-success">
                {approvals.filter((a) => a.status === "approved").length}
              </p>
              <p className="text-sm text-success/80">Approved</p>
            </div>
          </div>
        </div>
        <div className="p-4 rounded-xl bg-destructive/10 border border-destructive/20">
          <div className="flex items-center gap-3">
            <X className="w-5 h-5 text-destructive" />
            <div>
              <p className="text-2xl font-bold text-destructive">
                {approvals.filter((a) => a.status === "rejected").length}
              </p>
              <p className="text-sm text-destructive/80">Rejected</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="card-elevated p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by subject or requester..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input-field pl-10"
          />
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="pending" className="space-y-4">
        <TabsList>
          <TabsTrigger value="pending">
            Pending ({filteredPending.length})
          </TabsTrigger>
          <TabsTrigger value="processed">
            Processed ({filteredProcessed.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pending">
          <ApprovalTable data={filteredPending} />
        </TabsContent>

        <TabsContent value="processed">
          <ApprovalTable data={filteredProcessed} />
        </TabsContent>
      </Tabs>

      {/* Details Sheet */}
      <Sheet open={detailsOpen} onOpenChange={setDetailsOpen}>
        <SheetContent className="sm:max-w-lg">
          <SheetHeader>
            <SheetTitle>Request Details</SheetTitle>
            <SheetDescription>{selectedApproval?.id}</SheetDescription>
          </SheetHeader>

          {selectedApproval && (
            <div className="mt-6 space-y-6">
              <div className="flex items-center justify-between">
                <Badge className={typeConfig[selectedApproval.type].className}>
                  {typeConfig[selectedApproval.type].label}
                </Badge>
                <Badge className={statusConfig[selectedApproval.status].className}>
                  {statusConfig[selectedApproval.status].label}
                </Badge>
              </div>

              <div className="space-y-4 p-4 rounded-xl bg-muted/50 border border-border">
                <h4 className="text-sm font-medium text-foreground">Request Information</h4>
                <div className="space-y-3 text-sm">
                  <div>
                    <p className="text-muted-foreground">Subject</p>
                    <p className="font-medium text-foreground">{selectedApproval.subject}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Description</p>
                    <p className="text-foreground">{selectedApproval.description}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-muted-foreground">Requested By</p>
                      <p className="font-medium text-foreground">{selectedApproval.requestedBy}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Date</p>
                      <p className="font-medium text-foreground">{selectedApproval.createdAt}</p>
                    </div>
                  </div>
                </div>
              </div>

              {selectedApproval.metadata && (
                <div className="space-y-4 p-4 rounded-xl bg-muted/50 border border-border">
                  <h4 className="text-sm font-medium text-foreground">Additional Details</h4>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    {Object.entries(selectedApproval.metadata).map(([key, value]) => (
                      <div key={key}>
                        <p className="text-muted-foreground capitalize">
                          {key.replace(/([A-Z])/g, " $1").trim()}
                        </p>
                        <p className="font-medium text-foreground">{value}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {selectedApproval.status === "pending" && (
                <div className="flex gap-3 pt-4">
                  <Button
                    className="flex-1 btn-accent"
                    onClick={() => handleAction(selectedApproval, "approve")}
                  >
                    <Check className="w-4 h-4 mr-2" />
                    Approve
                  </Button>
                  <Button
                    variant="destructive"
                    className="flex-1"
                    onClick={() => handleAction(selectedApproval, "reject")}
                  >
                    <X className="w-4 h-4 mr-2" />
                    Reject
                  </Button>
                </div>
              )}
            </div>
          )}
        </SheetContent>
      </Sheet>

      {/* Action Confirmation Dialog */}
      <Dialog open={actionDialogOpen} onOpenChange={setActionDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {actionType === "approve" ? "Approve Request" : "Reject Request"}
            </DialogTitle>
            <DialogDescription>
              {actionType === "approve"
                ? "Are you sure you want to approve this request?"
                : "Are you sure you want to reject this request?"}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Label htmlFor="comment">Comment (Optional)</Label>
            <Textarea
              id="comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Add a comment..."
              rows={3}
              className="mt-2"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setActionDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              variant={actionType === "approve" ? "default" : "destructive"}
              className={actionType === "approve" ? "btn-accent" : ""}
              onClick={confirmAction}
            >
              {actionType === "approve" ? "Approve" : "Reject"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
