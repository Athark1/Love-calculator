import { useState } from "react";

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

  const canCalc = you.trim() && crush.trim();

  const handleCalculate = () => {
    if (!canCalc) return;
    const score = scoreFromNames(you, crush);
    setResult(score);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 via-rose-50 to-white text-gray-900">
      <header className="mx-auto max-w-2xl px-4 py-10">
        <h1 className="text-3xl sm:text-4xl font-semibold text-center">
          Love Calculator
        </h1>
        <p className="mt-2 text-center text-sm text-gray-600">
          Curious? Enter names and press the button 💘
        </p>
      </header>

      <main className="mx-auto max-w-2xl px-4">
        <div className="rounded-2xl border border-rose-100 bg-white/70 backdrop-blur p-6 shadow-sm">
          {/* Inputs */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-600">
                Your name
              </label>
              <input
                value={you}
                onChange={(e) => setYou(e.target.value)}
                placeholder="e.g. Alex"
                className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-rose-300 focus:ring-2 focus:ring-rose-200"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-600">
                Their name
              </label>
              <input
                value={crush}
                onChange={(e) => setCrush(e.target.value)}
                placeholder="e.g. Sam"
                className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-rose-300 focus:ring-2 focus:ring-rose-200"
              />
            </div>
          </div>

          {/* Calculate button */}
          <div className="mt-6 text-center">
            <button
              onClick={handleCalculate}
              disabled={!canCalc}
              className={`rounded-xl px-6 py-2.5 text-sm font-medium transition ${
                canCalc
                  ? "bg-rose-500 text-white hover:bg-rose-600 active:scale-[.98]"
                  : "bg-gray-200 text-gray-500 cursor-not-allowed"
              }`}
            >
              Reveal Love ❤️
            </button>
          </div>

          {/* Result (only after clicking) */}
          {result !== null && (
            <div className="mt-6 rounded-xl border border-rose-100 bg-white/80 p-5">
              <div className="flex items-center gap-3">
                <Heart beating />
                <div>
                  <p className="text-xs uppercase tracking-wide text-gray-500">
                    Compatibility
                  </p>
                  <p className="text-lg font-semibold">{result}%</p>
                </div>
              </div>

              {/* Progress bar */}
              <div className="mt-4">
                <div className="h-2 w-full rounded-full bg-gray-100">
                  <div
                    className="h-2 rounded-full bg-gradient-to-r from-rose-400 to-pink-500 transition-[width] duration-700 ease-out"
                    style={{ width: `${result}%` }}
                  />
                </div>
                <p className="mt-2 text-xs text-gray-500">
                  {result >= 80
                    ? "Perfect match! 💖"
                    : result >= 50
                    ? "There’s potential—go for it ✨"
                    : "Hmm… maybe just friends 🌸"}
                </p>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

function Heart({ beating }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={`h-6 w-6 ${
        beating ? "animate-pulse" : ""
      } fill-rose-500 drop-shadow`}
    >
      <path d="M12 21s-6.716-4.287-9.428-7C.86 12.288.5 9.5 2.343 7.657a5 5 0 0 1 7.071 0L12 10.243l2.586-2.586a5 5 0 0 1 7.071 7.071C18.716 16.713 12 21 12 21z" />
    </svg>
  );
}
