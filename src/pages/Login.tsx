import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, Lock, Mail, UserPlus } from "lucide-react";
import { useAuthStore } from "@/stores/authStore";
import { Checkbox } from "@/components/ui/checkbox";


// Test user accounts with different roles
const testUsers = [
  {
    email: "admin@pavilion.com",
    password: "admin123",
    user: {
      id: "1",
      name: "Wonderful Onwuchekwa",
      email: "admin@pavilion.com",
      role: "Partner Admin",
      privileges: ["all"],
    },
  },
  {
    email: "support@pavilion.com",
    password: "support123",
    user: {
      id: "2",
      name: "Jane Support",
      email: "support@pavilion.com",
      role: "Support Agent",
      privileges: [
        "dashboard.view",
        "cards.view", "cards.edit", "cards.block", "cards.activate",
        "requests.view", "requests.create",
        "disputes.view", "disputes.create"
      ],
    },
  },
  {
    email: "finance@pavilion.com",
    password: "finance123",
    user: {
      id: "3",
      name: "Mark Finance",
      email: "finance@pavilion.com",
      role: "Finance Officer",
      privileges: [
        "dashboard.view", "dashboard.export",
        "reports.view", "reports.export", "reports.settlements", "reports.transactions",
        "setup.view", "setup.edit"
      ],
    },
  },
  {
    email: "readonly@pavilion.com",
    password: "readonly123",
    user: {
      id: "4",
      name: "View Only User",
      email: "readonly@pavilion.com",
      role: "Read-Only User",
      privileges: [
        "dashboard.view",
        "cards.view",
        "requests.view",
        "disputes.view",
        "reports.view",
        "approvals.view"
      ],
    },
  },
];

export default function Login() {
  const navigate = useNavigate();
  const { setUser } = useAuthStore();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [keepLoggedIn, setKeepLoggedIn] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const matchedUser = testUsers.find(
      (u) => u.email === email && u.password === password
    );

    if (matchedUser) {
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("userName", matchedUser.user.name);
      localStorage.setItem("userRole", matchedUser.user.role);
      localStorage.setItem("userPrivileges", JSON.stringify(matchedUser.user.privileges));
      setUser(matchedUser.user);
      navigate("/");
    } else {
      setError("Invalid email or password");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex">
      {/* Login Form */}
      <div className="w-full bg-white flex flex-col min-h-screen">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <img src="/providus-logo.webp" alt="Providus Bank" className="w-8 h-8" />
            <span className="text-lg font-bold text-slate-800 uppercase tracking-wide">ProvidusBank</span>
          </div>
        </div>

        {/* Form Container */}
        <div className="flex-1 flex items-center justify-center p-6 sm:p-8">
          <div className="w-full max-w-md">
            {/* Icon */}
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 rounded-full border-2 border-slate-200 flex items-center justify-center">
                <UserPlus className="w-7 h-7 text-slate-600" />
              </div>
            </div>

            {/* Heading */}
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-2">Login to your account</h2>
              <p className="text-slate-500">Please sign in using your domain credentials.</p>
            </div>

            {/* Form */}
            <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="example@cardinfra.com"
                    className="w-full bg-white border border-slate-300 rounded-lg px-4 py-3 pl-11 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-white border border-slate-300 rounded-lg px-4 py-3 pl-11 pr-11 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Keep me logged in & Forgot password */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Checkbox 
                    id="keepLoggedIn" 
                    checked={keepLoggedIn}
                    onCheckedChange={(checked) => setKeepLoggedIn(checked as boolean)}
                  />
                  <label htmlFor="keepLoggedIn" className="text-sm text-slate-600 cursor-pointer">
                    Keep me logged in
                  </label>
                </div>
                <button type="button" className="text-sm text-primary hover:underline font-medium">
                  Forgot password?
                </button>
              </div>

              {error && (
                <div className="p-3 bg-destructive/10 border border-destructive/30 rounded-lg">
                  <p className="text-sm text-destructive">{error}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-3 rounded-lg transition-all duration-200 disabled:opacity-50"
              >
                {loading ? "Signing in..." : "Login"}
              </button>
            </form>

            {/* Powered by */}
            <div className="mt-8 pt-6 border-t border-slate-100">
              <div className="flex flex-col items-center gap-2">
                <span className="text-xs text-slate-400 uppercase tracking-wider">Powered by</span>
                <img src="/cardinfra-logo.webp" alt="Card Infra" className="h-8" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
