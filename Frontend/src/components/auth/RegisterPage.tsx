import { useState } from "react";
import type { Page } from "../../types";
import WiesocLogo from "../shared/WiesocLogo";
import {
  User,
  Hash,
  Mail,
  Lock,
  GraduationCap,
  Eye,
  EyeOff,
} from "lucide-react";

interface Props {
  onLogin: () => void;
  onNavigate: (p: Page) => void;
}

const DEGREES = [
  "Bachelor of Engineering (Civil)",
  "Bachelor of Engineering (Electrical)",
  "Bachelor of Engineering (Mechanical)",
  "Bachelor of Engineering (Software)",
  "Bachelor of Engineering (Chemical)",
  "Bachelor of Engineering (Environmental)",
  "Bachelor of Engineering (Aerospace)",
  "Master of Engineering",
  "PhD (Engineering)",
];

const inputStyle = {
  border: "1.5px solid #dde2f5",
  background: "#fff",
  color: "#1e1f3a",
};

function Field({
  label,
  icon: Icon,
  children,
}: {
  label: string;
  icon: React.ElementType;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label
        className="block text-sm font-medium mb-1.5"
        style={{ color: "#1e1f3a" }}
      >
        {label}
      </label>
      <div className="relative">
        <Icon
          size={16}
          className="absolute left-3 top-1/2 -translate-y-1/2 z-10"
          style={{ color: "#9396d4" }}
        />
        {children}
      </div>
    </div>
  );
}

export default function RegisterPage({
  onLogin,
  onNavigate,
}: Props) {
  const [form, setForm] = useState({
    fullName: "",
    studentId: "",
    email: "",
    password: "",
    degree: "",
  });
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");

  const set =
    (k: keyof typeof form) =>
    (
      e: React.ChangeEvent<
        HTMLInputElement | HTMLSelectElement
      >,
    ) =>
      setForm((f) => ({ ...f, [k]: e.target.value }));

  const focusStyle = (
    e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    e.target.style.borderColor = "#9396d4";
    e.target.style.boxShadow =
      "0 0 0 3px rgba(147,150,212,0.15)";
  };
  const blurStyle = (
    e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    e.target.style.borderColor = "#dde2f5";
    e.target.style.boxShadow = "none";
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const { fullName, studentId, email, password, degree } =
      form;
    if (
      !fullName ||
      !studentId ||
      !email ||
      !password ||
      !degree
    ) {
      setError("Please fill in all fields.");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    setError("");
    onLogin();
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-6"
      style={{
        background:
          "linear-gradient(160deg, #9396d4 0%, #7b7fc4 60%, #b9d0ee 100%)",
      }}
    >
      <div className="w-full max-w-lg animate-fade-in">
        <div className="flex justify-center mb-6">
          <WiesocLogo size="lg" tint="#ebf0fc" />
        </div>
        <div
          className="rounded-2xl p-8 shadow-xl"
          style={{
            background:
              "linear-gradient(135deg, #f0f2fc 0%, #e8f0fa 50%, #f5f0fd 100%)",
            border: "1px solid #eef1fb",
          }}
        >
          <h2
            className="text-2xl font-bold mb-1"
            style={{ color: "#1e1f3a" }}
          >
            Create account
          </h2>
          <p className="mb-6" style={{ color: "#6b6f9e" }}>
            Join WIESOC and start logging your hours
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
            <Field label="Full name" icon={User}>
              <input
                type="text"
                value={form.fullName}
                onChange={set("fullName")}
                placeholder="Jane Smith"
                className="w-full pl-10 pr-4 py-3 rounded-xl border text-sm outline-none transition-all"
                style={inputStyle}
                onFocus={focusStyle}
                onBlur={blurStyle}
              />
            </Field>

            <div className="grid grid-cols-2 gap-4">
              <Field label="Student ID" icon={Hash}>
                <input
                  type="text"
                  value={form.studentId}
                  onChange={set("studentId")}
                  placeholder="S012345"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border text-sm outline-none transition-all"
                  style={inputStyle}
                  onFocus={focusStyle}
                  onBlur={blurStyle}
                />
              </Field>
              <Field label="Email address" icon={Mail}>
                <input
                  type="email"
                  value={form.email}
                  onChange={set("email")}
                  placeholder="you@uni.edu"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border text-sm outline-none transition-all"
                  style={inputStyle}
                  onFocus={focusStyle}
                  onBlur={blurStyle}
                />
              </Field>
            </div>

            <Field label="Degree" icon={GraduationCap}>
              <select
                value={form.degree}
                onChange={set("degree")}
                className="w-full pl-10 pr-4 py-3 rounded-xl border text-sm outline-none transition-all appearance-none"
                style={inputStyle}
                onFocus={focusStyle}
                onBlur={blurStyle}
              >
                <option value="">Select your degree</option>
                {DEGREES.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </Field>

            <div>
              <label
                className="block text-sm font-medium mb-1.5"
                style={{ color: "#1e1f3a" }}
              >
                Password
              </label>
              <div className="relative">
                <Lock
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2"
                  style={{ color: "#9396d4" }}
                />
                <input
                  type={showPass ? "text" : "password"}
                  value={form.password}
                  onChange={set("password")}
                  placeholder="Min. 8 characters"
                  className="w-full pl-10 pr-10 py-3 rounded-xl border text-sm outline-none transition-all"
                  style={inputStyle}
                  onFocus={focusStyle}
                  onBlur={blurStyle}
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
              Create account
            </button>
          </form>

          <p
            className="text-center mt-4 text-sm"
            style={{ color: "#6b6f9e" }}
          >
            Already have an account?{" "}
            <button
              onClick={() => onNavigate("login")}
              className="font-semibold"
              style={{ color: "#9396d4" }}
            >
              Sign in
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}