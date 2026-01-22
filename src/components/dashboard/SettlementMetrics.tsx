import { Wallet, CheckCircle, Receipt, TrendingUp, TrendingDown, ArrowUpRight, Percent } from "lucide-react";

const metrics = [
  {
    title: "Total Transaction Amount",
    value: "₦336.0M",
    previousValue: "₦283.5M",
    change: 18.5,
    icon: Wallet,
    iconBg: "bg-primary/10",
    iconColor: "text-primary",
  },
  {
    title: "Total Settled Amount",
    value: "₦324.2M",
    previousValue: "₦276.7M",
    change: 17.2,
    icon: CheckCircle,
    iconBg: "bg-success/10",
    iconColor: "text-success",
  },
  {
    title: "Total Charges",
    value: "₦11.8M",
    previousValue: "₦10.9M",
    change: 8.4,
    icon: Receipt,
    iconBg: "bg-warning/10",
    iconColor: "text-warning",
  },
];

const additionalMetrics = [
  {
    title: "Settlement Rate",
    value: "96.5%",
    change: 0.8,
    isPositive: true,
  },
  {
    title: "Average Settlement Time",
    value: "1.2 days",
    change: -15.2,
    isPositive: true,
  },
  {
    title: "Pending Settlements",
    value: "₦8.4M",
    change: -22.1,
    isPositive: true,
  },
  {
    title: "Charge Rate",
    value: "3.51%",
    change: -0.3,
    isPositive: true,
  },
];

export function SettlementMetrics() {
  return (
    <div className="space-y-6">

      {/* Primary Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {metrics.map((metric) => (
          <div key={metric.title} className="card-elevated p-5">
            <div className="flex items-start justify-between mb-4">
              <div className={`p-3 rounded-xl ${metric.iconBg}`}>
                <metric.icon className={`w-5 h-5 ${metric.iconColor}`} />
              </div>
              <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-success/10">
                <ArrowUpRight className="w-3 h-3 text-success" />
                <span className="text-xs font-medium text-success">+{metric.change}%</span>
              </div>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">{metric.title}</p>
              <p className="text-2xl font-bold text-foreground mb-2">{metric.value}</p>
              <div className="mt-3 pt-3 border-t border-border">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Previous Period</span>
                  <span className="font-medium text-foreground">{metric.previousValue}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Secondary Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {additionalMetrics.map((metric) => (
          <div key={metric.title} className="card-elevated p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs text-muted-foreground">{metric.title}</p>
              <div className={`flex items-center gap-0.5 ${metric.isPositive ? 'text-success' : 'text-destructive'}`}>
                {metric.change > 0 ? (
                  <TrendingUp className="w-3 h-3" />
                ) : (
                  <TrendingDown className="w-3 h-3" />
                )}
                <span className="text-xs font-medium">
                  {metric.change > 0 ? '+' : ''}{metric.change}%
                </span>
              </div>
            </div>
            <p className="text-xl font-bold text-foreground">{metric.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
