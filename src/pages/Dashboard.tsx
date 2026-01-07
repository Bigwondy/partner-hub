import { CreditCard, ArrowUpRight, AlertTriangle, Clock, DollarSign, TrendingUp } from "lucide-react";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { TransactionChart } from "@/components/dashboard/TransactionChart";
import { CardStatusChart } from "@/components/dashboard/CardStatusChart";
import { RecentActivity } from "@/components/dashboard/RecentActivity";
import { QuickActions } from "@/components/dashboard/QuickActions";

export default function Dashboard() {
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div className="page-header">
        <h1 className="page-title">Dashboard</h1>
        <p className="page-description">
          Welcome back! Here's an overview of your card program.
        </p>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Active Cards"
          value="4,520"
          change={12.5}
          icon={<CreditCard className="w-5 h-5 text-accent" />}
          iconBg="bg-accent/10"
        />
        <MetricCard
          title="Transactions (MTD)"
          value="₦89.4M"
          change={8.2}
          icon={<ArrowUpRight className="w-5 h-5 text-success" />}
          iconBg="bg-success/10"
        />
        <MetricCard
          title="Pending Requests"
          value="23"
          change={-5.1}
          icon={<Clock className="w-5 h-5 text-warning" />}
          iconBg="bg-warning/10"
        />
        <MetricCard
          title="Open Disputes"
          value="7"
          change={-15.3}
          icon={<AlertTriangle className="w-5 h-5 text-destructive" />}
          iconBg="bg-destructive/10"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <TransactionChart />
        </div>
        <div>
          <CardStatusChart />
        </div>
      </div>

      {/* Activity and Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <RecentActivity />
        </div>
        <div>
          <QuickActions />
        </div>
      </div>
    </div>
  );
}
