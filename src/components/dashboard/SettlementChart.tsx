import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const data = [
  { month: "Jul", transactionAmount: 45000000, settledAmount: 43500000, charges: 1500000 },
  { month: "Aug", transactionAmount: 52000000, settledAmount: 50200000, charges: 1800000 },
  { month: "Sep", transactionAmount: 48000000, settledAmount: 46300000, charges: 1700000 },
  { month: "Oct", transactionAmount: 61000000, settledAmount: 58900000, charges: 2100000 },
  { month: "Nov", transactionAmount: 58000000, settledAmount: 55800000, charges: 2200000 },
  { month: "Dec", transactionAmount: 72000000, settledAmount: 69500000, charges: 2500000 },
];

export function SettlementChart() {
  const formatCurrency = (value: number) => {
    if (value >= 1000000) {
      return `₦${(value / 1000000).toFixed(1)}M`;
    }
    return `₦${(value / 1000).toFixed(0)}K`;
  };

  return (
    <div className="card-elevated p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Settlement Analysis</h3>
          <p className="text-sm text-muted-foreground">Monthly breakdown of settlements</p>
        </div>
        <div className="flex gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-primary"></div>
            <span className="text-muted-foreground">Transaction</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-accent"></div>
            <span className="text-muted-foreground">Settled</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-warning"></div>
            <span className="text-muted-foreground">Charges</span>
          </div>
        </div>
      </div>
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
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
        </ResponsiveContainer>
      </div>
    </div>
  );
}
