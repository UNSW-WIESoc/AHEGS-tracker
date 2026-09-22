import { useState } from "react";
import type { Page, Role, User } from "../../types";
import WiesocLogo from "../shared/WiesocLogo";
import {
  User as UserIcon,
  Hash,
  Mail,
  Lock,
  GraduationCap,
  Eye,
  EyeOff, 
  Users, 
  Building2
} from "lucide-react";

import { auth, db } from "../../firebase";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

interface Props {
  onNavigate: (p: Page) => void;
  onRegisterStart: () => void;
  onRegisterComplete: (profile: User) => void;
  onRegisterError:() => void;
}

const TABS: { role: Role; label: string; icon: React.ElementType }[] = [
  { role: "student", label: "Student", icon: GraduationCap },
  { role: "mentor",  label: "Mentor",  icon: Users }
];

const inputStyle = { border: "1.5px solid #dde2f5", background: "#fff", color: "#1e1f3a" };
const inputClass = "w-full pl-10 pr-4 py-3 rounded-xl border text-sm outline-none transition-all";

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
  onNavigate,
  onRegisterStart,
  onRegisterComplete,
  onRegisterError
}: Props) {
  const [role, setRole] = useState<Role>("student");
  const [studentForm, setStudentForm] = useState({ 
    fullName: "", 
    zID: "", 
    email: "", 
    password: "", 
  });
  const [mentorForm, setMentorForm] = useState({ 
    fullName: "", 
    email: "", 
    password: "",
    company: "" });
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const switchRole = (r: Role) => { setRole(r); setError(""); };

  const focusFn = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => {
    e.target.style.borderColor = "#9396d4";
    e.target.style.boxShadow = "0 0 0 3px rgba(147,150,212,0.15)";
  };
  const blurFn = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => {
    e.target.style.borderColor = "#dde2f5";
    e.target.style.boxShadow = "none";
  };

  const setS = (k: keyof typeof studentForm) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setStudentForm(f => ({ ...f, [k]: e.target.value }));
  const setM = (k: keyof typeof mentorForm) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setMentorForm(f => ({ ...f, [k]: e.target.value }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    onRegisterStart();
    if (role === "student") {
      const { fullName, zID, email, password } = studentForm;
      if (!fullName || !zID || !email || !password) { 
        setError("Please fill in all fields."); 
        return; 
      }
      if (password.length < 8) { 
        setError("Password must be at least 8 characters."); 
        return; 
      }
    } else {
      const { fullName, email, password } = mentorForm;
      if (!fullName || !email || !password) { 
        setError("Please fill in all fields."); 
        return; 
      }
      if (password.length < 8) { 
        setError("Password must be at least 8 characters."); 
        return; 
      }
    }
    setError("");
    setSubmitting(true);

    try {
      let profile: User;
      if (role === "student") {
        const { fullName, zID, email, password } = studentForm;
        const credential = await createUserWithEmailAndPassword(auth, email, password);
        const firebaseUser = credential.user;

        await updateProfile(firebaseUser, { displayName: fullName });

        profile = {
          id: firebaseUser.uid,
          fullName,
          studentId: zID,
          email,
          role: "student",
        }
        await setDoc(doc(db, "users", firebaseUser.uid), profile);
      } else {
        const { fullName, email, password } = mentorForm;
        const credential = await createUserWithEmailAndPassword(auth, email, password);
        const firebaseUser = credential.user;

        await updateProfile(firebaseUser, { displayName: fullName });

        profile = {
          id: firebaseUser.uid,
          fullName,
          email,
          role: "mentor",
        }
        await setDoc(doc(db, "users", firebaseUser.uid), profile);
      }

      onNavigate("login");
      onRegisterComplete(profile);
    } catch (err: any) {
      console.error(err);
      onRegisterError();
      if (err.code === "auth/email-already-in-use") {
        setError("An account with that email already exists.");
      } else if (err.code === "auth/invalid-email") {
        setError("That email address looks invalid.");
      } else if (err.code === "auth/weak-password") {
        setError("Password is too weak. Use at least 8 characters.");
      } else {
        setError("Something went wrong creating your account. Please try again.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  const passwordValue = role === "student" ? studentForm.password : mentorForm.password;
  const passwordOnChange = role === "student" ? setS("password") : setM("password") as any;

  return (
    <div 
      className="min-h-screen flex items-center justify-center p-6"
      style={{
        background: "linear-gradient(160deg, #9396d4 0%, #a3b5df 100%)",
      }}
    >
      <div className="w-full max-w-lg animate-fade-in">
        <div className="flex justify-center mb-6">
          <WiesocLogo size="lg" tint="#ebf0fc" />
        </div>

        <div 
          className="rounded-2xl p-8 shadow-xl"
          style={{ 
            background: "#f0f2fc",
            //"linear-gradient(135deg, #f0f2fc 0%, #e8f0fa 50%, #f5f0fd 100%)", 
            border: "1px solid #eef1fb" 
          }}
        >

          <h2 className="text-2xl font-bold mb-1" style={{ color: "#1e1f3a" }}>
            Create account
          </h2>
          <p className="mb-5" style={{ color: "#6b6f9e" }}>
            Join WIESOC and get started
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

          {error && (
            <div 
              className="mb-4 p-3 rounded-lg text-sm" 
              style={{ background: "#fef2f2", color: "#b91c1c", border: "1px solid #fecaca" }}
            >
              {error}
            </div>
          )}

          <form onSubmit={submit} className="space-y-4">
            {/* ── Student fields ── */}
            {role === "student" && (
              <>
                <Field label="Full name" icon={UserIcon}>
                  <input 
                    type="text" 
                    value={studentForm.fullName} 
                    onChange={setS("fullName")} placeholder="Jane Smith"
                    className={inputClass} style={inputStyle} 
                    onFocus={focusFn} 
                    onBlur={blurFn} 
                  />
                </Field>
                <div className="grid grid-cols-2 gap-4">
                  <Field label="zID" icon={Hash}>
                    <input 
                      type="text" 
                      value={studentForm.zID} 
                      onChange={setS("zID")} 
                      placeholder="S012345"
                      className={inputClass} 
                      style={inputStyle} 
                      onFocus={focusFn} 
                      onBlur={blurFn} 
                    />
                  </Field>
                  <Field label="Email address" icon={Mail}>
                    <input 
                      type="email" 
                      value={studentForm.email} 
                      onChange={setS("email")} 
                      placeholder="you@uni.edu"
                      className={inputClass} 
                      style={inputStyle} 
                      onFocus={focusFn} 
                      onBlur={blurFn} 
                    />
                  </Field>
                </div>
              </>
            )}

            {/* ── Mentor fields ── */}
            {role === "mentor" && (
              <>
                <Field label="Full name" icon={UserIcon}>
                  <input 
                    type="text" 
                    value={mentorForm.fullName} 
                    onChange={setM("fullName")} 
                    placeholder="Jane Smith"
                    className={inputClass} style={inputStyle} 
                    onFocus={focusFn} onBlur={blurFn} 
                  />
                </Field>
                <Field label="Email address" icon={Mail}>
                  <input 
                    type="email" 
                    value={mentorForm.email} 
                    onChange={setM("email")} 
                    placeholder="jane@company.com"
                    className={inputClass} 
                    style={inputStyle} 
                    onFocus={focusFn} 
                    onBlur={blurFn} 
                  />
                </Field>
                <div className="grid grid-cols-2 gap-4">
                  <Field label="Company / Organisation" icon={Building2}>
                    <input 
                      type="text" 
                      value={mentorForm.company} 
                      onChange={setM("company")} 
                      placeholder="e.g. Atlassian"
                      className={inputClass} 
                      style={inputStyle} 
                      onFocus={focusFn} 
                      onBlur={blurFn} 
                    />
                  </Field>
                </div>
              </>
            )}

            {/* Shared password field */}
            <div>
              <label 
                className="block text-sm font-medium mb-1.5" style={{ color: "#1e1f3a" }}
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
                  value={passwordValue} 
                  onChange={passwordOnChange}
                  placeholder="Min. 8 characters"
                  className="w-full pl-10 pr-10 py-3 rounded-xl border text-sm outline-none transition-all"
                  style={inputStyle} 
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

            <button 
              type="submit" 
              disabled={submitting}
              className="w-full py-3 rounded-xl font-semibold text-sm text-white transition-all hover:opacity-90 active:scale-[0.98] mt-2 disabled:opacity-60"
              style={{
                background: "#9396d4"
                  // "linear-gradient(135deg, #9396d4, #7b7fc4)",
              }}
            >
              {submitting ? "Creating account..." : "Create account"}
            </button>
          </form>

          <p className="text-center mt-4 text-sm" style={{ color: "#6b6f9e" }}>
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