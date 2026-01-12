import { useState } from "react";
import { Plus, MoreHorizontal, Shield, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useRolesStore } from "@/stores/rolesStore";

type PermissionLevel = "none" | "view" | "create" | "edit" | "delete" | "full";

interface ModulePermission {
  module: string;
  label: string;
  permission: PermissionLevel;
}

const modulesList = [
  { id: "dashboard", label: "Dashboard" },
  { id: "cards", label: "Cards" },
  { id: "requests", label: "Card Requests" },
  { id: "disputes", label: "Disputes" },
  { id: "reports", label: "Reports" },
  { id: "setup", label: "Setup" },
  { id: "admin.users", label: "Admin - Users" },
  { id: "admin.roles", label: "Admin - Roles" },
];

const permissionLevels: { value: PermissionLevel; label: string }[] = [
  { value: "none", label: "None" },
  { value: "view", label: "View" },
  { value: "create", label: "Create" },
  { value: "edit", label: "Edit" },
  { value: "delete", label: "Delete" },
  { value: "full", label: "Full Access" },
];

const getPrivilegesFromPermissions = (permissions: ModulePermission[]): string[] => {
  const privileges: string[] = [];
  
  permissions.forEach(({ module, permission }) => {
    if (permission === "none") return;
    
    if (permission === "full") {
      privileges.push(`${module}.view`, `${module}.create`, `${module}.edit`, `${module}.delete`);
    } else {
      privileges.push(`${module}.${permission}`);
      // View is always included if any permission is granted
      if (permission !== "view") {
        privileges.push(`${module}.view`);
      }
    }
  });
  
  return [...new Set(privileges)]; // Remove duplicates
};

export default function AdminRoles() {
  const { roles, addRole, deleteRole } = useRolesStore();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newRole, setNewRole] = useState({
    name: "",
    description: "",
  });
  const [modulePermissions, setModulePermissions] = useState<ModulePermission[]>(
    modulesList.map((m) => ({ module: m.id, label: m.label, permission: "none" as PermissionLevel }))
  );
  const { toast } = useToast();

  const handlePermissionChange = (moduleId: string, permission: PermissionLevel) => {
    setModulePermissions((prev) =>
      prev.map((mp) => (mp.module === moduleId ? { ...mp, permission } : mp))
    );
  };

  const handleCreateRole = () => {
    if (!newRole.name) {
      toast({
        title: "Error",
        description: "Please enter a role name",
        variant: "destructive",
      });
      return;
    }

    const privileges = getPrivilegesFromPermissions(modulePermissions);
    
    if (privileges.length === 0) {
      toast({
        title: "Error",
        description: "Please assign at least one permission",
        variant: "destructive",
      });
      return;
    }

    addRole({
      name: newRole.name,
      description: newRole.description,
      privileges,
    });

    setNewRole({ name: "", description: "" });
    setModulePermissions(modulesList.map((m) => ({ module: m.id, label: m.label, permission: "none" as PermissionLevel })));
    setDialogOpen(false);
    toast({
      title: "Role Created",
      description: `${newRole.name} role has been created successfully.`,
    });
  };

  const handleDeleteRole = (id: string, name: string) => {
    deleteRole(id);
    toast({
      title: "Role Deleted",
      description: `${name} role has been deleted.`,
    });
  };

  const formatPrivilege = (privilege: string): string => {
    if (privilege === "all") return "Full Access";
    const parts = privilege.split(".");
    return parts.map(p => p.charAt(0).toUpperCase() + p.slice(1).replace("_", " ")).join(" - ");
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="page-header flex items-center justify-between">
        <div>
          <h1 className="page-title">Roles</h1>
          <p className="page-description">Manage roles and their permissions</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="btn-accent">
              <Plus className="w-4 h-4" />
              Add Role
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create New Role</DialogTitle>
              <DialogDescription>
                Define a new role with specific permissions for each module
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-6 py-4">
              <div className="space-y-2">
                <Label htmlFor="roleName">Role Name</Label>
                <Input
                  id="roleName"
                  value={newRole.name}
                  onChange={(e) => setNewRole({ ...newRole, name: e.target.value })}
                  placeholder="e.g., Operations Manager"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="roleDescription">Description</Label>
                <Textarea
                  id="roleDescription"
                  value={newRole.description}
                  onChange={(e) => setNewRole({ ...newRole, description: e.target.value })}
                  placeholder="Describe the role's responsibilities..."
                  rows={2}
                />
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label className="text-base font-medium">Module Permissions</Label>
                  <p className="text-xs text-muted-foreground">
                    Assign permission level for each module
                  </p>
                </div>
                <div className="border rounded-lg divide-y">
                  {modulePermissions.map((mp) => (
                    <div key={mp.module} className="flex items-center justify-between p-3">
                      <div className="flex items-center gap-3">
                        <Shield className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm font-medium">{mp.label}</span>
                      </div>
                      <Select
                        value={mp.permission}
                        onValueChange={(value: PermissionLevel) =>
                          handlePermissionChange(mp.module, value)
                        }
                      >
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {permissionLevels.map((level) => (
                            <SelectItem key={level.value} value={level.value}>
                              {level.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t">
                <Button variant="outline" onClick={() => setDialogOpen(false)}>
                  Cancel
                </Button>
                <Button className="btn-accent" onClick={handleCreateRole}>
                  Create Role
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="metric-card">
          <p className="text-sm font-medium text-muted-foreground">Total Roles</p>
          <p className="text-2xl font-bold text-foreground mt-1">{roles.length}</p>
        </div>
        <div className="metric-card">
          <p className="text-sm font-medium text-muted-foreground">Total Users</p>
          <p className="text-2xl font-bold text-foreground mt-1">
            {roles.reduce((acc, role) => acc + role.usersCount, 0)}
          </p>
        </div>
        <div className="metric-card">
          <p className="text-sm font-medium text-muted-foreground">Admin Roles</p>
          <p className="text-2xl font-bold text-foreground mt-1">
            {roles.filter((r) => r.privileges.includes("all") || r.privileges.some(p => p.startsWith("admin"))).length}
          </p>
        </div>
        <div className="metric-card">
          <p className="text-sm font-medium text-muted-foreground">Custom Roles</p>
          <p className="text-2xl font-bold text-foreground mt-1">
            {roles.filter((r) => !r.privileges.includes("all")).length}
          </p>
        </div>
      </div>

      {/* Roles Table */}
      <div className="card-elevated">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Role Name</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Privileges</TableHead>
              <TableHead>Users</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {roles.map((role) => (
              <TableRow key={role.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center">
                      <Shield className="w-5 h-5 text-accent" />
                    </div>
                    <span className="font-medium">{role.name}</span>
                  </div>
                </TableCell>
                <TableCell className="text-muted-foreground max-w-xs truncate">
                  {role.description}
                </TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {role.privileges.slice(0, 3).map((priv) => (
                      <span
                        key={priv}
                        className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-muted text-muted-foreground"
                      >
                        {formatPrivilege(priv)}
                      </span>
                    ))}
                    {role.privileges.length > 3 && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-muted text-muted-foreground">
                        +{role.privileges.length - 3} more
                      </span>
                    )}
                  </div>
                </TableCell>
                <TableCell className="text-muted-foreground">{role.usersCount}</TableCell>
                <TableCell className="text-muted-foreground">{role.createdAt}</TableCell>
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
                        Edit Role
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-destructive"
                        onClick={() => handleDeleteRole(role.id, role.name)}
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete Role
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
