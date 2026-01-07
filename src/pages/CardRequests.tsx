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
    customerName: "Adebayo Johnson",
    customerId: "CUS-0045321",
    cardType: "Visa Debit",
    quantity: 1,
    status: "approved",
    requestedBy: "Sarah Williams",
    createdAt: "2024-01-05 14:32",
  },
  {
    id: "REQ-2024-001233",
    customerName: "Chioma Okafor",
    customerId: "CUS-0045320",
    cardType: "Mastercard Prepaid",
    quantity: 1,
    status: "in_production",
    requestedBy: "John Doe",
    createdAt: "2024-01-05 11:15",
  },
  {
    id: "REQ-2024-001232",
    customerName: "Emmanuel Nnamdi",
    customerId: "CUS-0045319",
    cardType: "Visa Debit",
    quantity: 5,
    status: "under_review",
    requestedBy: "Sarah Williams",
    createdAt: "2024-01-04 16:48",
  },
  {
    id: "REQ-2024-001231",
    customerName: "Fatima Abdullahi",
    customerId: "CUS-0045318",
    cardType: "Visa Debit",
    quantity: 1,
    status: "ready",
    requestedBy: "John Doe",
    createdAt: "2024-01-04 09:22",
  },
  {
    id: "REQ-2024-001230",
    customerName: "Oluwaseun Bakare",
    customerId: "CUS-0045317",
    cardType: "Mastercard Prepaid",
    quantity: 1,
    status: "collected",
    requestedBy: "Sarah Williams",
    createdAt: "2024-01-03 13:05",
  },
  {
    id: "REQ-2024-001229",
    customerName: "Ngozi Eze",
    customerId: "CUS-0045316",
    cardType: "Visa Debit",
    quantity: 1,
    status: "rejected",
    requestedBy: "John Doe",
    createdAt: "2024-01-03 10:41",
  },
];

const statusConfig: Record<string, { label: string; className: string }> = {
  submitted: { label: "Submitted", className: "bg-muted text-muted-foreground" },
  under_review: { label: "Under Review", className: "bg-info/10 text-info" },
  approved: { label: "Approved", className: "bg-success/10 text-success" },
  in_production: { label: "In Production", className: "bg-warning/10 text-warning" },
  ready: { label: "Ready", className: "bg-accent/10 text-accent" },
  collected: { label: "Collected", className: "bg-muted text-muted-foreground" },
  rejected: { label: "Rejected", className: "bg-destructive/10 text-destructive" },
  cancelled: { label: "Cancelled", className: "bg-muted text-muted-foreground" },
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
              placeholder="Search by request ID, customer name, or ID..."
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
              <th>Request ID</th>
              <th>Customer</th>
              <th>Card Type</th>
              <th>Qty</th>
              <th>Status</th>
              <th>Requested By</th>
              <th>Date</th>
              <th className="w-16"></th>
            </tr>
          </thead>
          <tbody>
            {requests.map((request) => (
              <tr key={request.id}>
                <td>
                  <span className="font-medium text-foreground">{request.id}</span>
                </td>
                <td>
                  <div>
                    <p className="font-medium text-foreground">{request.customerName}</p>
                    <p className="text-xs text-muted-foreground">{request.customerId}</p>
                  </div>
                </td>
                <td className="text-muted-foreground">{request.cardType}</td>
                <td className="text-muted-foreground">{request.quantity}</td>
                <td>
                  <Badge className={statusConfig[request.status].className}>
                    {statusConfig[request.status].label}
                  </Badge>
                </td>
                <td className="text-muted-foreground">{request.requestedBy}</td>
                <td className="text-muted-foreground text-sm">{request.createdAt}</td>
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
                      {request.status === "submitted" && (
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
