import { useState, useEffect } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  CreditCard,
  FileText,
  AlertTriangle,
  BarChart3,
  Users,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  LogOut,
  Building2,
  Shield,
  Settings,
  X,
  LucideIcon,
  ClipboardCheck,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { useAuthStore } from "@/stores/authStore";

interface NavItem {
  name: string;
  href: string;
  icon: LucideIcon;
  requiredPrivileges: string[];
}

// Order: Dashboard → Admin → Approvals → Reports → Card Management → Setup → Disputes
const dashboardNav: NavItem[] = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard, requiredPrivileges: ["dashboard.view"] },
];

const adminNavigation: NavItem[] = [
  { name: "Roles", href: "/admin/roles", icon: Shield, requiredPrivileges: ["admin.roles.view"] },
  { name: "Users", href: "/admin/users", icon: Users, requiredPrivileges: ["admin.users.view"] },
];

const approvalsNav: NavItem[] = [
  { name: "Approvals", href: "/approvals", icon: ClipboardCheck, requiredPrivileges: ["approvals.view"] },
];

const reportsNav: NavItem[] = [
  { name: "Reports", href: "/reports", icon: BarChart3, requiredPrivileges: ["reports.view"] },
];

const cardManagementNav: NavItem[] = [
  { name: "Requests", href: "/card-requests", icon: FileText, requiredPrivileges: ["requests.view"] },
  { name: "Cards", href: "/cards", icon: CreditCard, requiredPrivileges: ["cards.view"] },
];

const setupNav: NavItem[] = [
  { name: "Setup", href: "/setup", icon: Settings, requiredPrivileges: ["setup.view"] },
];

const disputesNav: NavItem[] = [
  { name: "Disputes", href: "/disputes", icon: AlertTriangle, requiredPrivileges: ["disputes.view"] },
];

interface AppSidebarProps {
  mobileOpen?: boolean;
  onMobileClose?: () => void;
  collapsed?: boolean;
  onCollapsedChange?: (collapsed: boolean) => void;
}

export function AppSidebar({ mobileOpen, onMobileClose, collapsed = false, onCollapsedChange }: AppSidebarProps) {
  const [cardManagementOpen, setCardManagementOpen] = useState(true);
  const [adminOpen, setAdminOpen] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, setUser, hasAnyPrivilege } = useAuthStore();

  // Restore user from localStorage on mount
  useEffect(() => {
    if (!user) {
      const storedPrivileges = localStorage.getItem("userPrivileges");
      const storedRole = localStorage.getItem("userRole");
      const storedName = localStorage.getItem("userName");
      if (storedPrivileges && storedRole && storedName) {
        setUser({
          id: "restored",
          name: storedName,
          email: "",
          role: storedRole,
          privileges: JSON.parse(storedPrivileges),
        });
      }
    }
  }, [user, setUser]);

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("userName");
    localStorage.removeItem("userRole");
    localStorage.removeItem("userPrivileges");
    setUser(null);
    navigate("/login");
  };

  const isActive = (path: string) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname.startsWith(path);
  };

  // Filter navigation items based on user privileges
  const filterNavItems = (items: NavItem[]) => {
    return items.filter(item => hasAnyPrivilege(item.requiredPrivileges));
  };

  const filteredDashboard = filterNavItems(dashboardNav);
  const filteredAdmin = filterNavItems(adminNavigation);
  const filteredApprovals = filterNavItems(approvalsNav);
  const filteredReports = filterNavItems(reportsNav);
  const filteredCardManagement = filterNavItems(cardManagementNav);
  const filteredSetup = filterNavItems(setupNav);
  const filteredDisputes = filterNavItems(disputesNav);

  const isCardManagementActive = filteredCardManagement.some(item => isActive(item.href));
  const isAdminActive = filteredAdmin.some(item => isActive(item.href));

  const handleNavClick = () => {
    if (onMobileClose) {
      onMobileClose();
    }
  };

  const sidebarContent = (
    <>
      {/* Header */}
      <div className="flex h-16 items-center justify-between px-4 border-b border-sidebar-border">
        {!collapsed && (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-sidebar-primary flex items-center justify-center">
              <Building2 className="w-5 h-5 text-sidebar-primary-foreground" />
            </div>
            <div>
              <h1 className="text-sm font-bold text-sidebar-foreground">Pavilion FIP</h1>
              <p className="text-xs text-sidebar-foreground/60">Partner Portal</p>
            </div>
          </div>
        )}
        {collapsed && (
          <div className="w-8 h-8 rounded-lg bg-sidebar-primary flex items-center justify-center mx-auto">
            <Building2 className="w-5 h-5 text-sidebar-primary-foreground" />
          </div>
        )}
        {/* Mobile close button */}
        {onMobileClose && (
          <button
            onClick={onMobileClose}
            className="lg:hidden p-1.5 rounded-lg hover:bg-sidebar-accent transition-colors"
          >
            <X className="w-5 h-5 text-sidebar-foreground" />
          </button>
        )}
      </div>

      {/* Partner Info */}
      {!collapsed && (
        <div className="px-4 py-4 border-b border-sidebar-border">
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-sidebar-foreground truncate">Providus Bank</p>
            <p className="text-xs text-sidebar-foreground/60">Partner ID: PTN-001</p>
          </div>
        </div>
      )}

      {/* Main Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {/* 1. Dashboard */}
        <div className="space-y-1">
          {filteredDashboard.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              onClick={handleNavClick}
              className={cn(
                "nav-item",
                isActive(item.href) ? "nav-item-active" : "nav-item-inactive"
              )}
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              {!collapsed && <span>{item.name}</span>}
            </Link>
          ))}
        </div>

        {/* 2. Admin Section */}
        {filteredAdmin.length > 0 && (
          <div className="pt-2">
            {collapsed ? (
              <div className="space-y-1">
                {filteredAdmin.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    onClick={handleNavClick}
                    className={cn(
                      "nav-item",
                      isActive(item.href) ? "nav-item-active" : "nav-item-inactive"
                    )}
                  >
                    <item.icon className="w-5 h-5 flex-shrink-0" />
                  </Link>
                ))}
              </div>
            ) : (
              <Collapsible open={adminOpen} onOpenChange={setAdminOpen}>
                <CollapsibleTrigger className={cn(
                  "nav-item w-full justify-between",
                  isAdminActive ? "nav-item-active" : "nav-item-inactive"
                )}>
                  <div className="flex items-center gap-3">
                    <Shield className="w-5 h-5 flex-shrink-0" />
                    <span>Admin</span>
                  </div>
                  <ChevronDown className={cn(
                    "w-4 h-4 transition-transform",
                    adminOpen && "rotate-180"
                  )} />
                </CollapsibleTrigger>
                <CollapsibleContent className="pl-4 mt-1 space-y-1">
                  {filteredAdmin.map((item) => (
                    <Link
                      key={item.name}
                      to={item.href}
                      onClick={handleNavClick}
                      className={cn(
                        "nav-item",
                        isActive(item.href) ? "nav-item-active" : "nav-item-inactive"
                      )}
                    >
                      <item.icon className="w-5 h-5 flex-shrink-0" />
                      <span>{item.name}</span>
                    </Link>
                  ))}
                </CollapsibleContent>
              </Collapsible>
            )}
          </div>
        )}

        {/* 3. Approvals */}
        {filteredApprovals.length > 0 && (
          <div className="pt-2 space-y-1">
            {filteredApprovals.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                onClick={handleNavClick}
                className={cn(
                  "nav-item",
                  isActive(item.href) ? "nav-item-active" : "nav-item-inactive"
                )}
              >
                <item.icon className="w-5 h-5 flex-shrink-0" />
                {!collapsed && <span>{item.name}</span>}
              </Link>
            ))}
          </div>
        )}

        {/* 4. Reports */}
        {filteredReports.length > 0 && (
          <div className="pt-2 space-y-1">
            {filteredReports.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                onClick={handleNavClick}
                className={cn(
                  "nav-item",
                  isActive(item.href) ? "nav-item-active" : "nav-item-inactive"
                )}
              >
                <item.icon className="w-5 h-5 flex-shrink-0" />
                {!collapsed && <span>{item.name}</span>}
              </Link>
            ))}
          </div>
        )}

        {/* 5. Card Management Section */}
        {filteredCardManagement.length > 0 && (
          <div className="pt-2">
            {collapsed ? (
              <div className="space-y-1">
                {filteredCardManagement.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    onClick={handleNavClick}
                    className={cn(
                      "nav-item",
                      isActive(item.href) ? "nav-item-active" : "nav-item-inactive"
                    )}
                  >
                    <item.icon className="w-5 h-5 flex-shrink-0" />
                  </Link>
                ))}
              </div>
            ) : (
              <Collapsible open={cardManagementOpen} onOpenChange={setCardManagementOpen}>
                <CollapsibleTrigger className={cn(
                  "nav-item w-full justify-between",
                  isCardManagementActive ? "nav-item-active" : "nav-item-inactive"
                )}>
                  <div className="flex items-center gap-3">
                    <CreditCard className="w-5 h-5 flex-shrink-0" />
                    <span>Card Management</span>
                  </div>
                  <ChevronDown className={cn(
                    "w-4 h-4 transition-transform",
                    cardManagementOpen && "rotate-180"
                  )} />
                </CollapsibleTrigger>
                <CollapsibleContent className="pl-4 mt-1 space-y-1">
                  {filteredCardManagement.map((item) => (
                    <Link
                      key={item.name}
                      to={item.href}
                      onClick={handleNavClick}
                      className={cn(
                        "nav-item",
                        isActive(item.href) ? "nav-item-active" : "nav-item-inactive"
                      )}
                    >
                      <item.icon className="w-5 h-5 flex-shrink-0" />
                      <span>{item.name}</span>
                    </Link>
                  ))}
                </CollapsibleContent>
              </Collapsible>
            )}
          </div>
        )}

        {/* 6. Setup */}
        {filteredSetup.length > 0 && (
          <div className="pt-2 space-y-1">
            {filteredSetup.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                onClick={handleNavClick}
                className={cn(
                  "nav-item",
                  isActive(item.href) ? "nav-item-active" : "nav-item-inactive"
                )}
              >
                <item.icon className="w-5 h-5 flex-shrink-0" />
                {!collapsed && <span>{item.name}</span>}
              </Link>
            ))}
          </div>
        )}

        {/* 7. Disputes - Last item */}
        {filteredDisputes.length > 0 && (
          <div className="pt-2 space-y-1">
            {filteredDisputes.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                onClick={handleNavClick}
                className={cn(
                  "nav-item",
                  isActive(item.href) ? "nav-item-active" : "nav-item-inactive"
                )}
              >
                <item.icon className="w-5 h-5 flex-shrink-0" />
                {!collapsed && <span>{item.name}</span>}
              </Link>
            ))}
          </div>
        )}
      </nav>

      {/* Footer */}
      <div className="p-3 border-t border-sidebar-border">
        <button
          onClick={() => onCollapsedChange?.(!collapsed)}
          className="nav-item nav-item-inactive w-full justify-center hidden lg:flex"
        >
          {collapsed ? (
            <ChevronRight className="w-5 h-5" />
          ) : (
            <>
              <ChevronLeft className="w-5 h-5" />
              <span>Collapse</span>
            </>
          )}
        </button>
        {!collapsed && (
          <button 
            onClick={handleLogout}
            className="nav-item nav-item-inactive w-full mt-1 text-destructive/80 hover:text-destructive hover:bg-destructive/10"
          >
            <LogOut className="w-5 h-5" />
            <span>Sign Out</span>
          </button>
        )}
      </div>
    </>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 z-40 h-screen bg-sidebar transition-all duration-300 flex-col hidden lg:flex",
          collapsed ? "w-16" : "w-64"
        )}
      >
        {sidebarContent}
      </aside>

      {/* Mobile Sidebar Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={onMobileClose}
        />
      )}

      {/* Mobile Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 z-50 h-screen w-64 bg-sidebar transition-transform duration-300 flex flex-col lg:hidden",
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {sidebarContent}
      </aside>
    </>
  );
}
