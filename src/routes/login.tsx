import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { loginFn, checkSessionFn } from "../actions";
import { SiteNav } from "@/components/site-nav";
import { Home, Lock, User, Eye, EyeOff, Loader2 } from "lucide-react";
import { Link } from "@tanstack/react-router";

export const Route = createFileRoute("/login")({
  component: LoginPage,
  head: () => ({
    meta: [
      { title: "Admin Login — REVA RACE" },
      { name: "description", content: "REVA Academy for Corporate Excellence (RACE) Admin Login" },
    ],
  }),
});

function LoginPage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Check if already authenticated
  useEffect(() => {
    checkSessionFn().then((res) => {
      if (res.isAuthenticated) {
        navigate({ to: "/admin" });
      }
    });
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) {
      setError("Please fill in all fields.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await loginFn({ data: { username, password } });
      if (result.success) {
        navigate({ to: "/admin" });
      } else {
        setError(result.error || "Login failed.");
      }
    } catch (err: any) {
      setError("An unexpected error occurred. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans">
      {/* Top Header Strip */}
      <div className="border-b-[3px] border-[#F9BF29] bg-[#12223A] text-white">
        <div className="mx-auto flex max-w-7xl flex-row items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 rounded border border-white/20 bg-white/5 px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-white hover:bg-white/10 transition shadow-sm"
            >
              <Home className="h-3.5 w-3.5" />
              Home
            </Link>
          </div>
          <div className="flex items-center gap-3">
            <div className="bg-white rounded px-2.5 py-1.5 flex items-center justify-center h-12">
              <img src="/image/reva_logi.png" alt="REVA University" className="h-full w-auto object-contain" />
            </div>
            <span className="hidden sm:inline-block text-xs font-semibold uppercase tracking-widest text-white/85">
              Placement Portal
            </span>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="flex-1 flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Subtle Background Mesh Decorator */}
        <div className="absolute inset-0 opacity-5 pointer-events-none" style={{ backgroundImage: "radial-gradient(circle at 70% 30%, #1E3E62 10%, transparent 80%), radial-gradient(circle at 10% 80%, #F9BF29 5%, transparent 70%)" }} />

        <div className="w-full max-w-md space-y-8 relative z-10 animate-fade-in">
          <div className="text-center">
            <h2 className="text-2xl font-black tracking-wider text-[#1E3E62] uppercase">
              RACE Portal Login
            </h2>
            <p className="mt-2 text-xs font-semibold text-neutral-500 uppercase tracking-widest">
              Authorized Personnel Only
            </p>
          </div>

          <div className="bg-white border border-black/5 rounded-2xl shadow-xl overflow-hidden">
            {/* Top gold bar border */}
            <div className="h-2 bg-[#F9BF29]" />
            
            <form className="p-8 space-y-6" onSubmit={handleSubmit}>
              {error && (
                <div className="rounded-lg bg-rose-50 border border-rose-200 p-3.5 text-xs text-rose-700 font-bold flex items-start gap-2 shadow-sm animate-scale-up">
                  <span className="shrink-0 h-1.5 w-1.5 rounded-full bg-rose-600 mt-1.5" />
                  <span>{error}</span>
                </div>
              )}

              <div className="space-y-4">
                {/* Username Input */}
                <div>
                  <label htmlFor="username-input" className="block text-xs font-bold text-neutral-600 uppercase tracking-wider mb-2">
                    Username
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
                    <input
                      id="username-input"
                      type="text"
                      required
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="Enter administrator username"
                      className="w-full rounded-xl border border-black/10 bg-white py-3 pl-10 pr-3 text-xs outline-none focus:border-[#1E3E62] focus:ring-1 focus:ring-[#1E3E62] transition duration-200"
                    />
                  </div>
                </div>

                {/* Password Input */}
                <div>
                  <label htmlFor="password-input" className="block text-xs font-bold text-neutral-600 uppercase tracking-wider mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
                    <input
                      id="password-input"
                      type={showPassword ? "text" : "password"}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter administrator password"
                      className="w-full rounded-xl border border-black/10 bg-white py-3 pl-10 pr-10 text-xs outline-none focus:border-[#1E3E62] focus:ring-1 focus:ring-[#1E3E62] transition duration-200"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 focus:outline-none"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Login Button */}
              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-[#1E3E62] py-3 text-xs font-black tracking-wider text-white shadow-md hover:bg-[#12223A] disabled:bg-[#1E3E62]/50 transition duration-200 select-none uppercase cursor-pointer"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Authenticating...
                    </>
                  ) : (
                    "Verify Access"
                  )}
                </button>
              </div>
            </form>
          </div>
          
          <div className="text-center">
            <Link
              to="/"
              className="text-xs font-bold text-neutral-400 hover:text-[#1E3E62] transition-colors"
            >
              ← Back to main site
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-black/5 bg-white py-4 text-center text-xs text-neutral-400 font-bold">
        © REVA University · RACE Department
      </footer>
    </div>
  );
}
