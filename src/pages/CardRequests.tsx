import { useState } from "react";
import { Plus, Search, Filter, Download, Eye, MoreHorizontal, X, FileSpreadsheet, Calendar, CreditCard } from "lucide-react";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

const requests = [
  {
    id: "REQ-2024-001234",
    batchNumber: "BATCH-2024-0089",
    cardProfile: "Visa Gold",
    quantity: 100,
    type: "embossed",
    status: "in_progress",
    createdAt: "2024-01-05 14:32",
    requestedBy: "Sarah Williams",
    approvedBy: "John Doe",
    approvedAt: "2024-01-05 15:00",
    notes: "Urgent order for new branch opening",
  },
  {
    id: "REQ-2024-001233",
    batchNumber: "BATCH-2024-0088",
    cardProfile: "Mastercard Platinum",
    quantity: 50,
    type: "embossed",
    status: "ready",
    createdAt: "2024-01-05 11:15",
    requestedBy: "John Doe",
    approvedBy: "Sarah Williams",
    approvedAt: "2024-01-05 12:30",
    notes: "Premium cards for VIP customers",
  },
  {
    id: "REQ-2024-001232",
    batchNumber: "BATCH-2024-0087",
    cardProfile: "Verve Standard",
    quantity: 200,
    type: "instant",
    status: "pending",
    createdAt: "2024-01-04 16:48",
    requestedBy: "Sarah Williams",
    approvedBy: null,
    approvedAt: null,
    notes: "Stock replenishment for Lagos branches",
  },
  {
    id: "REQ-2024-001231",
    batchNumber: "BATCH-2024-0086",
    cardProfile: "Visa Classic",
    quantity: 25,
    type: "virtual",
    status: "ready",
    createdAt: "2024-01-04 09:22",
    requestedBy: "John Doe",
    approvedBy: "Sarah Williams",
    approvedAt: "2024-01-04 10:00",
    notes: "Virtual cards for corporate clients",
  },
  {
    id: "REQ-2024-001230",
    batchNumber: "BATCH-2024-0085",
    cardProfile: "Mastercard Standard",
    quantity: 150,
    type: "embossed",
    status: "failed",
    createdAt: "2024-01-03 13:05",
    requestedBy: "Sarah Williams",
    approvedBy: "John Doe",
    approvedAt: "2024-01-03 14:00",
    notes: "File validation error - incorrect format",
  },
  {
    id: "REQ-2024-001229",
    batchNumber: "BATCH-2024-0084",
    cardProfile: "Visa Gold",
    quantity: 75,
    type: "instant",
    status: "in_progress",
    createdAt: "2024-01-03 10:41",
    requestedBy: "John Doe",
    approvedBy: "Sarah Williams",
    approvedAt: "2024-01-03 11:15",
    notes: "Regular stock order",
  },
];

const statusConfig: Record<string, { label: string; className: string }> = {
  pending: { label: "Pending", className: "bg-muted text-muted-foreground" },
  in_progress: { label: "In Progress", className: "bg-warning/10 text-warning" },
  ready: { label: "Ready for Issuance", className: "bg-success/10 text-success" },
  failed: { label: "Failed", className: "bg-destructive/10 text-destructive" },
};

const typeConfig: Record<string, { label: string; className: string }> = {
  instant: { label: "Instant", className: "bg-info/10 text-info" },
  embossed: { label: "Embossed", className: "bg-accent/10 text-accent" },
  virtual: { label: "Virtual", className: "bg-primary/10 text-primary" },
};

export default function CardRequests() {
  const [searchQuery, setSearchQuery] = useState("");
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<typeof requests[0] | null>(null);

  const handleViewDetails = (request: typeof requests[0]) => {
    setSelectedRequest(request);
    setDetailsOpen(true);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div className="page-header mb-0">
          <h1 className="page-title">Card Requests</h1>
          <p className="page-description">
            Manage and track card production requests
          </p>
        </div>
        <Link to="/card-requests/new" className="btn-accent">
          <Plus className="w-4 h-4" />
          New Request
        </Link>
      </div>

      {/* Filters Bar */}
      <div className="card-elevated p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search by batch number or card profile..."
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

      {/* Requests Table */}
      <div className="card-elevated overflow-hidden">
        <table className="data-table">
          <thead>
            <tr>
              <th>Date Created</th>
              <th>Batch Number</th>
              <th>Card Profile</th>
              <th>Quantity</th>
              <th>Type</th>
              <th>Status</th>
              <th className="w-16"></th>
            </tr>
          </thead>
          <tbody>
            {requests.map((request) => (
              <tr key={request.id}>
                <td className="text-muted-foreground text-sm">{request.createdAt}</td>
                <td>
                  <span className="font-medium text-foreground">{request.batchNumber}</span>
                </td>
                <td className="text-foreground">{request.cardProfile}</td>
                <td className="text-muted-foreground">{request.quantity.toLocaleString()}</td>
                <td>
                  <Badge className={typeConfig[request.type].className}>
                    {typeConfig[request.type].label}
                  </Badge>
                </td>
                <td>
                  <Badge className={statusConfig[request.status].className}>
                    {statusConfig[request.status].label}
                  </Badge>
                </td>
                <td>
                  <DropdownMenu>
                    <DropdownMenuTrigger className="p-2 hover:bg-muted rounded-lg">
                      <MoreHorizontal className="w-4 h-4 text-muted-foreground" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleViewDetails(request)}>
                        <Eye className="w-4 h-4 mr-2" />
                        View Details
                      </DropdownMenuItem>
                      {request.status === "pending" && (
                        <DropdownMenuItem className="text-destructive">
                          Cancel Request
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
            Showing 1-6 of 234 requests
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

      {/* Request Details Sheet */}
      <Sheet open={detailsOpen} onOpenChange={setDetailsOpen}>
        <SheetContent className="sm:max-w-lg">
          <SheetHeader>
            <SheetTitle className="flex items-center gap-2">
              <FileSpreadsheet className="w-5 h-5 text-accent" />
              Request Details
            </SheetTitle>
            <SheetDescription>
              {selectedRequest?.batchNumber}
            </SheetDescription>
          </SheetHeader>
          
          {selectedRequest && (
            <div className="mt-6 space-y-6">
              {/* Status */}
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Status</span>
                <Badge className={statusConfig[selectedRequest.status].className}>
                  {statusConfig[selectedRequest.status].label}
                </Badge>
              </div>

              {/* Request Info */}
              <div className="space-y-4 p-4 rounded-xl bg-muted/50 border border-border">
                <h4 className="text-sm font-medium text-foreground">Request Information</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Request ID</p>
                    <p className="font-medium text-foreground">{selectedRequest.id}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Batch Number</p>
                    <p className="font-medium text-foreground">{selectedRequest.batchNumber}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Card Profile</p>
                    <p className="font-medium text-foreground">{selectedRequest.cardProfile}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Quantity</p>
                    <p className="font-medium text-foreground">{selectedRequest.quantity.toLocaleString()} cards</p>
                  </div>
                </div>
              </div>

              {/* Type */}
              <div className="flex items-center gap-3 p-4 rounded-xl border border-border">
                <div className="p-2 rounded-lg bg-accent/10">
                  <CreditCard className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Card Type</p>
                  <Badge className={typeConfig[selectedRequest.type].className}>
                    {typeConfig[selectedRequest.type].label}
                  </Badge>
                </div>
              </div>

              {/* Timeline */}
              <div className="space-y-4 p-4 rounded-xl bg-muted/50 border border-border">
                <h4 className="text-sm font-medium text-foreground">Timeline</h4>
                <div className="space-y-3 text-sm">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-accent mt-1.5" />
                    <div className="flex-1">
                      <p className="text-foreground">Request Created</p>
                      <p className="text-muted-foreground">{selectedRequest.createdAt} by {selectedRequest.requestedBy}</p>
                    </div>
                  </div>
                  {selectedRequest.approvedBy && (
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 rounded-full bg-success mt-1.5" />
                      <div className="flex-1">
                        <p className="text-foreground">Approved</p>
                        <p className="text-muted-foreground">{selectedRequest.approvedAt} by {selectedRequest.approvedBy}</p>
                      </div>
                    </div>
                  )}
                  {selectedRequest.status === "ready" && (
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 rounded-full bg-success mt-1.5" />
                      <div className="flex-1">
                        <p className="text-foreground">Ready for Issuance</p>
                        <p className="text-muted-foreground">Cards are ready to be collected</p>
                      </div>
                    </div>
                  )}
                  {selectedRequest.status === "failed" && (
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 rounded-full bg-destructive mt-1.5" />
                      <div className="flex-1">
                        <p className="text-foreground">Failed</p>
                        <p className="text-muted-foreground">Request encountered an issue</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Notes */}
              {selectedRequest.notes && (
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-foreground">Notes</h4>
                  <p className="text-sm text-muted-foreground p-3 rounded-lg bg-muted/50 border border-border">
                    {selectedRequest.notes}
                  </p>
                </div>
              )}
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
