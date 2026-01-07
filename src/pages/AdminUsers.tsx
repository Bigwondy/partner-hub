import { useState } from "react";
import { Plus, MoreHorizontal, User, Edit, Trash2, Mail, Key } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { useRolesStore } from "@/stores/rolesStore";

interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: string;
  userType: "Admin" | "Regular";
  status: "Active" | "Inactive" | "Pending";
  lastLogin: string;
  createdAt: string;
}

const mockUsers: AdminUser[] = [
  {
    id: "1",
    name: "Wonderful Onwuchekwa",
    email: "wonderful@acmecorp.com",
    role: "Partner Admin",
    userType: "Admin",
    status: "Active",
    lastLogin: "2024-01-05 14:30",
    createdAt: "2024-01-01",
  },
  {
    id: "2",
    name: "Adebayo Johnson",
    email: "adebayo@acmecorp.com",
    role: "Support Agent",
    userType: "Regular",
    status: "Active",
    lastLogin: "2024-01-05 09:15",
    createdAt: "2024-01-15",
  },
  {
    id: "3",
    name: "Chioma Eze",
    email: "chioma@acmecorp.com",
    role: "Finance Officer",
    userType: "Regular",
    status: "Active",
    lastLogin: "2024-01-04 16:45",
    createdAt: "2024-02-01",
  },
  {
    id: "4",
    name: "Emeka Okonkwo",
    email: "emeka@acmecorp.com",
    role: "Support Agent",
    userType: "Regular",
    status: "Pending",
    lastLogin: "-",
    createdAt: "2024-03-01",
  },
  {
    id: "5",
    name: "Fatima Abdullahi",
    email: "fatima@acmecorp.com",
    role: "Read-Only User",
    userType: "Regular",
    status: "Inactive",
    lastLogin: "2023-12-20 11:00",
    createdAt: "2023-11-15",
  },
];

const statusConfig: Record<string, { label: string; className: string }> = {
  Active: { label: "Active", className: "status-badge status-active" },
  Inactive: { label: "Inactive", className: "status-badge status-blocked" },
  Pending: { label: "Pending", className: "status-badge status-pending" },
};

const userTypeConfig: Record<string, { label: string; className: string }> = {
  Admin: { label: "Admin", className: "bg-primary/10 text-primary" },
  Regular: { label: "Regular", className: "bg-muted text-muted-foreground" },
};

export default function AdminUsers() {
  const { getRoleNames } = useRolesStore();
  const roleNames = getRoleNames();
  const [users, setUsers] = useState<AdminUser[]>(mockUsers);
  const [searchQuery, setSearchQuery] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    role: "",
    userType: "Regular" as "Admin" | "Regular",
  });
  const { toast } = useToast();

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreateUser = () => {
    if (!newUser.name || !newUser.email || !newUser.role) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    const user: AdminUser = {
      id: String(users.length + 1),
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      userType: newUser.userType,
      status: "Pending",
      lastLogin: "-",
      createdAt: new Date().toISOString().split("T")[0],
    };

    setUsers([...users, user]);
    setNewUser({ name: "", email: "", role: "", userType: "Regular" });
    setDialogOpen(false);
    toast({
      title: "User Created",
      description: `An invitation has been sent to ${user.email}`,
    });
  };

  const roleStats = roleNames.map((role) => ({
    role,
    count: users.filter((u) => u.role === role).length,
  }));

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="page-header flex items-center justify-between">
        <div>
          <h1 className="page-title">Users</h1>
          <p className="page-description">Manage users and their access</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="btn-accent">
              <Plus className="w-4 h-4" />
              Add User
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New User</DialogTitle>
              <DialogDescription>
                Create a new user and assign their role
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="userName">Full Name</Label>
                <Input
                  id="userName"
                  value={newUser.name}
                  onChange={(e) =>
                    setNewUser({ ...newUser, name: e.target.value })
                  }
                  placeholder="Enter full name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="userEmail">Email Address</Label>
                <Input
                  id="userEmail"
                  type="email"
                  value={newUser.email}
                  onChange={(e) =>
                    setNewUser({ ...newUser, email: e.target.value })
                  }
                  placeholder="Enter email address"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="userRole">Role</Label>
                <Select
                  value={newUser.role}
                  onValueChange={(value) =>
                    setNewUser({ ...newUser, role: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                  <SelectContent>
                    {roleNames.map((role) => (
                      <SelectItem key={role} value={role}>
                        {role}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="userType">User Type</Label>
                <Select
                  value={newUser.userType}
                  onValueChange={(value: "Admin" | "Regular") =>
                    setNewUser({ ...newUser, userType: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Admin">Admin</SelectItem>
                    <SelectItem value="Regular">Regular</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  Admin users can edit system configurations
                </p>
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <Button
                  variant="outline"
                  onClick={() => setDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button className="btn-accent" onClick={handleCreateUser}>
                  Create User
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Role Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {roleStats.map((stat) => (
          <div key={stat.role} className="metric-card">
            <p className="text-sm font-medium text-muted-foreground">
              {stat.role}
            </p>
            <p className="text-2xl font-bold text-foreground mt-1">
              {stat.count}
            </p>
          </div>
        ))}
      </div>

      {/* Search */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Input
            placeholder="Search users..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-4"
          />
        </div>
      </div>

      {/* Users Table */}
      <div className="card-elevated">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Last Login</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.map((user) => (
              <TableRow key={user.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center">
                      <span className="text-sm font-semibold text-accent">
                        {user.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium">{user.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {user.role}
                </TableCell>
                <TableCell>
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      userTypeConfig[user.userType].className
                    }`}
                  >
                    {user.userType}
                  </span>
                </TableCell>
                <TableCell>
                  <span className={statusConfig[user.status].className}>
                    {statusConfig[user.status].label}
                  </span>
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {user.lastLogin}
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {user.createdAt}
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Edit className="w-4 h-4 mr-2" />
                        Edit User
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Mail className="w-4 h-4 mr-2" />
                        Resend Invite
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Key className="w-4 h-4 mr-2" />
                        Reset Password
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-destructive">
                        <Trash2 className="w-4 h-4 mr-2" />
                        Deactivate User
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
