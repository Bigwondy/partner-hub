import { useState } from "react";
import { Plus, Search, Filter, Download, Eye, MoreHorizontal } from "lucide-react";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const requests = [
  {
    id: "REQ-2024-001234",
    batchNumber: "BATCH-2024-0089",
    cardProfile: "Visa Gold",
    quantity: 100,
    type: "embossed",
    status: "in_progress",
    createdAt: "2024-01-05 14:32",
  },
  {
    id: "REQ-2024-001233",
    batchNumber: "BATCH-2024-0088",
    cardProfile: "Mastercard Platinum",
    quantity: 50,
    type: "embossed",
    status: "ready",
    createdAt: "2024-01-05 11:15",
  },
  {
    id: "REQ-2024-001232",
    batchNumber: "BATCH-2024-0087",
    cardProfile: "Verve Standard",
    quantity: 200,
    type: "instant",
    status: "pending",
    createdAt: "2024-01-04 16:48",
  },
  {
    id: "REQ-2024-001231",
    batchNumber: "BATCH-2024-0086",
    cardProfile: "Visa Classic",
    quantity: 25,
    type: "virtual",
    status: "ready",
    createdAt: "2024-01-04 09:22",
  },
  {
    id: "REQ-2024-001230",
    batchNumber: "BATCH-2024-0085",
    cardProfile: "Mastercard Standard",
    quantity: 150,
    type: "embossed",
    status: "failed",
    createdAt: "2024-01-03 13:05",
  },
  {
    id: "REQ-2024-001229",
    batchNumber: "BATCH-2024-0084",
    cardProfile: "Visa Gold",
    quantity: 75,
    type: "instant",
    status: "in_progress",
    createdAt: "2024-01-03 10:41",
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
                      <DropdownMenuItem>
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
    </div>
  );
}
