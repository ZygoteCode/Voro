import { useEffect, useState, useCallback, useContext } from "react";
import { motion } from "framer-motion";
import { Sun, Moon, Eye, EyeOff, Lock, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import API from '../../utils/ApiUtils';
import { AuthContext } from "../../utils/AuthContext";

const container = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { staggerChildren: 0.04 } },
};
  
const item = {
  hidden: { opacity: 0, y: 8 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } },
};

export default function LoginScreen() {
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

  const [form, setForm] = useState({ username: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const { login, token } = useContext(AuthContext);

  useEffect(() => {
    if (token) {
      navigate("/app");
    }
  }, [token, navigate]);

  const validate = useCallback(() => {
    if (!form.username) return "Please enter your username.";
    if (form.username.length < 3) return "Username must be at least 3 characters.";
    if (!form.password) return "Please enter your password.";
    if (form.password.length < 6) return "Password must be at least 6 characters.";
    return "";
  }, [form]);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    setError("");
    const v = validate();
    if (v) return setError(v);
    setLoading(true);

    try {
      const { data } = await API.post("/login", { username: form.username, password: form.password });
      const token = data.token;
      login(token);
      navigate("/app");
    } catch {
      setError("Invalid username or password.");
    } finally {
      setLoading(false);
    }
  }, [validate, form, login, navigate]);

  return (
    <div
      className={
        `min-h-screen flex items-center justify-center p-6 transition-colors duration-300 relative overflow-hidden ` +
        (dark ? "bg-[#071025] text-white" : "bg-gradient-to-br from-[#E9F2FF] via-white to-[#E6F0FF] text-[#0F1724]")
      }
    >
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

      {!dark && (
        <div className="pointer-events-none absolute inset-0 -z-10">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 60, ease: "linear" }}
            className="absolute -top-20 -left-20 w-96 h-96 rounded-full opacity-18 bg-gradient-to-tr from-[#1877F2] to-[#73A6FF] blur-3xl"
          />
          <motion.div
            animate={{ x: [0, 40, 0], y: [0, -20, 0] }}
            transition={{ repeat: Infinity, duration: 12, ease: "easeInOut" }}
            className="absolute -bottom-28 -right-20 w-80 h-80 rounded-full opacity-12 bg-gradient-to-br from-[#1C5DB6] to-[#4EA1FF] blur-2xl"
          />
        </div>
      )}

      <motion.div
        initial={{ scale: 0.995, opacity: 0 }}
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
          <motion.div variants={item} className="flex items-center gap-3">
            <div className={dark ? "p-2 rounded-lg bg-white/6" : "p-2 rounded-lg bg-white shadow-sm"}>
              <img src="/voro.png" width="44" height="44" alt="Voro" />
            </div>
            <div>
              <h1 className="text-3xl font-semibold">Welcome back</h1>
              <p className={dark ? "text-[#A7B4C7]" : "text-[#334155]"}>Sign in and pick up where you left off.</p>
            </div>
          </motion.div>

          <motion.div variants={item} className={dark ? "text-[#CBD7EA]" : "text-[#0F1724]/90"}>
            <p className="mb-3">Access your personalised feed, settings and more.</p>
            <ul className="text-sm space-y-2 list-inside">
              <li>• Fast secure sign in</li>
              <li>• Remembered devices</li>
              <li>• Stellar micro-interactions</li>
            </ul>
          </motion.div>

          {!dark && <motion.div variants={item} className="absolute -top-16 -left-16 w-72 h-72 rounded-full opacity-20 bg-gradient-to-tr from-[#1877F2] to-[#73A6FF] blur-3xl" />}
        </motion.div>

        <motion.div className="p-8 md:p-12 flex items-center justify-center">
          <motion.form variants={container} initial="hidden" animate="show" onSubmit={handleSubmit} className="w-full max-w-md">
            <motion.h2 variants={item} className="text-2xl font-bold mb-2">Sign in</motion.h2>
            <motion.p variants={item} className={dark ? "text-[#A7B4C7] mb-6" : "text-[#475569] mb-6"}>
              Enter your username and password to continue.
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
                  placeholder="••••••••"
                />
                <button type="button" onClick={() => setShowPassword((s) => !s)} className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-md opacity-80 cursor-pointer">
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              {error && <div className="text-sm text-red-400 py-1">{error}</div>}

              <button
                type="submit"
                disabled={loading}
                className={
                  `w-full mt-2 py-3 rounded-lg font-semibold cursor-pointer 
                  bg-[#1877F2] text-white btn-2025`
                }
              >
                {loading ? "Signing in..." : "Login into your account"}
              </button>

              <div className="text-center text-xs text-[#64748B] mt-3">
                <span>Don’t have an account? </span>
                <a href="#" className="link-futuristic" onClick={() => navigate("/register")}>Sign up</a>
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