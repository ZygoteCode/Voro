import { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Sun, Moon, Home, Bug } from "lucide-react";

export default function NotFoundScreen({ onBack }) {
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

  const handleBack = useCallback(() => {
    if (onBack) return onBack();
    if (window.history && window.history.length > 1) return window.history.back();
    window.location.href = "/";
  }, [onBack]);

  const bg = dark
    ? "bg-gradient-to-br from-[#020617] via-[#071025] to-[#05102a] text-white"
    : "bg-gradient-to-br from-[#E9F2FF] via-white to-[#E6F0FF] text-[#0F1724]";

  return (
    <div className={`min-h-screen p-6 flex items-center justify-center relative overflow-hidden ${bg}`}>
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
        aria-hidden
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="absolute inset-0 -z-10"
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 45, ease: "linear" }}
          className={`absolute -left-40 -top-48 w-[520px] h-[520px] rounded-full ${dark ? "bg-gradient-to-tr from-[#0f1730] to-[#0b2b53] opacity-30" : "bg-gradient-to-tr from-[#1877F2] to-[#73A6FF] opacity-18"} blur-3xl`}
        />
        <motion.div
          animate={{ x: [0, 60, 0], y: [0, -30, 0] }}
          transition={{ repeat: Infinity, duration: 14, ease: "easeInOut" }}
          className={`absolute -right-28 -bottom-36 w-[360px] h-[360px] rounded-full ${dark ? "bg-gradient-to-br from-[#1b2a44] to-[#0b1a2b] opacity-20" : "bg-gradient-to-br from-[#1C5DB6] to-[#4EA1FF] opacity-12"} blur-2xl`}
        />
      </motion.div>

      <motion.main
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className={`relative w-full max-w-4xl rounded-3xl p-8 md:p-12 shadow-2xl backdrop-blur-md ${dark ? "bg-white/4 border border-white/8" : "bg-white/90"}`}
      >
        <div className="flex flex-col md:flex-row items-center gap-8">
          <div className="flex-1 flex items-center justify-center">
            <div className="relative">
              <motion.h1
                initial={{ y: -12, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ type: "spring", stiffness: 220, damping: 22 }}
                className={`text-[clamp(48px,8vw,130px)] leading-none font-extrabold tracking-tight ${dark ? "text-white" : "text-[#0F1724]"}`}
              >
                <span className="glitch">404</span>
              </motion.h1>

              <motion.span
                aria-hidden
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.15 }}
                className={`absolute inset-0 flex items-end justify-center pointer-events-none`}
                style={{ bottom: -12 }}
              >
                <span className={`block w-40 h-1 rounded-full ${dark ? "bg-gradient-to-r from-[#73A6FF] to-[#8BE1FF] opacity-60" : "bg-gradient-to-r from-[#1877F2] to-[#73A6FF] opacity-40"}`}></span>
              </motion.span>

              <motion.div
                animate={{ y: [0, -18, 0], rotate: [0, 6, 0] }}
                transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                className="absolute -right-20 -top-12 w-28 h-28"
                aria-hidden
              >
                <svg viewBox="0 0 64 64" className="w-full h-full">
                  <g>
                    <motion.ellipse cx="32" cy="38" rx="18" ry="6" fill={dark ? "#0b2b53" : "#eaf6ff"} opacity="0.85" />
                    <motion.path d="M20 30 C22 18, 42 18, 44 30 C42 32, 22 32, 20 30 Z" fill={dark ? "#73A6FF" : "#1C5DB6"} opacity="0.95" />
                    <circle cx="32" cy="26" r="3" fill={dark ? "#DFF6FF" : "#FFFFFF"} />
                  </g>
                </svg>
              </motion.div>
            </div>
          </div>

          <div className="flex-1">
            <motion.h2 initial={{ x: 8, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.12 }} className="text-2xl font-semibold mb-2">
              Page not found
            </motion.h2>
            <motion.p initial={{ x: 8, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.18 }} className={`mb-4 ${dark ? "text-[#A7B4C7]" : "text-[#475569]"}`}>
              Oops — we couldn't find the page you're looking for. The universe is vast and sometimes links disappear into
              the void. But don't worry: we'll help you get back on track.
            </motion.p>

            <motion.ul initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.28 }} className={`mb-6 ${dark ? "text-[#C7D8EE]" : "text-[#334155]"} list-disc pl-5 space-y-2`}>
              <li>Check the URL for typos or missing segments.</li>
              <li>Try searching from the homepage or using the navigation.</li>
              <li>If you think this is an error, report it and we'll investigate.</li>
            </motion.ul>

            <div className="flex flex-wrap gap-3">
              <button
                onClick={handleBack}
                className={`inline-flex items-center gap-2 py-3 px-4 rounded-lg font-semibold transition shadow cursor-pointer hover:bg-gray-500 ${dark ? "bg-white/6 text-white" : "bg-white text-[#0F1724] border"}`}
                aria-label="Go back"
              >
                <ArrowLeft size={16} />
                Go back
              </button>

              <button
                onClick={() => window.open("https://github.com/ZygoteCode/Voro/issues", "_blank")}
                className={`inline-flex btn-2025 items-center gap-2 py-3 px-4 rounded-lg font-semibold transition shadow cursor-pointer ${dark ? "bg-[#1877F2] text-white" : "bg-[#1877F2] text-white"}`}
                aria-label="Go home"
              >
                <Bug size={16} />
                Report issue
              </button>
            </div>

            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35 }} className={`mt-6 text-xs ${dark ? "text-[#9FB0CE]" : "text-[#64748B]"}`}>
              <p>
                If you landed here from a saved link, it's possible the resource was moved or removed. Use the Go back button to
                return to a safe place, or open a issue in GitHub for help.
              </p>
            </motion.div>
          </div>
        </div>

        <div className="mt-8 text-center text-xs opacity-80 text-[#94A3B8]">© {new Date().getFullYear()} <a href="#" className="link-futuristic" onClick={() => window.open("https://github.com/ZygoteCode/", "_blank")}>ZygoteCode</a> — All rights reserved.</div>
      </motion.main>

      <style>{`
        .glitch {
          position: relative;
          display: inline-block;
        }
        .glitch::before, .glitch::after {
          content: "404";
          position: absolute;
          left: 0;
          top: 0;
          width: 100%;
          overflow: hidden;
          clip: rect(0, 9999px, 0, 0);
        }
        .glitch::before {
          clip: rect(0, 9999px, 40%, 0);
          transform: translate(2px, -2px);
          opacity: 0.7;
          color: #73A6FF;
        }
        .glitch::after {
          clip: rect(60%, 9999px, 100%, 0);
          transform: translate(-2px, 2px);
          opacity: 0.6;
          color: #8BE1FF;
        }
        @keyframes floaty {
          0% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
          100% { transform: translateY(0); }
        }
        .floaty { animation: floaty 3.6s ease-in-out infinite; }
        .blur-3xl { filter: blur(48px); }
      `}</style>
    </div>
  );
}