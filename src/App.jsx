import { useMemo, useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

// --- Deterministic score function (stable across renders)
function scoreFromNames(a = "", b = "") {
  const norm = (s) => s.trim().toLowerCase().replace(/\s+/g, "");
  const s = norm(a) + "♥" + norm(b);
  let hash = 0;
  for (let i = 0; i < s.length; i++) {
    hash = (hash * 31 + s.charCodeAt(i)) >>> 0;
  }
  return hash % 101; // 0–100
}

export default function App() {
  const [you, setYou] = useState("");
  const [crush, setCrush] = useState("");
  const [result, setResult] = useState(null);
  const [burst, setBurst] = useState([]); // celebratory hearts
  const inputYouRef = useRef(null);

  const canCalc = you.trim() && crush.trim();

  // Score-based theme
  const theme = useMemo(() => {
    if (result === null) {
      return {
        bg: "from-rose-50 via-pink-50 to-white",
        bar: "from-rose-400 to-pink-500",
        ring: "focus:ring-rose-200 focus:border-rose-300",
        btn: "bg-rose-500 hover:bg-rose-600",
        chip: "bg-rose-100 text-rose-700",
        accentText: "text-rose-600",
      };
    }
    if (result >= 80) {
      return {
        bg: "from-fuchsia-50 via-violet-50 to-white",
        bar: "from-fuchsia-400 to-violet-500",
        ring: "focus:ring-fuchsia-200 focus:border-fuchsia-300",
        btn: "bg-fuchsia-600 hover:bg-fuchsia-700",
        chip: "bg-fuchsia-100 text-fuchsia-700",
        accentText: "text-fuchsia-600",
      };
    }
    if (result >= 50) {
      return {
        bg: "from-rose-50 via-amber-50 to-white",
        bar: "from-rose-400 to-amber-500",
        ring: "focus:ring-amber-200 focus:border-amber-300",
        btn: "bg-amber-500 hover:bg-amber-600",
        chip: "bg-amber-100 text-amber-700",
        accentText: "text-amber-600",
      };
    }
    return {
      bg: "from-sky-50 via-indigo-50 to-white",
      bar: "from-sky-400 to-indigo-500",
      ring: "focus:ring-sky-200 focus:border-sky-300",
      btn: "bg-indigo-600 hover:bg-indigo-700",
      chip: "bg-indigo-100 text-indigo-700",
      accentText: "text-indigo-600",
    };
  }, [result]);

  const verdict = useMemo(() => {
    if (result === null) return { label: "Curious? Try a match!", emoji: "💘" };
    if (result >= 90) return { label: "Soulmate energy", emoji: "💞" };
    if (result >= 80) return { label: "Perfect match", emoji: "💖" };
    if (result >= 65) return { label: "There\u2019s potential", emoji: "✨" };
    if (result >= 50) return { label: "Give it a shot", emoji: "🌟" };
    if (result >= 30) return { label: "Could be friends", emoji: "🌸" };
    return { label: "Maybe not the vibe", emoji: "🫧" };
  }, [result]);

  const handleCalculate = () => {
    if (!canCalc) return;
    const score = scoreFromNames(you, crush);
    setResult(score);

    // trigger a celebratory burst of hearts
    const pieces = Array.from({ length: Math.min(24, 6 + Math.floor(score / 5)) }, (_, i) => ({
      id: i + "-" + Date.now(),
      x: (Math.random() * 60 - 30), // -30% to 30%
      rot: (Math.random() * 40 - 20),
      delay: Math.random() * 0.1,
      scale: 0.8 + Math.random() * 0.8,
    }));
    setBurst(pieces);
  };

  const swap = () => {
    setYou(crush);
    setCrush(you);
    inputYouRef.current?.focus();
  };

  const randomize = () => {
    const sample = [
      "Alex", "Sam", "Riley", "Taylor", "Jordan", "Casey", "Jamie", "Avery", "Quinn", "Morgan",
    ];
    const pick = () => sample[Math.floor(Math.random() * sample.length)];
    setYou(pick());
    setCrush(pick());
  };

  // Keyboard: Enter to calculate
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Enter") handleCalculate();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [you, crush]);

  // Floating background hearts (ambient)
  const floaters = useMemo(() => {
    const seeds = [
      { x: "10%", size: 18, delay: 0 },
      { x: "25%", size: 12, delay: 1.2 },
      { x: "40%", size: 16, delay: 0.6 },
      { x: "60%", size: 14, delay: 0.3 },
      { x: "75%", size: 20, delay: 1.8 },
      { x: "90%", size: 12, delay: 0.9 },
    ];
    return seeds;
  }, []);

  return (
    <div className={`min-h-screen relative overflow-hidden bg-gradient-to-b ${theme.bg} text-gray-900`}>
      {/* Soft vignette */}
      <div className="pointer-events-none absolute inset-0 opacity-60 mix-blend-multiply" aria-hidden>
        <div className="absolute -top-32 -left-32 h-72 w-72 rounded-full bg-white blur-3xl" />
        <div className="absolute -bottom-24 -right-24 h-80 w-80 rounded-full bg-white blur-3xl" />
      </div>

      {/* Floating heart ambient layer */}
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        {floaters.map((f, i) => (
          <motion.div
            key={i}
            className="absolute"
            style={{ left: f.x }}
            initial={{ y: "110vh", opacity: 0 }}
            animate={{ y: ["110vh", "-20vh"], opacity: [0, 1, 0] }}
            transition={{ duration: 18 + i * 1, repeat: Infinity, delay: f.delay, ease: "easeInOut" }}
          >
            <HeartSVG size={f.size} className="opacity-40" />
          </motion.div>
        ))}
      </div>

      <header className="mx-auto max-w-2xl px-4 py-10">
        <motion.h1
          className="text-3xl sm:text-4xl font-semibold text-center"
          initial={{ y: 12, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 120, damping: 14 }}
        >
          Love Calculator <span className={`${theme.accentText}`}>Deluxe</span>
        </motion.h1>
        <motion.p
          className="mt-2 text-center text-sm text-gray-600"
          initial={{ y: 8, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.05 }}
        >
          Enter names and let the sparks fly {verdict.emoji}
        </motion.p>
      </header>

      <main className="mx-auto max-w-2xl px-4">
        <motion.div
          className="relative rounded-2xl border border-white/40 bg-white/70 backdrop-blur p-6 shadow-sm"
          initial={{ scale: 0.98, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 120, damping: 14 }}
        >
          {/* Cute ribbon */}
          <div className="absolute -top-3 left-4">
            <span className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs ${theme.chip}`}>
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-current" />
              {verdict.label}
            </span>
          </div>

          {/* Inputs */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-600">Your name</label>
              <input
                ref={inputYouRef}
                value={you}
                onChange={(e) => setYou(e.target.value)}
                placeholder="e.g. Alex"
                className={`w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm outline-none ${theme.ring}`}
                aria-label="Your name"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-600">Their name</label>
              <input
                value={crush}
                onChange={(e) => setCrush(e.target.value)}
                placeholder="e.g. Sam"
                className={`w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm outline-none ${theme.ring}`}
                aria-label="Their name"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
            <motion.button
              onClick={handleCalculate}
              disabled={!canCalc}
              whileTap={{ scale: canCalc ? 0.98 : 1 }}
              className={`rounded-xl px-6 py-2.5 text-sm font-medium text-white transition focus:outline-none ${
                canCalc ? `${theme.btn} shadow-sm` : "bg-gray-200 text-gray-500 cursor-not-allowed"
              }`}
            >
              Reveal Love <span aria-hidden>❤️</span>
            </motion.button>
            <button
              type="button"
              onClick={swap}
              className="rounded-xl bg-white px-3 py-2 text-xs font-medium text-gray-700 shadow-sm ring-1 ring-gray-200 hover:bg-gray-50"
            >
              Swap ↔︎
            </button>
            <button
              type="button"
              onClick={randomize}
              className="rounded-xl bg-white px-3 py-2 text-xs font-medium text-gray-700 shadow-sm ring-1 ring-gray-200 hover:bg-gray-50"
            >
              I\'m feeling lucky ✨
            </button>
            <button
              type="button"
              onClick={() => { setYou(""); setCrush(""); setResult(null); inputYouRef.current?.focus(); }}
              className="rounded-xl bg-white px-3 py-2 text-xs font-medium text-gray-700 shadow-sm ring-1 ring-gray-200 hover:bg-gray-50"
            >
              Clear
            </button>
          </div>

          {/* Result */}
          <AnimatePresence mode="wait">
            {result !== null && (
              <motion.div
                key={result}
                initial={{ y: 16, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -16, opacity: 0 }}
                transition={{ type: "spring", stiffness: 120, damping: 14 }}
                className="mt-6 rounded-xl border border-rose-100 bg-white/80 p-5"
              >
                <div className="flex items-center gap-3">
                  <motion.div
                    initial={{ scale: 0.9 }}
                    animate={{ scale: [1, 1.08, 1] }}
                    transition={{ repeat: Infinity, duration: 1.6 }}
                  >
                    <HeartSVG className={`${theme.accentText}`} />
                  </motion.div>
                  <div>
                    <p className="text-xs uppercase tracking-wide text-gray-500">Compatibility</p>
                    <p className="text-lg font-semibold">{result}%</p>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="mt-4">
                  <div className="h-2 w-full rounded-full bg-gray-100">
                    <motion.div
                      className={`h-2 rounded-full bg-gradient-to-r ${theme.bar}`}
                      initial={{ width: 0 }}
                      animate={{ width: `${result}%` }}
                      transition={{ duration: 0.8, ease: "easeOut" }}
                    />
                  </div>
                  <p className="mt-2 text-xs text-gray-600">
                    {result >= 80
                      ? "Perfect match! "
                      : result >= 50
                      ? "There’s potential—go for it "
                      : "Hmm… maybe just friends "}
                    {verdict.emoji}
                  </p>
                </div>

                {/* Mini tips */}
                <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-3">
                  <Tip>Share a fun meme</Tip>
                  <Tip>Plan coffee this week</Tip>
                  <Tip>Ask their favorite song</Tip>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Heart burst */}
          <div className="pointer-events-none relative">
            <AnimatePresence>
              {burst.map((p) => (
                <motion.span
                  key={p.id}
                  initial={{ y: 0, x: 0, opacity: 0, rotate: 0, scale: 0.4 }}
                  animate={{ y: -120 - Math.random() * 60, x: p.x, opacity: [0, 1, 0], rotate: p.rot, scale: p.scale }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 1.2 + Math.random() * 0.6, ease: "easeOut", delay: p.delay }}
                  className="absolute left-1/2 top-0 -translate-x-1/2 select-none"
                  aria-hidden
                >
                  <span style={{ filter: "drop-shadow(0 1px 0 rgba(0,0,0,.06))" }}>💗</span>
                </motion.span>
              ))}
            </AnimatePresence>
          </div>
        </motion.div>

        <footer className="mx-auto max-w-xl py-6 text-center text-xs text-gray-500">
          Built for fun. Be kind & follow your heart.
        </footer>
      </main>
    </div>
  );
}

function Tip({ children }) {
  return (
    <div className="flex items-center gap-2 rounded-lg bg-white/70 px-3 py-2 text-xs text-gray-700 ring-1 ring-gray-100">
      <span aria-hidden>💡</span>
      <span>{children}</span>
    </div>
  );
}

function HeartSVG({ className = "fill-rose-500 drop-shadow", size = 24 }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      className={className}
      aria-hidden
    >
      <path d="M12 21s-6.716-4.287-9.428-7C.86 12.288.5 9.5 2.343 7.657a5 5 0 0 1 7.071 0L12 10.243l2.586-2.586a5 5 0 0 1 7.071 7.071C18.716 16.713 12 21 12 21z" />
    </svg>
  );
}
