import { useState } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  CreditCard,
  FileText,
  AlertTriangle,
  BarChart3,
  Users,
  Bell,
  Settings,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  LogOut,
  Building2,
  Shield,
  ClipboardCheck,
  DollarSign,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

const navigation = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
];

const cardManagementNav = [
  { name: "Requests", href: "/card-requests", icon: FileText },
  { name: "Cards", href: "/cards", icon: CreditCard },
];

const operationsNav = [
  { name: "Disputes", href: "/disputes", icon: AlertTriangle },
  { name: "Approvals", href: "/approvals", icon: ClipboardCheck },
  { name: "Reports", href: "/reports", icon: BarChart3 },
  { name: "Fee Configuration", href: "/fees", icon: DollarSign },
];

const adminNavigation = [
  { name: "Users", href: "/admin/users", icon: Users },
  { name: "Roles", href: "/admin/roles", icon: Shield },
];

const secondaryNavigation: { name: string; href: string; icon: typeof Bell }[] = [];

export function AppSidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const [cardManagementOpen, setCardManagementOpen] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("userName");
    navigate("/login");
  };

  const isActive = (path: string) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname.startsWith(path);
  };

  const isCardManagementActive = cardManagementNav.some(item => isActive(item.href));

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-40 h-screen bg-sidebar transition-all duration-300 flex flex-col",
        collapsed ? "w-16" : "w-64"
      )}
    >
      {/* Logo */}
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
      </div>

      {/* Partner Info */}
      {!collapsed && (
        <div className="px-4 py-4 border-b border-sidebar-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-sidebar-accent flex items-center justify-center">
              <span className="text-sm font-semibold text-sidebar-primary">AC</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-sidebar-foreground truncate">Acme Corp</p>
              <p className="text-xs text-sidebar-foreground/60">Partner ID: PTN-001</p>
            </div>
          </div>
        </div>
      )}

      {/* Main Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        <div className="space-y-1">
          {navigation.map((item) => (
            <Link
              key={item.name}
              to={item.href}
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

        {/* Card Management Section */}
        <div className="pt-2">
          {collapsed ? (
            // Collapsed state - show icons only
            <div className="space-y-1">
              {cardManagementNav.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
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
            // Expanded state - show collapsible group
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
                {cardManagementNav.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
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

        {/* Operations */}
        <div className="pt-2 space-y-1">
          {operationsNav.map((item) => (
            <Link
              key={item.name}
              to={item.href}
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

        <div className="pt-6">
          {!collapsed && (
            <p className="px-3 mb-2 text-xs font-medium text-sidebar-foreground/40 uppercase tracking-wider">
              Admin
            </p>
          )}
          {adminNavigation.map((item) => (
            <Link
              key={item.name}
              to={item.href}
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

        {secondaryNavigation.length > 0 && (
          <div className="pt-4">
            {!collapsed && (
              <p className="px-3 mb-2 text-xs font-medium text-sidebar-foreground/40 uppercase tracking-wider">
                Support
              </p>
            )}
            {secondaryNavigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
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
          onClick={() => setCollapsed(!collapsed)}
          className="nav-item nav-item-inactive w-full justify-center"
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
    </aside>
  );
}
