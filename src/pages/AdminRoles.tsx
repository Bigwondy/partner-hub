import { useState } from "react";
import { Plus, MoreHorizontal, Shield, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
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
import { useToast } from "@/hooks/use-toast";
import { useRolesStore } from "@/stores/rolesStore";

const privilegeCategories = [
  {
    name: "Dashboard",
    privileges: ["dashboard.view", "dashboard.export"],
  },
  {
    name: "Card Management",
    privileges: ["cards.view", "cards.create", "cards.edit", "cards.block", "cards.activate", "cards.hotlist", "cards.reissue", "cards.pin_reset"],
  },
  {
    name: "Card Requests",
    privileges: ["requests.view", "requests.create", "requests.approve", "requests.reject", "requests.cancel"],
  },
  {
    name: "Disputes",
    privileges: ["disputes.view", "disputes.create", "disputes.resolve", "disputes.escalate"],
  },
  {
    name: "Approvals",
    privileges: ["approvals.view", "approvals.approve", "approvals.reject", "approvals.escalate"],
  },
  {
    name: "Reports",
    privileges: ["reports.view", "reports.export", "reports.settlements", "reports.transactions"],
  },
  {
    name: "Fee Configuration",
    privileges: ["fees.view", "fees.edit", "fees.request_change"],
  },
  {
    name: "User Management",
    privileges: ["admin.users.view", "admin.users.create", "admin.users.edit", "admin.users.deactivate"],
  },
  {
    name: "Role Management",
    privileges: ["admin.roles.view", "admin.roles.create", "admin.roles.edit", "admin.roles.delete"],
  },
];

export default function AdminRoles() {
  const { roles, addRole } = useRolesStore();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newRole, setNewRole] = useState({
    name: "",
    description: "",
    privileges: [] as string[],
  });
  const { toast } = useToast();

  const handlePrivilegeChange = (privilege: string, checked: boolean) => {
    setNewRole((prev) => ({
      ...prev,
      privileges: checked
        ? [...prev.privileges, privilege]
        : prev.privileges.filter((p) => p !== privilege),
    }));
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

    const role = addRole({
      name: newRole.name,
      description: newRole.description,
      privileges: newRole.privileges,
    });

    setNewRole({ name: "", description: "", privileges: [] });
    setDialogOpen(false);
    toast({
      title: "Role Created",
      description: `Role "${role.name}" has been created successfully.`,
    });
  };

  const formatPrivilege = (privilege: string) => {
    return privilege
      .split(".")
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(" - ");
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="page-header flex items-center justify-between">
        <div>
          <h1 className="page-title">Roles</h1>
          <p className="page-description">Manage roles and their privileges</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="btn-accent">
              <Plus className="w-4 h-4" />
              Add Role
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create New Role</DialogTitle>
              <DialogDescription>
                Define the role name and assign privileges
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-6 py-4">
              <div className="space-y-2">
                <Label htmlFor="roleName">Role Name</Label>
                <Input
                  id="roleName"
                  value={newRole.name}
                  onChange={(e) =>
                    setNewRole({ ...newRole, name: e.target.value })
                  }
                  placeholder="e.g., Support Manager"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="roleDescription">Description</Label>
                <Input
                  id="roleDescription"
                  value={newRole.description}
                  onChange={(e) =>
                    setNewRole({ ...newRole, description: e.target.value })
                  }
                  placeholder="Brief description of the role"
                />
              </div>
              <div className="space-y-4">
                <Label>Privileges</Label>
                <div className="space-y-6">
                  {privilegeCategories.map((category) => (
                    <div key={category.name} className="space-y-3">
                      <h4 className="text-sm font-medium text-foreground">
                        {category.name}
                      </h4>
                      <div className="grid grid-cols-2 gap-3">
                        {category.privileges.map((privilege) => (
                          <div
                            key={privilege}
                            className="flex items-center space-x-2"
                          >
                            <Checkbox
                              id={privilege}
                              checked={newRole.privileges.includes(privilege)}
                              onCheckedChange={(checked) =>
                                handlePrivilegeChange(privilege, !!checked)
                              }
                            />
                            <Label
                              htmlFor={privilege}
                              className="text-sm font-normal cursor-pointer"
                            >
                              {formatPrivilege(privilege)}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex justify-end gap-3">
                <Button
                  variant="outline"
                  onClick={() => setDialogOpen(false)}
                >
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

      <div className="card-elevated">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Role</TableHead>
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
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-lg bg-accent/10">
                      <Shield className="w-4 h-4 text-accent" />
                    </div>
                    <span className="font-medium">{role.name}</span>
                  </div>
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {role.description}
                </TableCell>
                <TableCell>
                  <span className="text-sm text-muted-foreground">
                    {role.privileges[0] === "all"
                      ? "All Privileges"
                      : `${role.privileges.length} privileges`}
                  </span>
                </TableCell>
                <TableCell>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-muted text-muted-foreground">
                    {role.usersCount} users
                  </span>
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {role.createdAt}
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
                        Edit Role
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive">
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
