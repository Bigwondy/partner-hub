import { Plus, CreditCard, AlertTriangle, FileBarChart } from "lucide-react";
import { Link } from "react-router-dom";

const actions = [
  {
    title: "New Card Request",
    description: "Submit a card production request",
    icon: Plus,
    href: "/card-requests/new",
    color: "bg-accent",
  },
  {
    title: "Manage Cards",
    description: "Block, pause, or update limits",
    icon: CreditCard,
    href: "/cards",
    color: "bg-primary",
  },
  {
    title: "Raise Dispute",
    description: "Submit a new dispute case",
    icon: AlertTriangle,
    href: "/disputes/new",
    color: "bg-warning",
  },
  {
    title: "View Reports",
    description: "Access transaction reports",
    icon: FileBarChart,
    href: "/reports",
    color: "bg-info",
  },
];

export function QuickActions() {
  return (
    <div className="card-elevated p-6">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-foreground">Quick Actions</h3>
        <p className="text-sm text-muted-foreground">Common operations</p>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {actions.map((action) => (
          <Link
            key={action.title}
            to={action.href}
            className="flex items-center gap-3 p-4 rounded-xl border border-border/50 hover:border-accent/50 hover:bg-accent/5 transition-all group"
          >
            <div className={`p-2.5 rounded-lg ${action.color} text-white`}>
              <action.icon className="w-4 h-4" />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground group-hover:text-accent transition-colors">
                {action.title}
              </p>
              <p className="text-xs text-muted-foreground">{action.description}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
