import { useState } from "react";
import { Plus, Search, Filter, Download, Eye, MoreHorizontal, FileSpreadsheet, CreditCard, X } from "lucide-react";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

const requests = [
  {
    id: "REQ-2024-001234",
    batchNumber: "BATCH-2024-0089",
    cardProfile: "Visa Gold",
    quantity: 100,
    type: "embossed",
    category: "physical",
    status: "in_progress",
    createdAt: "2024-01-05 14:32",
    requestedBy: "Sarah Williams",
    notes: "Urgent order for new branch opening",
  },
  {
    id: "REQ-2024-001233",
    batchNumber: "BATCH-2024-0088",
    cardProfile: "Mastercard Platinum",
    quantity: 50,
    type: "embossed",
    category: "physical",
    status: "completed",
    createdAt: "2024-01-05 11:15",
    requestedBy: "John Doe",
    notes: "Premium cards for VIP customers",
  },
  {
    id: "REQ-2024-001232",
    batchNumber: "BATCH-2024-0087",
    cardProfile: "Verve Standard",
    quantity: 200,
    type: "instant",
    category: "physical",
    status: "received",
    createdAt: "2024-01-04 16:48",
    requestedBy: "Sarah Williams",
    notes: "Stock replenishment for Lagos branches",
  },
  {
    id: "REQ-2024-001231",
    batchNumber: "BATCH-2024-0086",
    cardProfile: "Visa Classic",
    quantity: 25,
    type: "virtual",
    category: "virtual",
    status: "completed",
    createdAt: "2024-01-04 09:22",
    requestedBy: "John Doe",
    notes: "Virtual cards for corporate clients",
  },
  {
    id: "REQ-2024-001230",
    batchNumber: "BATCH-2024-0085",
    cardProfile: "Mastercard Standard",
    quantity: 150,
    type: "embossed",
    category: "physical",
    status: "in_progress",
    createdAt: "2024-01-03 13:05",
    requestedBy: "Sarah Williams",
    notes: "Processing for delivery",
  },
  {
    id: "REQ-2024-001229",
    batchNumber: "BATCH-2024-0084",
    cardProfile: "Visa Gold",
    quantity: 75,
    type: "instant",
    category: "physical",
    status: "in_progress",
    createdAt: "2024-01-03 10:41",
    requestedBy: "John Doe",
    notes: "Regular stock order",
  },
  {
    id: "REQ-2024-001228",
    batchNumber: "BATCH-2024-0083",
    cardProfile: "Virtual Business",
    quantity: 500,
    type: "virtual",
    category: "virtual",
    status: "completed",
    createdAt: "2024-01-02 14:00",
    requestedBy: "Sarah Williams",
    notes: "Virtual cards for SME program",
  },
];

const statusConfig: Record<string, { label: string; className: string }> = {
  received: { label: "Received", className: "bg-muted text-muted-foreground" },
  in_progress: { label: "In Progress", className: "bg-warning/10 text-warning" },
  completed: { label: "Completed", className: "bg-success/10 text-success" },
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
  const [filterOpen, setFilterOpen] = useState(false);
  const [filters, setFilters] = useState({
    status: "all",
    type: "all",
    cardProfile: "all",
  });

  const handleViewDetails = (request: typeof requests[0]) => {
    setSelectedRequest(request);
    setDetailsOpen(true);
  };

  const applyFilters = (data: typeof requests, category: string) => {
    return data.filter((request) => {
      const matchesCategory = category === "all" || request.category === category;
      const matchesSearch = 
        request.batchNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        request.cardProfile.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = filters.status === "all" || request.status === filters.status;
      const matchesType = filters.type === "all" || request.type === filters.type;
      const matchesProfile = filters.cardProfile === "all" || request.cardProfile === filters.cardProfile;
      
      return matchesCategory && matchesSearch && matchesStatus && matchesType && matchesProfile;
    });
  };

  const clearFilters = () => {
    setFilters({ status: "all", type: "all", cardProfile: "all" });
  };

  const hasActiveFilters = filters.status !== "all" || filters.type !== "all" || filters.cardProfile !== "all";

  const physicalRequests = applyFilters(requests, "physical");
  const virtualRequests = applyFilters(requests, "virtual");
  const allFiltered = applyFilters(requests, "all");

  const uniqueProfiles = [...new Set(requests.map(r => r.cardProfile))];

  const RequestsTable = ({ data }: { data: typeof requests }) => (
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
          {data.map((request) => (
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
          Showing 1-{data.length} of {data.length} requests
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
  );

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
            <Popover open={filterOpen} onOpenChange={setFilterOpen}>
              <PopoverTrigger asChild>
                <button className={`btn-secondary ${hasActiveFilters ? 'ring-2 ring-accent' : ''}`}>
                  <Filter className="w-4 h-4" />
                  Filters
                  {hasActiveFilters && (
                    <span className="ml-1 w-2 h-2 rounded-full bg-accent" />
                  )}
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-80" align="end">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">Filters</h4>
                    {hasActiveFilters && (
                      <Button variant="ghost" size="sm" onClick={clearFilters}>
                        <X className="w-3 h-3 mr-1" />
                        Clear
                      </Button>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label>Status</Label>
                    <Select value={filters.status} onValueChange={(value) => setFilters({ ...filters, status: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="All statuses" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Statuses</SelectItem>
                        <SelectItem value="received">Received</SelectItem>
                        <SelectItem value="in_progress">In Progress</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Type</Label>
                    <Select value={filters.type} onValueChange={(value) => setFilters({ ...filters, type: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="All types" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Types</SelectItem>
                        <SelectItem value="instant">Instant</SelectItem>
                        <SelectItem value="embossed">Embossed</SelectItem>
                        <SelectItem value="virtual">Virtual</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Card Profile</Label>
                    <Select value={filters.cardProfile} onValueChange={(value) => setFilters({ ...filters, cardProfile: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="All profiles" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Profiles</SelectItem>
                        {uniqueProfiles.map((profile) => (
                          <SelectItem key={profile} value={profile}>{profile}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
            <button className="btn-secondary">
              <Download className="w-4 h-4" />
              Export
            </button>
          </div>
        </div>
      </div>

      {/* Tabs for Physical and Virtual Cards */}
      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All Requests ({allFiltered.length})</TabsTrigger>
          <TabsTrigger value="physical">Physical Cards ({physicalRequests.length})</TabsTrigger>
          <TabsTrigger value="virtual">Virtual Cards ({virtualRequests.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <RequestsTable data={allFiltered} />
        </TabsContent>

        <TabsContent value="physical">
          <RequestsTable data={physicalRequests} />
        </TabsContent>

        <TabsContent value="virtual">
          <RequestsTable data={virtualRequests} />
        </TabsContent>
      </Tabs>

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
                  {selectedRequest.status === "completed" && (
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 rounded-full bg-success mt-1.5" />
                      <div className="flex-1">
                        <p className="text-foreground">Completed</p>
                        <p className="text-muted-foreground">Cards are ready to be collected</p>
                      </div>
                    </div>
                  )}
                  {selectedRequest.status === "in_progress" && (
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 rounded-full bg-warning mt-1.5" />
                      <div className="flex-1">
                        <p className="text-foreground">In Progress</p>
                        <p className="text-muted-foreground">Request is being processed</p>
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
