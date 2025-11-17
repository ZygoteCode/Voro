import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Loader2, Rocket, Orbit } from "lucide-react";

export default function LoadingScreen() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setPhase((p) => (p + 1) % 3);
    }, 2200);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#E9F2FF] to-[#c5d8ff] dark:from-[#0a0f1c] dark:to-[#111827] text-black dark:text-white transition-colors duration-700 overflow-hidden relative p-6">
      <motion.div
        className="absolute top-10 left-10 w-32 h-32 rounded-full bg-blue-500/20 blur-3xl"
        animate={{ y: [0, 20, 0], x: [0, -10, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-10 right-10 w-40 h-40 rounded-full bg-indigo-500/20 blur-3xl"
        animate={{ y: [0, -25, 0], x: [0, 15, 0] }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="flex flex-col items-center gap-8 z-10">
        <AnimatePresence mode="wait">
          {phase === 0 && (
            <motion.div
              key="sparkles"
              initial={{ opacity: 0, scale: 0.6, rotate: -20 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              exit={{ opacity: 0, scale: 0.4, rotate: 20 }}
              transition={{ duration: 0.6 }}
              className="text-blue-600 dark:text-blue-400"
            >
              <Sparkles size={90} />
            </motion.div>
          )}

          {phase === 1 && (
            <motion.div
              key="rocket"
              initial={{ opacity: 0, y: 50, rotate: -15 }}
              animate={{ opacity: 1, y: 0, rotate: 0 }}
              exit={{ opacity: 0, y: -40, rotate: 15 }}
              transition={{ duration: 0.6 }}
              className="text-indigo-600 dark:text-indigo-400"
            >
              <Rocket size={90} />
            </motion.div>
          )}

          {phase === 2 && (
            <motion.div
              key="orbit"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1, rotate: 360 }}
              exit={{ opacity: 0, scale: 0.5 }}
              transition={{ duration: 1, ease: "easeInOut" }}
              className="text-purple-600 dark:text-purple-400"
            >
              <Orbit size={90} />
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1.3, ease: "linear" }}
          className="text-blue-700 dark:text-blue-300"
        >
          <Loader2 size={38} />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-4xl font-extrabold text-center drop-shadow-md"
        >
          Preparing something extraordinary
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-center max-w-xl text-lg opacity-80"
        >
          Voro is warming up the engines, aligning the sequences, synchronizing the experience.
          Hang tight — your journey continues in just a moment.
        </motion.p>
      </div>

      <motion.div
        className="absolute bottom-10 w-48 h-1 bg-blue-600/40 dark:bg-blue-300/40 rounded-full"
        animate={{ scaleX: [1, 0.3, 1] }}
        transition={{ repeat: Infinity, duration: 2.4, ease: "easeInOut" }}
      />
    </div>
  );
}