import { useState } from "react";
import { Check, X, Eye, Clock, Search } from "lucide-react";
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
import { useApprovalsStore, ApprovalRequest } from "@/stores/approvalsStore";
const typeConfig: Record<string, { label: string; className: string }> = {
  card_request: { label: "Card Request", className: "bg-info/10 text-info" },
  hotlist: { label: "Hotlist", className: "bg-destructive/10 text-destructive" },
  reissue: { label: "Reissue", className: "bg-accent/10 text-accent" },
};

const statusConfig: Record<string, { label: string; className: string }> = {
  pending: { label: "Pending", className: "bg-warning/10 text-warning" },
  approved: { label: "Approved", className: "bg-success/10 text-success" },
  rejected: { label: "Rejected", className: "bg-destructive/10 text-destructive" },
};

export default function Approvals() {
  const { approvals, updateApproval } = useApprovalsStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedApproval, setSelectedApproval] = useState<ApprovalRequest | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [actionDialogOpen, setActionDialogOpen] = useState(false);
  const [actionType, setActionType] = useState<"approve" | "reject">("approve");
  const [comment, setComment] = useState("");
  const [activeTab, setActiveTab] = useState("pending");
  const { toast } = useToast();

  // Filter to show card requests, hotlist, and reissue requests
  const cardRelatedApprovals = approvals.filter((a) => 
    a.type === "card_request" || a.type === "hotlist" || a.type === "reissue"
  );
  const pendingApprovals = cardRelatedApprovals.filter((a) => a.status === "pending");

  const filteredPending = pendingApprovals.filter(
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

    updateApproval(selectedApproval.id, {
      status: actionType === "approve" ? "approved" : "rejected",
      reviewedBy: "Current User",
      reviewComment: comment || undefined,
    });

    toast({
      title: actionType === "approve" ? "Request Approved" : "Request Rejected",
      description: `${selectedApproval.subject} has been ${actionType === "approve" ? "approved" : "rejected"}.`,
    });

    setActionDialogOpen(false);
    setComment("");
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const ApprovalTable = ({ data }: { data: ApprovalRequest[] }) => (
    <div className="card-elevated overflow-hidden">
      <table className="data-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Type</th>
            <th>Subject</th>
            <th>Requested By</th>
            <th>Status</th>
            <th className="w-24">Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan={6} className="text-center py-8 text-muted-foreground">
                No requests found
              </td>
            </tr>
          ) : (
            data.map((approval) => (
              <tr key={approval.id}>
                <td className="text-muted-foreground text-sm">{formatDate(approval.createdAt)}</td>
                <td>
                  <Badge className={typeConfig[approval.type]?.className || "bg-muted text-muted-foreground"}>
                    {typeConfig[approval.type]?.label || approval.type}
                  </Badge>
                </td>
                <td>
                  <span className="font-medium text-foreground">{approval.subject}</span>
                </td>
                <td className="text-muted-foreground">{approval.requestedBy}</td>
                <td>
                  <Badge className={statusConfig[approval.status].className}>
                    {statusConfig[approval.status].label}
                  </Badge>
                </td>
                <td>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleViewDetails(approval)}
                  >
                    <Eye className="w-4 h-4 mr-1" />
                    View
                  </Button>
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
          Review and process pending card requests, hotlist, and reissue approvals
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <button
          onClick={() => setActiveTab("pending")}
          className="p-4 rounded-xl bg-warning/10 border border-warning/20 hover:bg-warning/20 transition-colors text-left"
        >
          <div className="flex items-center gap-3">
            <Clock className="w-5 h-5 text-warning" />
            <div>
              <p className="text-2xl font-bold text-warning">{pendingApprovals.length}</p>
              <p className="text-sm text-warning/80">Pending</p>
            </div>
          </div>
        </button>
        <button
          onClick={() => setActiveTab("approved")}
          className="p-4 rounded-xl bg-success/10 border border-success/20 hover:bg-success/20 transition-colors text-left"
        >
          <div className="flex items-center gap-3">
            <Check className="w-5 h-5 text-success" />
            <div>
              <p className="text-2xl font-bold text-success">
                {cardRelatedApprovals.filter((a) => a.status === "approved").length}
              </p>
              <p className="text-sm text-success/80">Approved</p>
            </div>
          </div>
        </button>
        <button
          onClick={() => setActiveTab("rejected")}
          className="p-4 rounded-xl bg-destructive/10 border border-destructive/20 hover:bg-destructive/20 transition-colors text-left"
        >
          <div className="flex items-center gap-3">
            <X className="w-5 h-5 text-destructive" />
            <div>
              <p className="text-2xl font-bold text-destructive">
                {cardRelatedApprovals.filter((a) => a.status === "rejected").length}
              </p>
              <p className="text-sm text-destructive/80">Rejected</p>
            </div>
          </div>
        </button>
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
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="pending">
            Pending ({filteredPending.length})
          </TabsTrigger>
          <TabsTrigger value="approved">
            Approved ({cardRelatedApprovals.filter((a) => a.status === "approved").length})
          </TabsTrigger>
          <TabsTrigger value="rejected">
            Rejected ({cardRelatedApprovals.filter((a) => a.status === "rejected").length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pending">
          <ApprovalTable data={filteredPending} />
        </TabsContent>

        <TabsContent value="approved">
          <ApprovalTable data={cardRelatedApprovals.filter((a) => 
            a.status === "approved" &&
            (a.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
             a.requestedBy.toLowerCase().includes(searchQuery.toLowerCase()))
          )} />
        </TabsContent>

        <TabsContent value="rejected">
          <ApprovalTable data={cardRelatedApprovals.filter((a) => 
            a.status === "rejected" &&
            (a.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
             a.requestedBy.toLowerCase().includes(searchQuery.toLowerCase()))
          )} />
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
              <div className="flex items-center justify-end">
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
                    Accept
                  </Button>
                  <Button
                    variant="destructive"
                    className="flex-1"
                    onClick={() => handleAction(selectedApproval, "reject")}
                  >
                    Decline
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
              {actionType === "approve" ? "Accept Request" : "Decline Request"}
            </DialogTitle>
            <DialogDescription>
              {actionType === "approve"
                ? "Are you sure you want to accept this request?"
                : "Are you sure you want to decline this request?"}
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
              {actionType === "approve" ? "Accept" : "Decline"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
