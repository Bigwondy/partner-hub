import { create } from 'zustand';

export interface Role {
  id: string;
  name: string;
  description: string;
  privileges: string[];
  usersCount: number;
  createdAt: string;
}

const defaultRoles: Role[] = [
  {
    id: "1",
    name: "Partner Admin",
    description: "Full access to all features",
    privileges: ["all"],
    usersCount: 2,
    createdAt: "2024-01-15",
  },
  {
    id: "2",
    name: "Support Agent",
    description: "Card requests, management, and disputes",
    privileges: ["dashboard.view", "cards.view", "cards.edit", "requests.view", "requests.create", "disputes.view", "disputes.create"],
    usersCount: 5,
    createdAt: "2024-02-20",
  },
  {
    id: "3",
    name: "Finance Officer",
    description: "Settlements and fee reports",
    privileges: ["dashboard.view", "reports.view", "reports.export"],
    usersCount: 3,
    createdAt: "2024-03-10",
  },
  {
    id: "4",
    name: "Read-Only User",
    description: "View-only access for stakeholders",
    privileges: ["dashboard.view", "cards.view", "requests.view", "disputes.view", "reports.view"],
    usersCount: 8,
    createdAt: "2024-04-05",
  },
];

interface RolesStore {
  roles: Role[];
  addRole: (role: Omit<Role, 'id' | 'usersCount' | 'createdAt'>) => Role;
  deleteRole: (id: string) => void;
  updateRole: (id: string, updates: Partial<Role>) => void;
  getRoleNames: () => string[];
}

export const useRolesStore = create<RolesStore>((set, get) => ({
  roles: defaultRoles,
  
  addRole: (roleData) => {
    const newRole: Role = {
      id: String(Date.now()),
      name: roleData.name,
      description: roleData.description,
      privileges: roleData.privileges,
      usersCount: 0,
      createdAt: new Date().toISOString().split("T")[0],
    };
    set((state) => ({ roles: [...state.roles, newRole] }));
    return newRole;
  },
  
  deleteRole: (id) => {
    set((state) => ({ roles: state.roles.filter((r) => r.id !== id) }));
  },
  
  updateRole: (id, updates) => {
    set((state) => ({
      roles: state.roles.map((r) => (r.id === id ? { ...r, ...updates } : r)),
    }));
  },
  
  getRoleNames: () => get().roles.map((r) => r.name),
}));
