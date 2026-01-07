import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Building2, Eye, EyeOff, Lock, Mail, TrendingUp, CreditCard, Users, AlertTriangle } from "lucide-react";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Test credentials
    if (email === "admin@pavilion.com" && password === "admin123") {
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("userName", "Wonderful Onwuchekwa");
      navigate("/");
    } else {
      setError("Invalid email or password");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex">
      {/* Left side - Dashboard Preview */}
      <div className="hidden lg:block lg:w-3/5 bg-sidebar relative overflow-hidden">
        {/* Simulated Dashboard UI */}
        <div className="absolute inset-0 p-6 scale-90 origin-top-left">
          {/* Top Bar */}
          <div className="bg-card rounded-xl p-4 mb-4 flex items-center justify-between border border-border">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
                <Building2 className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <p className="font-semibold text-foreground">Pavilion FIP</p>
                <p className="text-xs text-muted-foreground">Partner Portal</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-32 h-8 bg-muted rounded-lg"></div>
              <div className="w-8 h-8 rounded-full bg-accent"></div>
            </div>
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-4 gap-4 mb-4">
            {[
              { label: "Active Cards", value: "4,520", icon: CreditCard, color: "text-success", bg: "bg-success/10" },
              { label: "This Month", value: "₦89.4M", icon: TrendingUp, color: "text-accent", bg: "bg-accent/10" },
              { label: "Pending Requests", value: "23", icon: Users, color: "text-warning", bg: "bg-warning/10" },
              { label: "Open Disputes", value: "8", icon: AlertTriangle, color: "text-destructive", bg: "bg-destructive/10" },
            ].map((stat, i) => (
              <div key={i} className="bg-card rounded-xl p-4 border border-border">
                <div className={`w-10 h-10 rounded-lg ${stat.bg} flex items-center justify-center mb-3`}>
                  <stat.icon className={`w-5 h-5 ${stat.color}`} />
                </div>
                <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-3 gap-4 mb-4">
            {/* Line Chart Mockup */}
            <div className="col-span-2 bg-card rounded-xl p-4 border border-border">
              <p className="font-semibold text-foreground mb-4">Transaction Volume</p>
              <div className="h-40 flex items-end gap-2">
                {[40, 65, 45, 80, 55, 90, 70, 85, 60, 75, 95, 88].map((h, i) => (
                  <div key={i} className="flex-1 bg-accent/20 rounded-t" style={{ height: `${h}%` }}>
                    <div className="w-full bg-accent rounded-t" style={{ height: `${h * 0.7}%` }}></div>
                  </div>
                ))}
              </div>
            </div>

            {/* Pie Chart Mockup */}
            <div className="bg-card rounded-xl p-4 border border-border">
              <p className="font-semibold text-foreground mb-4">Card Status</p>
              <div className="relative w-32 h-32 mx-auto">
                <svg className="w-full h-full" viewBox="0 0 36 36">
                  <circle cx="18" cy="18" r="15.9" fill="none" stroke="hsl(var(--success))" strokeWidth="3" strokeDasharray="75 25" strokeDashoffset="25" />
                  <circle cx="18" cy="18" r="15.9" fill="none" stroke="hsl(var(--warning))" strokeWidth="3" strokeDasharray="15 85" strokeDashoffset="50" />
                  <circle cx="18" cy="18" r="15.9" fill="none" stroke="hsl(var(--destructive))" strokeWidth="3" strokeDasharray="10 90" strokeDashoffset="65" />
                </svg>
              </div>
              <div className="mt-4 space-y-1">
                <div className="flex items-center gap-2 text-xs">
                  <div className="w-2 h-2 rounded-full bg-success"></div>
                  <span className="text-muted-foreground">Active (75%)</span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <div className="w-2 h-2 rounded-full bg-warning"></div>
                  <span className="text-muted-foreground">Paused (15%)</span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <div className="w-2 h-2 rounded-full bg-destructive"></div>
                  <span className="text-muted-foreground">Blocked (10%)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Table Mockup */}
          <div className="bg-card rounded-xl p-4 border border-border">
            <p className="font-semibold text-foreground mb-4">Recent Activity</p>
            <div className="space-y-3">
              {[
                { action: "Card Request Approved", id: "REQ-001", time: "2 min ago" },
                { action: "New Dispute Filed", id: "DSP-042", time: "15 min ago" },
                { action: "Settlement Completed", id: "STL-089", time: "1 hr ago" },
                { action: "Card Blocked", id: "CRD-221", time: "2 hrs ago" },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                  <div>
                    <p className="text-sm font-medium text-foreground">{item.action}</p>
                    <p className="text-xs text-muted-foreground">{item.id}</p>
                  </div>
                  <p className="text-xs text-muted-foreground">{item.time}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-background/80"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-sidebar via-transparent to-sidebar/50"></div>
        
        {/* Branding overlay */}
        <div className="absolute bottom-8 left-8 z-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center">
              <Building2 className="w-7 h-7 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">Pavilion FIP</h1>
              <p className="text-sm text-muted-foreground">Partner Portal</p>
            </div>
          </div>
          <p className="text-muted-foreground max-w-sm">
            Your complete card management platform for operations, disputes, and analytics.
          </p>
        </div>
      </div>

      {/* Right side - Login Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-background">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="flex items-center justify-center gap-3 mb-8 lg:hidden">
            <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center">
              <Building2 className="w-7 h-7 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">Pavilion FIP</h1>
              <p className="text-sm text-muted-foreground">Partner Portal</p>
            </div>
          </div>

          {/* Login Card */}
          <div className="card-elevated p-8">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-foreground">Welcome back</h2>
              <p className="text-muted-foreground mt-1">Sign in to your account</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="input-field pl-11"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="input-field pl-11 pr-11"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {error && (
                <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
                  <p className="text-sm text-destructive">{error}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="btn-accent w-full py-3 text-base"
              >
                {loading ? "Signing in..." : "Sign In"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
