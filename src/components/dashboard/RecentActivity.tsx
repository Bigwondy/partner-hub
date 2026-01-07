import { CreditCard, AlertTriangle, FileText, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";

const activities = [
  {
    id: 1,
    type: "card_request",
    title: "Card request approved",
    description: "Request #REQ-2024-001234 has been approved",
    time: "2 minutes ago",
    icon: FileText,
    iconBg: "bg-success/10",
    iconColor: "text-success",
  },
  {
    id: 2,
    type: "card_blocked",
    title: "Card blocked",
    description: "Card ****4532 blocked due to fraud report",
    time: "15 minutes ago",
    icon: CreditCard,
    iconBg: "bg-destructive/10",
    iconColor: "text-destructive",
  },
  {
    id: 3,
    type: "dispute",
    title: "New dispute raised",
    description: "Dispute #DSP-2024-000891 submitted for review",
    time: "1 hour ago",
    icon: AlertTriangle,
    iconBg: "bg-warning/10",
    iconColor: "text-warning",
  },
  {
    id: 4,
    type: "settlement",
    title: "Settlement completed",
    description: "Daily settlement of ₦12,450,000 processed",
    time: "3 hours ago",
    icon: CheckCircle,
    iconBg: "bg-accent/10",
    iconColor: "text-accent",
  },
];

export function RecentActivity() {
  return (
    <div className="card-elevated p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Recent Activity</h3>
          <p className="text-sm text-muted-foreground">Latest actions and updates</p>
        </div>
        <button className="text-sm text-accent hover:text-accent/80 font-medium">
          View All
        </button>
      </div>
      <div className="space-y-4">
        {activities.map((activity) => (
          <div
            key={activity.id}
            className="flex items-start gap-4 p-3 rounded-lg hover:bg-muted/30 transition-colors"
          >
            <div className={cn("p-2 rounded-lg", activity.iconBg)}>
              <activity.icon className={cn("w-4 h-4", activity.iconColor)} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground">{activity.title}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{activity.description}</p>
            </div>
            <span className="text-xs text-muted-foreground whitespace-nowrap">{activity.time}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
