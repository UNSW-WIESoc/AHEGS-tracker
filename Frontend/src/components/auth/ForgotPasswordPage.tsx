import { useState } from "react";
import type { Page } from "../../types";
import WiesocLogo from "../shared/WiesocLogo";
import { Mail, ArrowLeft, CheckCircle } from "lucide-react";

interface Props {
  onNavigate: (p: Page) => void;
}

export default function ForgotPasswordPage({
  onNavigate,
}: Props) {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) setSent(true);
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-6"
      style={{
        background: "#9396d4"
          // "linear-gradient(160deg, #9396d4 0%, #7b7fc4 60%, #b9d0ee 100%)",
      }}
    >
      <div className="w-full max-w-md animate-fade-in">
        <div className="flex justify-center mb-6">
          <WiesocLogo size="lg" tint="#ebf0fc" />
        </div>
        <div
          className="rounded-2xl p-8 shadow-xl"
          style={{
            background: "linear-gradient(135deg, #f0f2fc 0%, #e8f0fa 50%, #f5f0fd 100%)",
            border: "1px solid #eef1fb",
          }}
        >
          {sent ? (
            <div className="text-center py-4">
              <div className="flex justify-center mb-4">
                <CheckCircle
                  size={48}
                  style={{ color: "#9396d4" }}
                />
              </div>
              <h2
                className="text-xl font-bold mb-2"
                style={{ color: "#1e1f3a" }}
              >
                Check your inbox
              </h2>
              <p
                className="text-sm mb-6"
                style={{ color: "#6b6f9e" }}
              >
                {"We've sent a password reset link to "}
                <span
                  className="font-medium"
                  style={{ color: "#1e1f3a" }}
                >
                  {email}
                </span>
              </p>
              <button
                onClick={() => onNavigate("login")}
                className="text-sm font-semibold"
                style={{ color: "#9396d4" }}
              >
                Back to sign in
              </button>
            </div>
          ) : (
            <>
              <button
                onClick={() => onNavigate("login")}
                className="flex items-center gap-1.5 text-sm mb-6"
                style={{ color: "#9396d4" }}
              >
                <ArrowLeft size={16} /> Back to sign in
              </button>
              <h2
                className="text-2xl font-bold mb-1"
                style={{ color: "#1e1f3a" }}
              >
                Reset password
              </h2>
              <p
                className="mb-6 text-sm"
                style={{ color: "#6b6f9e" }}
              >
                {
                  "Enter your email and we'll send a reset link."
                }
              </p>
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
                </div>
                <button
                  type="submit"
                  className="w-full py-3 rounded-xl font-semibold text-sm text-white transition-all hover:opacity-90 active:scale-[0.98]"
                  style={{
                    background:
                      "linear-gradient(135deg, #9396d4, #7b7fc4)",
                  }}
                >
                  Send reset link
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}