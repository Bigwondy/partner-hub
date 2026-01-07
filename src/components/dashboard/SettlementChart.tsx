import { useState } from "react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ComposedChart,
} from "recharts";
import { BarChart3, TrendingUp, Layers } from "lucide-react";

const data = [
  { month: "Jan", transactionAmount: 42000000, settledAmount: 40500000, charges: 1500000 },
  { month: "Feb", transactionAmount: 38000000, settledAmount: 36700000, charges: 1300000 },
  { month: "Mar", transactionAmount: 45000000, settledAmount: 43500000, charges: 1500000 },
  { month: "Apr", transactionAmount: 52000000, settledAmount: 50200000, charges: 1800000 },
  { month: "May", transactionAmount: 48000000, settledAmount: 46300000, charges: 1700000 },
  { month: "Jun", transactionAmount: 55000000, settledAmount: 53100000, charges: 1900000 },
  { month: "Jul", transactionAmount: 58000000, settledAmount: 55800000, charges: 2200000 },
  { month: "Aug", transactionAmount: 62000000, settledAmount: 59800000, charges: 2200000 },
  { month: "Sep", transactionAmount: 56000000, settledAmount: 54000000, charges: 2000000 },
  { month: "Oct", transactionAmount: 68000000, settledAmount: 65500000, charges: 2500000 },
  { month: "Nov", transactionAmount: 65000000, settledAmount: 62700000, charges: 2300000 },
  { month: "Dec", transactionAmount: 78000000, settledAmount: 75200000, charges: 2800000 },
];

type ChartView = "bar" | "area" | "composed";

export function SettlementChart() {
  const [chartView, setChartView] = useState<ChartView>("composed");

  const formatCurrency = (value: number) => {
    if (value >= 1000000) {
      return `₦${(value / 1000000).toFixed(1)}M`;
    }
    return `₦${(value / 1000).toFixed(0)}K`;
  };

  const totalTransactions = data.reduce((sum, d) => sum + d.transactionAmount, 0);
  const totalSettled = data.reduce((sum, d) => sum + d.settledAmount, 0);
  const totalCharges = data.reduce((sum, d) => sum + d.charges, 0);
  const avgSettlementRate = ((totalSettled / totalTransactions) * 100).toFixed(1);

  const chartViews = [
    { id: "composed" as ChartView, label: "Combined", icon: Layers },
    { id: "bar" as ChartView, label: "Bar", icon: BarChart3 },
    { id: "area" as ChartView, label: "Trend", icon: TrendingUp },
  ];

  return (
    <div className="space-y-6">
      {/* Main Chart */}
      <div className="card-elevated p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h3 className="text-lg font-semibold text-foreground">Monthly Analysis</h3>
            <p className="text-sm text-muted-foreground">
              Track patterns, seasonal trends, and identify areas for optimization
            </p>
          </div>
          <div className="flex items-center gap-2">
            {chartViews.map((view) => (
              <button
                key={view.id}
                onClick={() => setChartView(view.id)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  chartView === view.id
                    ? "bg-accent text-accent-foreground"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}
              >
                <view.icon className="w-4 h-4" />
                {view.label}
              </button>
            ))}
          </div>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap gap-4 mb-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-primary"></div>
            <span className="text-muted-foreground">Transaction Amount</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-accent"></div>
            <span className="text-muted-foreground">Settled Amount</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-warning"></div>
            <span className="text-muted-foreground">Charges</span>
          </div>
        </div>

        <div className="h-[350px]">
          <ResponsiveContainer width="100%" height="100%">
            {chartView === "bar" ? (
              <BarChart data={data} barGap={2}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis
                  dataKey="month"
                  tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                  axisLine={{ stroke: 'hsl(var(--border))' }}
                />
                <YAxis
                  tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                  axisLine={{ stroke: 'hsl(var(--border))' }}
                  tickFormatter={formatCurrency}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                    boxShadow: 'var(--shadow-md)',
                  }}
                  formatter={(value: number, name: string) => [
                    formatCurrency(value),
                    name === 'transactionAmount' ? 'Transaction Amount' :
                    name === 'settledAmount' ? 'Settled Amount' : 'Charges'
                  ]}
                />
                <Bar dataKey="transactionAmount" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                <Bar dataKey="settledAmount" fill="hsl(var(--accent))" radius={[4, 4, 0, 0]} />
                <Bar dataKey="charges" fill="hsl(var(--warning))" radius={[4, 4, 0, 0]} />
              </BarChart>
            ) : chartView === "area" ? (
              <AreaChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis
                  dataKey="month"
                  tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                  axisLine={{ stroke: 'hsl(var(--border))' }}
                />
                <YAxis
                  tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                  axisLine={{ stroke: 'hsl(var(--border))' }}
                  tickFormatter={formatCurrency}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                    boxShadow: 'var(--shadow-md)',
                  }}
                  formatter={(value: number, name: string) => [
                    formatCurrency(value),
                    name === 'transactionAmount' ? 'Transaction Amount' :
                    name === 'settledAmount' ? 'Settled Amount' : 'Charges'
                  ]}
                />
                <Area
                  type="monotone"
                  dataKey="transactionAmount"
                  stroke="hsl(var(--primary))"
                  fill="hsl(var(--primary))"
                  fillOpacity={0.2}
                  strokeWidth={2}
                />
                <Area
                  type="monotone"
                  dataKey="settledAmount"
                  stroke="hsl(var(--accent))"
                  fill="hsl(var(--accent))"
                  fillOpacity={0.2}
                  strokeWidth={2}
                />
                <Area
                  type="monotone"
                  dataKey="charges"
                  stroke="hsl(var(--warning))"
                  fill="hsl(var(--warning))"
                  fillOpacity={0.2}
                  strokeWidth={2}
                />
              </AreaChart>
            ) : (
              <ComposedChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis
                  dataKey="month"
                  tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                  axisLine={{ stroke: 'hsl(var(--border))' }}
                />
                <YAxis
                  tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                  axisLine={{ stroke: 'hsl(var(--border))' }}
                  tickFormatter={formatCurrency}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                    boxShadow: 'var(--shadow-md)',
                  }}
                  formatter={(value: number, name: string) => [
                    formatCurrency(value),
                    name === 'transactionAmount' ? 'Transaction Amount' :
                    name === 'settledAmount' ? 'Settled Amount' : 'Charges'
                  ]}
                />
                <Bar dataKey="transactionAmount" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} opacity={0.8} />
                <Bar dataKey="settledAmount" fill="hsl(var(--accent))" radius={[4, 4, 0, 0]} opacity={0.8} />
                <Line
                  type="monotone"
                  dataKey="charges"
                  stroke="hsl(var(--warning))"
                  strokeWidth={3}
                  dot={{ fill: 'hsl(var(--warning))', strokeWidth: 2 }}
                />
              </ComposedChart>
            )}
          </ResponsiveContainer>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="card-elevated p-4">
          <p className="text-xs text-muted-foreground mb-1">Annual Transaction Volume</p>
          <p className="text-xl font-bold text-foreground">{formatCurrency(totalTransactions)}</p>
          <p className="text-xs text-muted-foreground mt-1">Total processed in 12 months</p>
        </div>
        <div className="card-elevated p-4">
          <p className="text-xs text-muted-foreground mb-1">Annual Settled Amount</p>
          <p className="text-xl font-bold text-success">{formatCurrency(totalSettled)}</p>
          <p className="text-xs text-muted-foreground mt-1">Successfully reconciled</p>
        </div>
        <div className="card-elevated p-4">
          <p className="text-xs text-muted-foreground mb-1">Annual Charges</p>
          <p className="text-xl font-bold text-warning">{formatCurrency(totalCharges)}</p>
          <p className="text-xs text-muted-foreground mt-1">Total processing fees</p>
        </div>
        <div className="card-elevated p-4">
          <p className="text-xs text-muted-foreground mb-1">Average Settlement Rate</p>
          <p className="text-xl font-bold text-accent">{avgSettlementRate}%</p>
          <p className="text-xs text-muted-foreground mt-1">Transaction to settlement ratio</p>
        </div>
      </div>

      {/* Insights */}
      <div className="card-elevated p-5">
        <h4 className="text-sm font-semibold text-foreground mb-4">Key Insights</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-3 rounded-lg bg-success/5 border border-success/20">
            <p className="text-sm font-medium text-success mb-1">Peak Performance</p>
            <p className="text-xs text-muted-foreground">
              December recorded the highest transaction volume at ₦78M, a 20% increase from November.
            </p>
          </div>
          <div className="p-3 rounded-lg bg-info/5 border border-info/20">
            <p className="text-sm font-medium text-info mb-1">Seasonal Trend</p>
            <p className="text-xs text-muted-foreground">
              Q4 shows consistent growth pattern, ideal for capacity planning and resource allocation.
            </p>
          </div>
          <div className="p-3 rounded-lg bg-accent/5 border border-accent/20">
            <p className="text-sm font-medium text-accent mb-1">Cost Efficiency</p>
            <p className="text-xs text-muted-foreground">
              Charge rate maintained at ~3.5% throughout the year, indicating stable processing costs.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
