import { useEffect, useRef, useState } from "react";

const instruments = [
  {
    id: "kulintang",
    name: "Kulintang",
    type: "Metallic gong row",
    icon: "🔔",
    notes: [392, 440, 523, 587],
    wave: "triangle",
    context: "A gong ensemble tradition from the southern Philippines and Mindanao.",
    scale: "Pentatonic-like melodic pattern",
  },
  {
    id: "kubing",
    name: "Kubing",
    type: "Bamboo jaw harp",
    icon: "🎋",
    notes: [196, 247, 294],
    wave: "sawtooth",
    context: "A bamboo jaw harp played by several Philippine ethnolinguistic groups.",
    scale: "Overtone-driven, rhythmic pattern",
  },
  {
    id: "kudyapi",
    name: "Kudyapi",
    type: "Two-stringed lute",
    icon: "🪕",
    notes: [196, 247, 294, 392],
    wave: "triangle",
    context: "A boat-shaped lute associated with Mindanao and Palawan traditions.",
    scale: "Modal, drone-based pattern",
  },
  {
    id: "tongali",
    name: "Tongali",
    type: "Bamboo nose flute",
    icon: "🌬️",
    notes: [523, 587, 659, 784],
    wave: "sine",
    context: "A nose flute associated with Kalinga and other Cordillera communities.",
    scale: "Pentatonic melodic pattern",
  },
];

const TOTAL_DURATION = 1.6;

export default function SoundsDemo() {
  const [selected, setSelected] = useState(instruments[0]);
  const [playing, setPlaying] = useState(false);
  const [audioError, setAudioError] = useState("");
  const contextRef = useRef(null);
  const timerRef = useRef(null);

  useEffect(() => {
    return () => {
      window.clearTimeout(timerRef.current);
      contextRef.current?.close().catch(() => {});
    };
  }, []);

  const play = async () => {
    setAudioError("");
    try {
      if (!contextRef.current) {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (!AudioContext) throw new Error("Web Audio is not supported in this browser.");
        contextRef.current = new AudioContext();
      }

      const context = contextRef.current;
      if (context.state === "suspended") await context.resume();

      const start = context.currentTime + 0.05;
      selected.notes.forEach((frequency, index) => {
        const noteStart = start + index * 0.24;
        const oscillator = context.createOscillator();
        const gain = context.createGain();

        oscillator.type = selected.wave;
        oscillator.frequency.setValueAtTime(frequency, noteStart);
        gain.gain.setValueAtTime(0.0001, noteStart);
        gain.gain.exponentialRampToValueAtTime(0.12, noteStart + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, noteStart + 0.55);

        oscillator.connect(gain);
        gain.connect(context.destination);
        oscillator.start(noteStart);
        oscillator.stop(noteStart + 0.6);
      });

      setPlaying(true);
      window.clearTimeout(timerRef.current);
      timerRef.current = window.setTimeout(() => setPlaying(false), TOTAL_DURATION * 1000);
    } catch (caught) {
      setAudioError(caught.message);
      setPlaying(false);
    }
  };

  return (
    <div className="space-y-5">
      <div className="grid gap-2 sm:grid-cols-2">
        {instruments.map((instrument) => (
          <button
            key={instrument.id}
            type="button"
            onClick={() => {
              setSelected(instrument);
              setPlaying(false);
            }}
            aria-pressed={selected.id === instrument.id}
            className={`flex items-center gap-3 rounded-xl border px-4 py-3 text-left transition ${
              selected.id === instrument.id
                ? "border-brand-500 bg-brand-500/[0.06]"
                : "border-slate-200 hover:border-slate-300 dark:border-white/10 dark:hover:border-white/20"
            }`}
          >
            <span className="text-2xl" aria-hidden="true">
              {instrument.icon}
            </span>
            <span>
              <span className="block text-sm font-semibold text-slate-950 dark:text-white">
                {instrument.name}
              </span>
              <span className="block text-xs text-slate-500 dark:text-slate-400">
                {instrument.type}
              </span>
            </span>
          </button>
        ))}
      </div>

      <div className="rounded-2xl border border-slate-200 p-5 dark:border-white/10">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h4 className="font-display text-lg font-semibold text-slate-950 dark:text-white">
              {selected.name}
            </h4>
            <p className="mt-1 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
              {selected.context}
            </p>
          </div>
          <span className="text-4xl" aria-hidden="true">
            {selected.icon}
          </span>
        </div>

        <dl className="mt-4 grid gap-3 text-xs sm:grid-cols-2">
          <div>
            <dt className="font-semibold uppercase tracking-wider text-slate-500">Scale guide</dt>
            <dd className="mt-1 text-slate-700 dark:text-slate-300">{selected.scale}</dd>
          </div>
          <div>
            <dt className="font-semibold uppercase tracking-wider text-slate-500">Preview notes</dt>
            <dd className="mt-1 font-mono text-slate-700 dark:text-slate-300">
              {selected.notes.join(" · ")} Hz
            </dd>
          </div>
        </dl>

        <div className="mt-5 flex flex-wrap items-center gap-3">
          <button type="button" onClick={play} className="btn btn-primary px-5 py-2.5">
            {playing ? "Playing…" : "Play reference tone"}
          </button>
          {playing && (
            <span className="flex items-end gap-1" aria-hidden="true">
              {[12, 20, 16, 24, 14].map((height, index) => (
                <span
                  key={index}
                  className="w-1 animate-pulse rounded-full bg-brand-500"
                  style={{ height, animationDelay: `${index * 90}ms` }}
                />
              ))}
            </span>
          )}
        </div>

        {audioError && (
          <p role="alert" className="mt-3 text-xs text-red-600 dark:text-red-400">
            {audioError}
          </p>
        )}
      </div>

      <p className="text-xs leading-relaxed text-slate-500 dark:text-slate-400">
        These are synthesized reference tones generated in your browser — not field recordings.
        They are intended to introduce the instrument names and basic pitch patterns, not to
        reproduce their full sound.
      </p>
    </div>
  );
}
