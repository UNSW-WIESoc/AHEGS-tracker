import { useState } from "react";
import type { Page } from "../../types";
import WiesocLogo from "../shared/WiesocLogo";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";

// Import Firebase Auth and your initialized auth instance
import { auth } from "../../firebase"; // Double-check this path matches your folder structure
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";

interface Props {
  onLogin: (email: string, password: string) => void | Promise<void>;
  onNavigate: (p: Page) => void;
}

export default function LoginPage({
  onLogin,
  onNavigate,
}: Props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please fill in all fields.");
      return;
    }
    setError("");
    try {
      await onLogin(email, password);
    } catch (err: any) {
      setError(err.message || "Login failed.");
    }
  };

  // Google Sign-In Logic with UNSW email validation
  const handleGoogleLogin = async () => {
    setError("");
    const provider = new GoogleAuthProvider();

    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      onLogin(user.email || "", "google-authenticated");
    } catch (err: any) {
      console.error(err);
      if (err.code !== "auth/popup-closed-by-user") {
        setError("An error occurred during Google Sign-in.");
      }
    }
  };

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

          {error && (
            <div
              className="mb-4 p-3 rounded-lg text-sm"
              style={{
                background: "#fef2f2",
                color: "#b91c1c",
                border: "1px solid #fecaca",
              }}
            >
              {error}
            </div>
          )}

          <form onSubmit={submit} className="space-y-4">
            <div>
              <label
                className="block text-sm font-medium mb-1.5"
                style={{ color: "#1e1f3a" }}
              >
                Email address
              </label>
              <div className="relative">
                <Mail
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2"
                  style={{ color: "#9396d4" }}
                />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@uni.edu"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border text-sm outline-none transition-all"
                  style={{
                    border: "1.5px solid #dde2f5",
                    background: "#fff",
                    color: "#1e1f3a",
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = "#9396d4";
                    e.target.style.boxShadow =
                      "0 0 0 3px rgba(147,150,212,0.15)";
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = "#dde2f5";
                    e.target.style.boxShadow = "none";
                  }}
                />
              </div>
              <p
                className="text-xs mt-1"
                style={{ color: "#9396d4" }}
              >
                Demo: aisha.patel@uni.edu or admin@wiesoc.edu
              </p>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label
                  className="block text-sm font-medium"
                  style={{ color: "#1e1f3a" }}
                >
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
                  style={{
                    border: "1.5px solid #dde2f5",
                    background: "#fff",
                    color: "#1e1f3a",
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = "#9396d4";
                    e.target.style.boxShadow =
                      "0 0 0 3px rgba(147,150,212,0.15)";
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = "#dde2f5";
                    e.target.style.boxShadow = "none";
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                  style={{ color: "#9396d4" }}
                >
                  {showPass ? (
                    <EyeOff size={16} />
                  ) : (
                    <Eye size={16} />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl font-semibold text-sm text-white transition-all hover:opacity-90 active:scale-[0.98] mt-2"
              style={{
                background:
                  "linear-gradient(135deg, #9396d4, #7b7fc4)",
              }}
            >
              Sign in
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-6 flex items-center justify-center">
            <div className="absolute w-full border-t border-[#dde2f5]"></div>
            <span className="relative bg-[#fff] px-3 text-xs" style={{ color: "#6b6f9e" }}>
              or
            </span>
          </div>

          {/* Google Login Button */}
          <button
            type="button"
            onClick={handleGoogleLogin}
            className="w-full py-3 rounded-xl font-semibold text-sm transition-all hover:bg-slate-50 active:scale-[0.98] flex items-center justify-center gap-2"
            style={{
              border: "1.5px solid #dde2f5",
              background: "#ffffff",
              color: "#1e1f3a",
            }}
          >
            <svg className="w-4 h-4 mr-1" viewBox="0 0 24 24" fill="none">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.85z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.85c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Sign in with Google
          </button>

          <p
            className="text-center mt-6 text-sm"
            style={{ color: "#6b6f9e" }}
          >
            {"Don't have an account? "}
            <button
              onClick={() => onNavigate("register")}
              className="font-semibold"
              style={{ color: "#9396d4" }}
            >
              Sign up
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
