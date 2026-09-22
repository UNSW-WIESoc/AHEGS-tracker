import { useState } from "react";
import type { Page } from "../../types";
import WiesocLogo from "../shared/WiesocLogo";
import { Mail, Lock, Eye, EyeOff, GraduationCap, Shield, Users } from "lucide-react";

interface Props {
  onLogin: (email: string, password: string, role: Role) => void | Promise<void>;
  onNavigate: (p: Page) => void;
  authError: string;
  setAuthError: (s: string) => void
}

type Role = "student" | "admin" | "mentor";

const TABS: { role: Role; label: string; icon: React.ElementType; placeholder: string }[] = [
  { role: "student", label: "Student",  icon: GraduationCap, placeholder: "you@uni.edu" },
  { role: "mentor",  label: "Mentor",   icon: Users,         placeholder: "mentor@wiesoc.edu" },
  { role: "admin",   label: "Admin",    icon: Shield,        placeholder: "admin@wiesoc.edu" },
];

export default function LoginPage({
  onLogin,
  onNavigate,
  authError,
  setAuthError
}: Props) {
  const [role, setRole] = useState<Role>("student");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");

  const displayError = error || authError;

  const switchRole = (r: Role) => { 
    setRole(r); 
    setEmail(""); 
    setPassword(""); 
    setError("");
    setAuthError("");
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      setError("Please fill in all fields.");
      return;
    }

    setError("");
    try {
      await onLogin(email, password, role);
    } catch (err: any) {
      setError(err.message || "Login failed.");
    }
  };

  const focusFn = (e: React.FocusEvent<HTMLInputElement>) => {
    e.target.style.borderColor = "#9396d4";
    e.target.style.boxShadow = "0 0 0 3px rgba(147,150,212,0.15)";
  };
  const blurFn = (e: React.FocusEvent<HTMLInputElement>) => {
    e.target.style.borderColor = "#dde2f5";
    e.target.style.boxShadow = "none";
  };

  const current = TABS.find(t => t.role === role)!;

  return (
    <div
      className="min-h-screen flex"
      style={{
        background:
          "linear-gradient(135deg, #f0f2fc 0%, #e8f0fa 50%, #f5f0fd 100%)",
      }}
    >
      {/* Left panel */}
      <div
        className="hidden lg:flex flex-col justify-between w-2/5 p-12"
        style={{
          background:
            "linear-gradient(160deg, #9396d4 0%, #7b7fc4 60%, #b9d0ee 100%)",
        }}
      >
        <WiesocLogo size="lg" tint="#ebf0fc" />
        <div className="text-white">
          <h1 className="text-4xl font-bold leading-tight mb-4">
            Track your
            <br />
            volunteering journey
          </h1>
          <p className="text-white/70 text-lg">
            Log events, submit evidence, and watch your progress
            grow toward your goal.
          </p>
        </div>
        <div className="flex gap-3">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="h-1.5 rounded-full"
              style={{
                width: i === 0 ? 32 : 12,
                background:
                  i === 0 ? "white" : "rgba(255,255,255,0.35)",
              }}
            />
          ))}
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md animate-fade-in">
          <div className="lg:hidden mb-8 flex justify-center">
            <WiesocLogo size="lg" tint="#b9d0ee" />
          </div>
          <h2
            className="text-2xl font-bold mb-1"
            style={{ color: "#1e1f3a" }}
          >
            Welcome back
          </h2>
          <p className="mb-8" style={{ color: "#6b6f9e" }}>
            Sign in to your WIESOC account
          </p>

          {/* Role tabs */}
          <div className="flex rounded-xl p-1 mb-6" style={{ background: "#eef1fb" }}>
            {TABS.map(({ role: r, label, icon: Icon }) => (
              <button key={r} onClick={() => switchRole(r)}
                className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-xs font-semibold transition-all"
                style={{
                  background: role === r ? "#fff" : "transparent",
                  color: role === r ? "#9396d4" : "#6b6f9e",
                  boxShadow: role === r ? "0 1px 4px rgba(147,150,212,0.2)" : "none",
                }}>
                <Icon size={14} />
                {label}
              </button>
            ))}
          </div>

          {displayError && (
            <div
              className="mb-4 p-3 rounded-lg text-sm"
              style={{
                background: "#fef2f2",
                color: "#b91c1c",
                border: "1px solid #fecaca",
              }}
            >
              {displayError}
            </div>
          )}

          <form onSubmit={submit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: "#1e1f3a" }}>
                Email address
              </label>
              <div className="relative">
                <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "#9396d4" }} />
                <input 
                  type="email" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={current.placeholder}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border text-sm outline-none transition-all"
                  style={{ border: "1.5px solid #dde2f5", background: "#fff", color: "#1e1f3a" }}
                  onFocus={focusFn} 
                  onBlur={blurFn} 
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="block text-sm font-medium" style={{ color: "#1e1f3a" }}>
                  Password
                </label>
                <button 
                  type="button" 
                  onClick={() => onNavigate("forgot-password")} 
                  className="text-sm font-medium" 
                  style={{ color: "#9396d4" }}
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <Lock 
                  size={16} 
                  className="absolute left-3 top-1/2 -translate-y-1/2" 
                  style={{ color: "#9396d4" }} 
                />
                <input 
                  type={showPass ? "text" : "password"} 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full pl-10 pr-10 py-3 rounded-xl border text-sm outline-none transition-all"
                  style={{ border: "1.5px solid #dde2f5", background: "#fff", color: "#1e1f3a" }}
                  onFocus={focusFn} 
                  onBlur={blurFn} 
                />
                <button 
                  type="button" 
                  onClick={() => setShowPass(!showPass)} 
                  className="absolute right-3 top-1/2 -translate-y-1/2" 
                  style={{ color: "#9396d4" }}
                >
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button type="submit"
              className="w-full py-3 rounded-xl font-semibold text-sm text-white transition-all hover:opacity-90 active:scale-[0.98] mt-2"
              style={{ background: "linear-gradient(135deg, #9396d4, #7b7fc4)" }}
            >
              Sign in
            </button>
          </form>

          {role === "student" && (
            <p className="text-center mt-6 text-sm" style={{ color: "#6b6f9e" }}>
              {"Don't have an account? "}
              <button 
                onClick={() => onNavigate("register")} 
                className="font-semibold" 
                style={{ color: "#9396d4" }}
              >
                Sign up
              </button>
            </p>
          )}
          {role === "mentor" && (
            <p className="text-center mt-6 text-sm" style={{ color: "#6b6f9e" }}>
              New mentor?{" "}
              <button 
                onClick={() => onNavigate("register")} 
                className="font-semibold" 
                style={{ color: "#9396d4" }}
              >
                Register here
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
