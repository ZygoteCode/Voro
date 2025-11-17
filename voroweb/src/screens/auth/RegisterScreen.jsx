import { useEffect, useState, useCallback, useContext } from "react";
import { motion } from "framer-motion";
import { Sun, Moon, Eye, EyeOff, User, Lock, Check } from "lucide-react";
import { useNavigate } from "react-router-dom";
import API from '../../utils/ApiUtils';
import { AuthContext } from "../../utils/AuthContext";

const container = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { staggerChildren: 0.03 } },
};

const item = {
  hidden: { opacity: 0, y: 8 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } },
};

export default function RegisterScreen() {
  const [dark, setDark] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("prefersDark")) ?? false;
    } catch {
      return false;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem("prefersDark", JSON.stringify(dark));
    } catch {}
  }, [dark]);

  const [form, setForm] = useState({ username: "", password: "", confirm: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [agree, setAgree] = useState(false);
  const [error, setError] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { token } = useContext(AuthContext);

  useEffect(() => {
    if (token) {
      navigate("/app");
    }
  }, [token, navigate]);

  const strengthLabel = useCallback((password) => {
    if (!password) return "";
    const score = [/.{8,}/, /[A-Z]/, /[0-9]/, /[^A-Za-z0-9]/].reduce((s, rx) => s + (rx.test(password) ? 1 : 0), 0);
    return ["Weak", "Okay", "Good", "Strong"][Math.max(0, score - 1)];
  }, []);

  const validate = useCallback(() => {
    if (!form.username) return "Please enter your username.";
    if (form.username.length < 3 || form.username.length > 16) return "Username length must be between 3 and 16 characters.";
    if (!form.password) return "Please choose a password.";
    if (form.password.length < 8 || form.password.length > 60) return "Password length must be between 8 and 60 characters.";
    if (form.password !== form.confirm) return "Passwords do not match.";
    if (!agree) return "You must agree to the Terms and Conditions & Privacy Policy.";
    if (strengthLabel(form.password) !== "Strong") return "Password must be stronger.";
    return "";
  }, [agree, form, strengthLabel]);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    setError("");
    setStatus("");
    const v = validate();
    if (v) return setError(v);
    setLoading(true);

    try {
      await API.post("/register", { username: form.username, password: form.password });
      setStatus("Succesfully registered! You can now login into your account.");

      setForm({ username: "", password: "", confirm: "" });
      setAgree(false);
    } catch (err) {
      const statusCode = err.status;

      if (statusCode === 422) {
        setError("Password must be stronger.");
      } else if (statusCode === 409) {
        setError("Username is already registered.");
      } else if (statusCode === 400) {
        setError("Please put valid credentials.");
      } else {
        setError("Network error happened during registration.");
      }
    } finally {
      setLoading(false);
    }
  }, [form, validate]);

  return (
    <div className={
      `min-h-screen flex items-center justify-center p-6 transition-colors duration-300 relative overflow-hidden ` +
      (dark ? "bg-[#071025] text-white" : "bg-gradient-to-br from-[#E9F2FF] via-white to-[#E6F0FF] text-[#0F1724]")
    }>
      <button
        aria-label="Toggle theme"
        onClick={() => setDark((d) => !d)}
        className={
          `absolute cursor-pointer top-4 right-4 p-2 rounded-full shadow-md backdrop-blur-md transition-transform hover:scale-105 focus:outline-none ` +
          (dark ? "bg-white/6" : "bg-white/80")
        }
      >
        {dark ? <Sun size={18} /> : <Moon size={18} />}
      </button>

      <motion.div
        initial={{ scale: 0.99, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.45 }}
        className={
          `max-w-4xl w-full rounded-2xl shadow-2xl overflow-hidden grid grid-cols-1 md:grid-cols-2 backdrop-blur-md transition-all ` +
          (dark ? "bg-white/5 border border-white/8" : "bg-white/75")
        }
      >
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className={
            `relative p-10 md:p-12 flex flex-col gap-6 justify-center ` +
            (dark ? "bg-[#0F1724] text-white" : "bg-[#1877F2]/6 text-[#0F1724]")
          }
        >
          <motion.div variants={item} className="flex items-center gap-6">
            <div className={dark ? "p-2 rounded-lg bg-white/6" : "p-2 rounded-lg bg-white shadow-sm"}>
              <img src="/voro.png" width="64" height="64" alt="Voro" />
            </div>
            <div>
              <h1 className="text-3xl font-semibold">Create your account</h1>
              <p className={dark ? "text-[#A7B4C7]" : "text-[#334155]"}>Join Voro, the first centralized platform with open-source and verifiable privacy & security implementations.</p>
            </div>
          </motion.div>

          <motion.div variants={item} className={dark ? "text-[#CBD7EA]" : "text-[#0F1724]/90"}>
            <p className="mb-3">Why joining <span className="font-bold text-white">Voro</span>?</p>
            <ul className="text-sm space-y-2 list-inside">
              <li className="flex items-center gap-2"><Check size={14} /> End-to-end encrypted chats</li>
              <li className="flex items-center gap-2"><Check size={14} /> Solid and safe data infrastructure</li>
              <li className="flex items-center gap-2"><Check size={14} /> Respects your privacy, no data about you is stored</li>
              <li className="flex items-center gap-2"><Check size={14} /> Meet new friends and chat with your family safely</li>
              <li className="flex items-center gap-2"><Check size={14} /> Exchange files, photos and links with no worries</li>
              <li className="flex items-center gap-2"><Check size={14} /> Respects your privacy, no data about you is stored</li>
            </ul>
          </motion.div>

          {!dark && (
            <motion.div variants={item} className="absolute -top-16 -left-16 w-72 h-72 rounded-full opacity-20 bg-gradient-to-tr from-[#1877F2] to-[#73A6FF] blur-3xl" />
          )}
        </motion.div>

        <motion.div className="p-8 md:p-12 flex items-center justify-center">
          <motion.form variants={container} initial="hidden" animate="show" onSubmit={handleSubmit} className="w-full max-w-md">
            <motion.h2 variants={item} className="text-2xl font-bold mb-2">Sign up</motion.h2>
            <motion.p variants={item} className={dark ? "text-[#A7B4C7] mb-6" : "text-[#475569] mb-6"}>
              Create a secure account and get started.
            </motion.p>

            <motion.div variants={item} className="space-y-4">
              <label className="block text-xs font-medium">Username</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-3 flex items-center opacity-60"><User size={16} /></span>
                <input
                  value={form.username}
                  onChange={(e) => setForm((s) => ({ ...s, username: e.target.value }))}
                  className={
                    `w-full pl-10 pr-3 py-3 rounded-lg border bg-transparent outline-none transition ` +
                    (dark ? "border-white/20 focus:border-[#73A6FF]" : "border-[#E6EDF5] focus:border-[#1877F2] focus:ring-2 focus:ring-[#1877F2]/20")
                  }
                  placeholder="Your username"
                />
              </div>

              <label className="block text-xs font-medium">Password</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-3 flex items-center opacity-60"><Lock size={16} /></span>
                <input
                  type={showPassword ? "text" : "password"}
                  value={form.password}
                  onChange={(e) => setForm((s) => ({ ...s, password: e.target.value }))}
                  className={
                    `w-full pl-10 pr-12 py-3 rounded-lg border bg-transparent outline-none transition ` +
                    (dark ? "border-white/20 focus:border-[#73A6FF]" : "border-[#E6EDF5] focus:border-[#1877F2] focus:ring-2 focus:ring-[#1877F2]/20")
                  }
                  placeholder="Choose a password"
                />
                <button type="button" onClick={() => setShowPassword((s) => !s)} className="absolute cursor-pointer right-3 top-1/2 -translate-y-1/2 p-1 rounded-md opacity-80">
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-sm">Strength: <strong>{strengthLabel(form.password) || "No password"}</strong></span>
                <span className={dark ? "text-[#9FB0CE]" : "text-[#6B7280] text-sm"}>Use 8+ chars, mix types</span>
              </div>

              <label className="block text-xs font-medium">Confirm password</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-3 flex items-center opacity-60"><Lock size={16} /></span>
                <input
                  type={showConfirm ? "text" : "password"}
                  value={form.confirm}
                  onChange={(e) => setForm((s) => ({ ...s, confirm: e.target.value }))}
                  className={
                    `w-full pl-10 pr-12 py-3 rounded-lg border bg-transparent outline-none transition ` +
                    (dark ? "border-white/20 focus:border-[#73A6FF]" : "border-[#E6EDF5] focus:border-[#1877F2] focus:ring-2 focus:ring-[#1877F2]/20")
                  }
                  placeholder="Repeat your password"
                />
                <button type="button" onClick={() => setShowConfirm((s) => !s)} className="absolute cursor-pointer right-3 top-1/2 -translate-y-1/2 p-1 rounded-md opacity-80">
                  {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              <label className="inline-flex items-start gap-2 mt-2 text-sm">
                <input type="checkbox" checked={agree} onChange={(e) => setAgree(e.target.checked)} className="h-4 w-4 rounded border-white/20" />
                <span className={dark ? "text-[#CBD7EA]" : "text-[#475569]"}>I agree to the <a className="link-futuristic cursor-pointer" onClick={(e) => { e.preventDefault(); navigate("/terms-and-conditions") }}>Terms & Conditions</a> & <a className="link-futuristic cursor-pointer" onClick={(e) => { e.preventDefault(); navigate("/privacy-policy") }}>Privacy Policy</a>.</span>
              </label>

              {error && <div className="text-sm text-red-400 py-1">{error}</div>}
              {status && <div className="text-sm text-green-500 py-1">{status}</div>}

              <button
                type="submit"
                disabled={loading}
                className={
                  `w-full mt-2 py-3 rounded-lg font-semibold cursor-pointer 
                bg-[#1877F2] text-white btn-2025`
                }
              >
                {loading ? "Creating account..." : "Create account"}
              </button>

              <div className="text-center text-xs text-[#64748B] mt-3">
                <span>Already have an account? </span>
                <a href="#" className="link-futuristic" onClick={() => navigate("/login")}>Sign in</a>
              </div>
            </motion.div>

          </motion.form>
        </motion.div>
      </motion.div>

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-xs text-[#94A3B8]">© {new Date().getFullYear()} <a href="#" className="link-futuristic" onClick={() => window.open("https://github.com/ZygoteCode/", "_blank")}>ZygoteCode</a> — All rights reserved.</div>

      <style>{` .blur-3xl { filter: blur(48px); } `}</style>
    </div>
  );
}