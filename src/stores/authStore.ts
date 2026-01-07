import { create } from 'zustand';

interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: string;
  privileges: string[];
}

interface AuthStore {
  user: AuthUser | null;
  setUser: (user: AuthUser | null) => void;
  hasPrivilege: (privilege: string) => boolean;
  hasAnyPrivilege: (privileges: string[]) => boolean;
  logout: () => void;
}

export const useAuthStore = create<AuthStore>((set, get) => ({
  user: null,
  
  setUser: (user) => set({ user }),
  
  hasPrivilege: (privilege) => {
    const user = get().user;
    if (!user) return false;
    // "all" privilege grants access to everything
    if (user.privileges.includes("all")) return true;
    return user.privileges.includes(privilege);
  },
  
  hasAnyPrivilege: (privileges) => {
    const user = get().user;
    if (!user) return false;
    if (user.privileges.includes("all")) return true;
    return privileges.some(p => user.privileges.includes(p));
  },
  
  logout: () => set({ user: null }),
}));
