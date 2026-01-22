import { useState } from "react";
import { Plus, MoreHorizontal, Edit, Trash2, Filter } from "lucide-react";
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
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  role: string;
  status: "Active" | "Inactive" | "Pending";
  createdAt: string;
}

const mockUsers: AdminUser[] = [
  {
    id: "1",
    firstName: "Wonderful",
    lastName: "Onwuchekwa",
    email: "wonderful@acmecorp.com",
    phoneNumber: "+234 801 234 5678",
    role: "Partner Admin",
    status: "Active",
    createdAt: "2024-01-01",
  },
  {
    id: "2",
    firstName: "Adebayo",
    lastName: "Johnson",
    email: "adebayo@acmecorp.com",
    phoneNumber: "+234 802 345 6789",
    role: "Support Agent",
    status: "Active",
    createdAt: "2024-01-15",
  },
  {
    id: "3",
    firstName: "Chioma",
    lastName: "Eze",
    email: "chioma@acmecorp.com",
    phoneNumber: "+234 803 456 7890",
    role: "Finance Officer",
    status: "Active",
    createdAt: "2024-02-01",
  },
  {
    id: "4",
    firstName: "Emeka",
    lastName: "Okonkwo",
    email: "emeka@acmecorp.com",
    phoneNumber: "+234 804 567 8901",
    role: "Support Agent",
    status: "Pending",
    createdAt: "2024-03-01",
  },
  {
    id: "5",
    firstName: "Fatima",
    lastName: "Abdullahi",
    email: "fatima@acmecorp.com",
    phoneNumber: "+234 805 678 9012",
    role: "Read-Only User",
    status: "Inactive",
    createdAt: "2023-11-15",
  },
];

const statusConfig: Record<string, { label: string; className: string }> = {
  Active: { label: "Active", className: "status-badge status-active" },
  Inactive: { label: "Inactive", className: "status-badge status-blocked" },
  Pending: { label: "Pending", className: "status-badge status-pending" },
};

export default function AdminUsers() {
  const { getRoleNames } = useRolesStore();
  const roleNames = getRoleNames();
  const [users, setUsers] = useState<AdminUser[]>(mockUsers);
  const [searchQuery, setSearchQuery] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<AdminUser | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [newUser, setNewUser] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    role: "",
  });
  const { toast } = useToast();

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      `${user.firstName} ${user.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || user.status === statusFilter;
    const matchesRole = roleFilter === "all" || user.role === roleFilter;
    return matchesSearch && matchesStatus && matchesRole;
  });

  const handleCreateUser = () => {
    if (!newUser.firstName || !newUser.lastName || !newUser.email || !newUser.phoneNumber || !newUser.role) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    const newUserData: AdminUser = {
      id: String(users.length + 1),
      firstName: newUser.firstName,
      lastName: newUser.lastName,
      email: newUser.email,
      phoneNumber: newUser.phoneNumber,
      role: newUser.role,
      status: "Active",
      createdAt: new Date().toISOString().split("T")[0],
    };

    setUsers([...users, newUserData]);
    setNewUser({ firstName: "", lastName: "", email: "", phoneNumber: "", role: "" });
    setDialogOpen(false);
    toast({
      title: "User Created",
      description: `${newUser.firstName} ${newUser.lastName} has been created successfully.`,
    });
  };

  const handleEditUser = (user: AdminUser) => {
    setEditingUser(user);
    setEditDialogOpen(true);
  };

  const handleSaveEdit = () => {
    if (!editingUser) return;
    
    setUsers(users.map(u => u.id === editingUser.id ? editingUser : u));
    setEditDialogOpen(false);
    toast({
      title: "User Updated",
      description: `${editingUser.firstName} ${editingUser.lastName} has been updated successfully.`,
    });
  };

  const handleDeactivateUser = (user: AdminUser) => {
    setUsers(users.map(u => u.id === user.id ? { ...u, status: "Inactive" as const } : u));
    toast({
      title: "User Deactivated",
      description: `${user.firstName} ${user.lastName} has been deactivated.`,
    });
  };

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
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    value={newUser.firstName}
                    onChange={(e) =>
                      setNewUser({ ...newUser, firstName: e.target.value })
                    }
                    placeholder="Enter first name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    value={newUser.lastName}
                    onChange={(e) =>
                      setNewUser({ ...newUser, lastName: e.target.value })
                    }
                    placeholder="Enter last name"
                  />
                </div>
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
                <Label htmlFor="phoneNumber">Phone Number</Label>
                <Input
                  id="phoneNumber"
                  type="tel"
                  value={newUser.phoneNumber}
                  onChange={(e) =>
                    setNewUser({ ...newUser, phoneNumber: e.target.value })
                  }
                  placeholder="+234 800 000 0000"
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

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Input
            placeholder="Search users..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-4"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-muted-foreground" />
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="Active">Active</SelectItem>
              <SelectItem value="Inactive">Inactive</SelectItem>
              <SelectItem value="Pending">Pending</SelectItem>
            </SelectContent>
          </Select>
          <Select value={roleFilter} onValueChange={setRoleFilter}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Roles</SelectItem>
              {roleNames.map((role) => (
                <SelectItem key={role} value={role}>
                  {role}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Users Table */}
      <div className="card-elevated">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Created</TableHead>
              <TableHead>First Name</TableHead>
              <TableHead>Last Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone Number</TableHead>
              <TableHead>Role</TableHead>
              <TableHead className="w-[100px]">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="text-muted-foreground">
                  {user.createdAt}
                </TableCell>
                <TableCell className="font-medium">
                  {user.firstName}
                </TableCell>
                <TableCell className="font-medium">
                  {user.lastName}
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {user.email}
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {user.phoneNumber}
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {user.role}
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleEditUser(user)}>
                        <Edit className="w-4 h-4 mr-2" />
                        Edit User
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem 
                        className="text-destructive"
                        onClick={() => handleDeactivateUser(user)}
                      >
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

      {/* Edit User Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription>
              Update user details
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="editFirstName">First Name</Label>
                <Input
                  id="editFirstName"
                  value={editingUser?.firstName || ""}
                  onChange={(e) =>
                    setEditingUser(prev => prev ? { ...prev, firstName: e.target.value } : null)
                  }
                  placeholder="Enter first name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="editLastName">Last Name</Label>
                <Input
                  id="editLastName"
                  value={editingUser?.lastName || ""}
                  onChange={(e) =>
                    setEditingUser(prev => prev ? { ...prev, lastName: e.target.value } : null)
                  }
                  placeholder="Enter last name"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="editPhoneNumber">Phone Number</Label>
              <Input
                id="editPhoneNumber"
                type="tel"
                value={editingUser?.phoneNumber || ""}
                onChange={(e) =>
                  setEditingUser(prev => prev ? { ...prev, phoneNumber: e.target.value } : null)
                }
                placeholder="+234 800 000 0000"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="editUserRole">Role</Label>
              <Select
                value={editingUser?.role || ""}
                onValueChange={(value) =>
                  setEditingUser(prev => prev ? { ...prev, role: value } : null)
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
            <div className="flex justify-end gap-3 pt-4">
              <Button
                variant="outline"
                onClick={() => setEditDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button className="btn-accent" onClick={handleSaveEdit}>
                Save Changes
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
