import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const data = [
  { date: "Dec 1", transactions: 1200, value: 45000 },
  { date: "Dec 5", transactions: 1800, value: 67000 },
  { date: "Dec 10", transactions: 1600, value: 52000 },
  { date: "Dec 15", transactions: 2200, value: 89000 },
  { date: "Dec 20", transactions: 1900, value: 71000 },
  { date: "Dec 25", transactions: 2800, value: 112000 },
  { date: "Dec 30", transactions: 2400, value: 95000 },
  { date: "Jan 4", transactions: 3100, value: 124000 },
];

export function TransactionChart() {
  return (
    <div className="card-elevated p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Transaction Volume</h3>
          <p className="text-sm text-muted-foreground">Last 30 days activity</p>
        </div>
        <div className="flex gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-accent"></div>
            <span className="text-muted-foreground">Transactions</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-primary"></div>
            <span className="text-muted-foreground">Value (₦)</span>
          </div>
        </div>
      </div>
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorTransactions" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(173, 58%, 39%)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="hsl(173, 58%, 39%)" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(222, 47%, 15%)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="hsl(222, 47%, 15%)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis 
              dataKey="date" 
              tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
              axisLine={{ stroke: 'hsl(var(--border))' }}
            />
            <YAxis 
              tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
              axisLine={{ stroke: 'hsl(var(--border))' }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
                boxShadow: 'var(--shadow-md)',
              }}
            />
            <Area
              type="monotone"
              dataKey="transactions"
              stroke="hsl(173, 58%, 39%)"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorTransactions)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
