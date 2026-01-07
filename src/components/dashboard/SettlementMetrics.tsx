import { Wallet, CheckCircle, Receipt } from "lucide-react";

const metrics = [
  {
    title: "Total Transaction Amount",
    value: "₦336.0M",
    change: 18.5,
    icon: Wallet,
    iconBg: "bg-primary/10",
    iconColor: "text-primary",
  },
  {
    title: "Total Settled Amount",
    value: "₦324.2M",
    change: 17.2,
    icon: CheckCircle,
    iconBg: "bg-accent/10",
    iconColor: "text-accent",
  },
  {
    title: "Total Charges",
    value: "₦11.8M",
    change: 8.4,
    icon: Receipt,
    iconBg: "bg-warning/10",
    iconColor: "text-warning",
  },
];

export function SettlementMetrics() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {metrics.map((metric) => (
        <div key={metric.title} className="metric-card">
          <div className="flex items-start justify-between">
            <div>
              <p className="metric-label">{metric.title}</p>
              <p className="metric-value mt-2">{metric.value}</p>
              <div className="flex items-center gap-1 mt-2">
                <span className="text-sm font-medium text-success">
                  +{metric.change}%
                </span>
                <span className="text-xs text-muted-foreground">vs last period</span>
              </div>
            </div>
            <div className={`p-3 rounded-xl ${metric.iconBg}`}>
              <metric.icon className={`w-5 h-5 ${metric.iconColor}`} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
