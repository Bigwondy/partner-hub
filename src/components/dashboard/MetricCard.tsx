import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface MetricCardProps {
  title: string;
  value: string | number;
  change?: number;
  changeLabel?: string;
  icon: ReactNode;
  iconBg?: string;
}

export function MetricCard({
  title,
  value,
  change,
  changeLabel = "vs last month",
  icon,
  iconBg = "bg-accent/10",
}: MetricCardProps) {
  const getTrendIcon = () => {
    if (change === undefined) return null;
    if (change > 0) return <TrendingUp className="w-3 h-3" />;
    if (change < 0) return <TrendingDown className="w-3 h-3" />;
    return <Minus className="w-3 h-3" />;
  };

  const getTrendColor = () => {
    if (change === undefined) return "";
    if (change > 0) return "text-success";
    if (change < 0) return "text-destructive";
    return "text-muted-foreground";
  };

  return (
    <div className="metric-card animate-fade-in">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="metric-label">{title}</p>
          <p className="metric-value mt-2">{value}</p>
          {change !== undefined && (
            <div className={cn("flex items-center gap-1 mt-2 text-xs font-medium", getTrendColor())}>
              {getTrendIcon()}
              <span>{Math.abs(change)}%</span>
              <span className="text-muted-foreground font-normal">{changeLabel}</span>
            </div>
          )}
        </div>
        <div className={cn("p-3 rounded-xl", iconBg)}>
          {icon}
        </div>
      </div>
    </div>
  );
}
