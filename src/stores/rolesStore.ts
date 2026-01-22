import { create } from 'zustand';

export interface Role {
  id: string;
  name: string;
  description: string;
  privileges: string[];
  usersCount: number;
  createdAt: string;
}

const defaultRoles: Role[] = [];

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
