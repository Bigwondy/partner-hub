import { useState } from "react";
import { Plus, Search, MoreHorizontal, Shield, Mail, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
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

const users = [
  {
    id: "USR-001",
    name: "John Doe",
    email: "john.doe@acmecorp.com",
    role: "admin",
    status: "active",
    lastLogin: "2024-01-05 14:32",
    createdAt: "2023-06-15",
  },
  {
    id: "USR-002",
    name: "Sarah Williams",
    email: "sarah.w@acmecorp.com",
    role: "support",
    status: "active",
    lastLogin: "2024-01-05 11:15",
    createdAt: "2023-08-20",
  },
  {
    id: "USR-003",
    name: "Michael Chen",
    email: "m.chen@acmecorp.com",
    role: "finance",
    status: "active",
    lastLogin: "2024-01-04 16:48",
    createdAt: "2023-09-01",
  },
  {
    id: "USR-004",
    name: "Amina Yusuf",
    email: "a.yusuf@acmecorp.com",
    role: "readonly",
    status: "inactive",
    lastLogin: "2023-12-20 09:22",
    createdAt: "2023-10-10",
  },
];

const roleConfig: Record<string, { label: string; className: string }> = {
  admin: { label: "Admin", className: "bg-accent/10 text-accent" },
  support: { label: "Support Agent", className: "bg-info/10 text-info" },
  finance: { label: "Finance", className: "bg-success/10 text-success" },
  readonly: { label: "Read Only", className: "bg-muted text-muted-foreground" },
};

const statusConfig: Record<string, { label: string; className: string }> = {
  active: { label: "Active", className: "status-active" },
  inactive: { label: "Inactive", className: "status-paused" },
  pending: { label: "Pending", className: "status-pending" },
};

export default function Users() {
  const [searchQuery, setSearchQuery] = useState("");
  const [inviteDialogOpen, setInviteDialogOpen] = useState(false);
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    role: "",
  });

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div className="page-header mb-0">
          <h1 className="page-title">User Management</h1>
          <p className="page-description">
            Manage team access and permissions
          </p>
        </div>
        <button onClick={() => setInviteDialogOpen(true)} className="btn-accent">
          <Plus className="w-4 h-4" />
          Invite User
        </button>
      </div>

      {/* Role Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-accent/10 border border-accent/20">
          <p className="text-2xl font-bold text-accent">2</p>
          <p className="text-sm text-accent/80">Admins</p>
        </div>
        <div className="p-4 rounded-xl bg-info/10 border border-info/20">
          <p className="text-2xl font-bold text-info">5</p>
          <p className="text-sm text-info/80">Support Agents</p>
        </div>
        <div className="p-4 rounded-xl bg-success/10 border border-success/20">
          <p className="text-2xl font-bold text-success">3</p>
          <p className="text-sm text-success/80">Finance</p>
        </div>
        <div className="p-4 rounded-xl bg-muted border border-border">
          <p className="text-2xl font-bold text-muted-foreground">4</p>
          <p className="text-sm text-muted-foreground">Read Only</p>
        </div>
      </div>

      {/* Search */}
      <div className="card-elevated p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input-field pl-10"
          />
        </div>
      </div>

      {/* Users Table */}
      <div className="card-elevated overflow-hidden">
        <table className="data-table">
          <thead>
            <tr>
              <th>User</th>
              <th>Role</th>
              <th>Status</th>
              <th>Last Login</th>
              <th>Created</th>
              <th className="w-16"></th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center">
                      <span className="text-xs font-medium text-primary-foreground">
                        {user.name.split(" ").map((n) => n[0]).join("")}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{user.name}</p>
                      <p className="text-xs text-muted-foreground">{user.email}</p>
                    </div>
                  </div>
                </td>
                <td>
                  <Badge className={roleConfig[user.role].className}>
                    {roleConfig[user.role].label}
                  </Badge>
                </td>
                <td>
                  <Badge className={statusConfig[user.status].className}>
                    {statusConfig[user.status].label}
                  </Badge>
                </td>
                <td className="text-sm text-muted-foreground">{user.lastLogin}</td>
                <td className="text-sm text-muted-foreground">{user.createdAt}</td>
                <td>
                  <DropdownMenu>
                    <DropdownMenuTrigger className="p-2 hover:bg-muted rounded-lg">
                      <MoreHorizontal className="w-4 h-4 text-muted-foreground" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Shield className="w-4 h-4 mr-2" />
                        Change Role
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Mail className="w-4 h-4 mr-2" />
                        Resend Invite
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive">
                        Deactivate User
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Invite User Dialog */}
      <Dialog open={inviteDialogOpen} onOpenChange={setInviteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Invite New User</DialogTitle>
            <DialogDescription>
              Send an invitation to join the partner portal
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Full Name
              </label>
              <input
                type="text"
                placeholder="Enter full name"
                value={newUser.name}
                onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Email Address
              </label>
              <input
                type="email"
                placeholder="user@company.com"
                value={newUser.email}
                onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Role
              </label>
              <select
                value={newUser.role}
                onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                className="input-field"
              >
                <option value="">Select a role</option>
                <option value="admin">Admin</option>
                <option value="support">Support Agent</option>
                <option value="finance">Finance</option>
                <option value="readonly">Read Only</option>
              </select>
            </div>
          </div>
          <DialogFooter>
            <button className="btn-secondary" onClick={() => setInviteDialogOpen(false)}>
              Cancel
            </button>
            <button className="btn-accent" onClick={() => setInviteDialogOpen(false)}>
              <Mail className="w-4 h-4" />
              Send Invitation
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
