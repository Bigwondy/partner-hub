import { useState } from "react";
import { Plus, Search, Filter, Download, Eye, MoreHorizontal, MessageSquare, Paperclip } from "lucide-react";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const disputes = [
  {
    id: "DSP-2024-000891",
    transactionId: "TXN-20240105-89432",
    customerName: "Adebayo Johnson",
    cardMasked: "****4532",
    amount: 45000,
    reason: "Unauthorized Transaction",
    status: "under_investigation",
    createdAt: "2024-01-05 14:32",
    expectedResolution: "2024-01-19",
    hasNewComments: true,
  },
  {
    id: "DSP-2024-000890",
    transactionId: "TXN-20240104-78123",
    customerName: "Chioma Okafor",
    cardMasked: "****8921",
    amount: 125000,
    reason: "Duplicate Charge",
    status: "pending_documents",
    createdAt: "2024-01-04 11:15",
    expectedResolution: "2024-01-18",
    hasNewComments: false,
  },
  {
    id: "DSP-2024-000889",
    transactionId: "TXN-20240103-65890",
    customerName: "Emmanuel Nnamdi",
    cardMasked: "****1287",
    amount: 89000,
    reason: "Goods Not Received",
    status: "resolved_favor",
    createdAt: "2024-01-03 16:48",
    expectedResolution: null,
    hasNewComments: false,
  },
  {
    id: "DSP-2024-000888",
    transactionId: "TXN-20240102-45678",
    customerName: "Fatima Abdullahi",
    cardMasked: "****6754",
    amount: 32000,
    reason: "Service Not Rendered",
    status: "submitted",
    createdAt: "2024-01-02 09:22",
    expectedResolution: "2024-01-16",
    hasNewComments: false,
  },
  {
    id: "DSP-2024-000887",
    transactionId: "TXN-20240101-34521",
    customerName: "Oluwaseun Bakare",
    cardMasked: "****3398",
    amount: 250000,
    reason: "Fraudulent Transaction",
    status: "resolved_declined",
    createdAt: "2024-01-01 13:05",
    expectedResolution: null,
    hasNewComments: false,
  },
];

const statusConfig: Record<string, { label: string; className: string }> = {
  submitted: { label: "Submitted", className: "bg-muted text-muted-foreground" },
  under_investigation: { label: "Under Investigation", className: "bg-info/10 text-info" },
  pending_documents: { label: "Pending Documents", className: "bg-warning/10 text-warning" },
  resolved_favor: { label: "Resolved - Customer Favor", className: "bg-success/10 text-success" },
  resolved_declined: { label: "Declined", className: "bg-destructive/10 text-destructive" },
};

export default function Disputes() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div className="page-header mb-0">
          <h1 className="page-title">Disputes</h1>
          <p className="page-description">
            Raise and track transaction disputes
          </p>
        </div>
        <Link to="/disputes/new" className="btn-accent">
          <Plus className="w-4 h-4" />
          Raise Dispute
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-info/10 border border-info/20">
          <p className="text-2xl font-bold text-info">4</p>
          <p className="text-sm text-info/80">Under Investigation</p>
        </div>
        <div className="p-4 rounded-xl bg-warning/10 border border-warning/20">
          <p className="text-2xl font-bold text-warning">2</p>
          <p className="text-sm text-warning/80">Pending Documents</p>
        </div>
        <div className="p-4 rounded-xl bg-success/10 border border-success/20">
          <p className="text-2xl font-bold text-success">45</p>
          <p className="text-sm text-success/80">Resolved This Month</p>
        </div>
        <div className="p-4 rounded-xl bg-muted border border-border">
          <p className="text-2xl font-bold text-foreground">₦2.4M</p>
          <p className="text-sm text-muted-foreground">Total Disputed Value</p>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="card-elevated p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search by dispute ID, customer, or transaction..."
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

      {/* Disputes Table */}
      <div className="card-elevated overflow-hidden">
        <table className="data-table">
          <thead>
            <tr>
              <th>Dispute ID</th>
              <th>Customer</th>
              <th>Amount</th>
              <th>Reason</th>
              <th>Status</th>
              <th>Created</th>
              <th>Resolution Date</th>
              <th className="w-16"></th>
            </tr>
          </thead>
          <tbody>
            {disputes.map((dispute) => (
              <tr key={dispute.id}>
                <td>
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-foreground">{dispute.id}</span>
                    {dispute.hasNewComments && (
                      <span className="w-2 h-2 bg-accent rounded-full"></span>
                    )}
                  </div>
                </td>
                <td>
                  <div>
                    <p className="font-medium text-foreground">{dispute.customerName}</p>
                    <p className="text-xs text-muted-foreground font-mono">{dispute.cardMasked}</p>
                  </div>
                </td>
                <td className="font-medium text-foreground">
                  ₦{dispute.amount.toLocaleString()}
                </td>
                <td className="text-muted-foreground">{dispute.reason}</td>
                <td>
                  <Badge className={statusConfig[dispute.status].className}>
                    {statusConfig[dispute.status].label}
                  </Badge>
                </td>
                <td className="text-muted-foreground text-sm">{dispute.createdAt}</td>
                <td className="text-muted-foreground text-sm">
                  {dispute.expectedResolution || "—"}
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
                      <DropdownMenuItem>
                        <MessageSquare className="w-4 h-4 mr-2" />
                        Add Comment
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Paperclip className="w-4 h-4 mr-2" />
                        Upload Documents
                      </DropdownMenuItem>
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
            Showing 1-5 of 156 disputes
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
