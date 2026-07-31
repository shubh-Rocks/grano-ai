"use client";
import React, { useEffect, useRef, useState } from "react";
import {
  Phone,
  PhoneOff,
  Volume2,
  Check,
  ArrowRight,
  Mic,
  CalendarCheck2,
  Ear,
  ClipboardCheck,
  Sparkles,
} from "lucide-react";

/* ================================================================
   Tokens — ported from Cursor's DESIGN.md
   Warm cream canvas, warm-black ink, single-voltage orange.
   No gradients, no drop shadows, no blur/glow. Hairline depth only.
================================================================= */

const COLOR = {
  primary: "#f54e00",
  primaryActive: "#d04200",
  onPrimary: "#ffffff",

  ink: "#26251e",
  body: "#5a5852",
  muted: "#807d72",
  mutedSoft: "#a09c92",

  hairline: "#e6e5e0",
  hairlineSoft: "#efeee8",
  hairlineStrong: "#cfcdc4",

  canvas: "#f7f7f4",
  canvasSoft: "#fafaf7",
  surfaceCard: "#ffffff",
  surfaceStrong: "#e6e5e0",

  success: "#1f8a65",
  error: "#cf2d56",

  // repurposed from Cursor's AI-timeline pastels →  call-verification stages
  stageCalling: "#dfa88f", // was timeline-thinking (peach)
  stageListening: "#9fbbe0", // was timeline-read (blue)
  stageVerifying: "#c0a8dd", // was timeline-edit (lavender)
  stageConfirmed: "#9fc9a2", // was timeline-grep (mint)
  stageLogged: "#c08532", // was timeline-done (gold)
};

const RADIUS = { sm: 6, md: 8, lg: 12, xl: 16, pill: 9999 };
const SPACING_SECTION = 80;

const FONT_DISPLAY =
  "'Inter', system-ui, -apple-system, 'Helvetica Neue', Helvetica, Arial, sans-serif";
const FONT_BODY =
  "'Inter', system-ui, -apple-system, 'Helvetica Neue', Helvetica, Arial, sans-serif";
const FONT_MONO = "'JetBrains Mono', 'Fira Code', monospace";

function useReveal() {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { threshold: 0.15 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return [ref, visible];
}

function Reveal({ children, delay = 0, className = "" }) {
  const [ref, visible] = useReveal();
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(14px)",
        transition: `opacity 0.6s cubic-bezier(0.16,1,0.3,1) ${delay}ms, transform 0.6s cubic-bezier(0.16,1,0.3,1) ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

/* Signature motif: a flat, hairline "incoming call" ring — no blur, no glow. */
function CallRing({ size = 120 }) {
  return (
    <div style={{ position: "relative", width: size, height: size }}>
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: "50%",
            border: `1.5px solid ${COLOR.primary}`,
            opacity: 0,
            animation: `-ring 2.6s ease-out ${i * 0.85}s infinite`,
          }}
        />
      ))}
      <div
        style={{
          position: "absolute",
          inset: size * 0.28,
          borderRadius: "50%",
          background: COLOR.ink,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Phone size={size * 0.16} color={COLOR.canvas} strokeWidth={2} />
      </div>
    </div>
  );
}

function Chip({ icon: Icon, children }) {
  return (
    <span
      className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5"
      style={{
        background: COLOR.surfaceCard,
        border: `1px solid ${COLOR.hairline}`,
        borderRadius: RADIUS.pill,
        color: COLOR.ink,
        fontFamily: FONT_BODY,
      }}
    >
      <Icon size={12} color={COLOR.primary} strokeWidth={2.5} />
      {children}
    </span>
  );
}

const STAGES = [
  { key: "calling", label: "CALLING", color: COLOR.stageCalling },
  { key: "listening", label: "LISTENING", color: COLOR.stageListening },
  { key: "verifying", label: "VERIFYING", color: COLOR.stageVerifying },
  { key: "confirmed", label: "CONFIRMED", color: COLOR.stageConfirmed },
  { key: "logged", label: "LOGGED", color: COLOR.stageLogged },
];

function StageRow({ activeIndex }) {
  return (
    <div className="flex items-center gap-1.5 flex-wrap">
      {STAGES.map((s, i) => {
        const active = i === activeIndex;
        const passed = i < activeIndex;
        return (
          <span
            key={s.key}
            className="inline-flex items-center text-[10px] font-semibold px-2.5 py-1 tracking-wide"
            style={{
              borderRadius: RADIUS.pill,
              fontFamily: FONT_BODY,
              letterSpacing: "0.06em",
              background: active ? s.color : "transparent",
              color: active
                ? s.key === "logged"
                  ? COLOR.onPrimary
                  : COLOR.ink
                : passed
                  ? COLOR.muted
                  : COLOR.mutedSoft,
              border: active ? "none" : `1px solid ${COLOR.hairline}`,
              transition: "all 0.3s ease",
            }}
          >
            {s.label}
          </span>
        );
      })}
    </div>
  );
}

const TRANSCRIPT = {
  hi: [
    {
      who: "agent",
      text: "नमस्ते काका जी, मैं सहारा बोल रही हूं। क्या आपने आज अपनी BP की दवा ली?",
    },
    { who: "user", text: "हां हां, ले ली।" },
    { who: "agent", text: "बहुत अच्छा। बस बताइए — कितने बजे ली थी?" },
    { who: "user", text: "करीब 9 बजे, नाश्ते के साथ।" },
    {
      who: "agent",
      text: "बिल्कुल सही समय पर। ख्याल रखिए, कल फिर फ़ोन करूंगी।",
    },
  ],
  en: [
    {
      who: "agent",
      text: "Namaste Kaka ji, this is  calling. Did you take your blood pressure tablet today?",
    },
    { who: "user", text: "Haan haan, I took it." },
    {
      who: "agent",
      text: "Wonderful. Just to confirm — what time did you take it?",
    },
    { who: "user", text: "Around 9, with breakfast." },
    {
      who: "agent",
      text: "That matches your schedule. Take care — I'll call again tomorrow.",
    },
  ],
};

function useTicker(active) {
  const [seconds, setSeconds] = useState(0);
  useEffect(() => {
    if (!active) return;
    const id = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(id);
  }, [active]);
  const m = String(Math.floor(seconds / 60)).padStart(2, "0");
  const s = String(seconds % 60).padStart(2, "0");
  return `${m}:${s}`;
}

function stageIndexFor(lineIdx, done, total) {
  if (done) return 4;
  if (lineIdx >= total - 1) return 3;
  if (lineIdx >= 2) return 2;
  if (lineIdx >= 1) return 1;
  return 0;
}

function PhoneCallDemo() {
  const [lang, setLang] = useState("hi");
  const [lineIdx, setLineIdx] = useState(0);
  const [charIdx, setCharIdx] = useState(0);
  const [done, setDone] = useState(false);
  const scrollRef = useRef(null);
  const lines = TRANSCRIPT[lang];
  const timer = useTicker(!done);

  useEffect(() => {
    setLineIdx(0);
    setCharIdx(0);
    setDone(false);
  }, [lang]);

  useEffect(() => {
    if (done) return;
    const current = lines[lineIdx];
    if (!current) {
      setDone(true);
      return;
    }
    if (charIdx < current.text.length) {
      const t = setTimeout(() => setCharIdx((c) => c + 1), 16);
      return () => clearTimeout(t);
    }
    const pause = setTimeout(() => {
      if (lineIdx + 1 < lines.length) {
        setLineIdx((i) => i + 1);
        setCharIdx(0);
      } else {
        setDone(true);
      }
    }, 500);
    return () => clearTimeout(pause);
  }, [charIdx, lineIdx, done, lines]);

  useEffect(() => {
    if (scrollRef.current)
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [lineIdx, charIdx]);

  const replay = () => {
    setLineIdx(0);
    setCharIdx(0);
    setDone(false);
  };

  const visibleLines = lines
    .slice(0, lineIdx + 1)
    .map((l, i) =>
      i === lineIdx ? { ...l, text: l.text.slice(0, charIdx) } : l,
    );

  const activeStage = stageIndexFor(lineIdx, done, lines.length);

  return (
    <div className="relative mx-auto" style={{ width: 320 }}>
      {!done && (
        <div
          className="absolute -right-3 -top-3 z-10 flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium"
          style={{
            background: COLOR.ink,
            color: COLOR.canvas,
            borderRadius: RADIUS.pill,
            fontFamily: FONT_BODY,
          }}
        >
          <span
            className="w-1.5 h-1.5 rounded-full"
            style={{
              background: COLOR.primary,
              animation: "-pulse-dot 1.4s ease-in-out infinite",
            }}
          />
          Live transcript
        </div>
      )}

      <div
        className="relative"
        style={{
          borderRadius: RADIUS.xl,
          background: COLOR.surfaceCard,
          border: `1px solid ${COLOR.hairline}`,
          padding: 10,
        }}
      >
        <div
          style={{
            borderRadius: RADIUS.lg,
            background: COLOR.canvasSoft,
            overflow: "hidden",
          }}
        >
          <div
            className="relative flex flex-col items-center pt-7 pb-4"
            style={{ borderBottom: `1px solid ${COLOR.hairline}` }}
          >
            <div
              className="w-14 h-14 rounded-full flex items-center justify-center mb-3 font-medium"
              style={{
                background: COLOR.hairlineSoft,
                border: `1px solid ${COLOR.hairline}`,
                color: COLOR.ink,
                fontFamily: FONT_BODY,
              }}
            >
              RK
            </div>
            <p
              className="text-sm font-medium"
              style={{ color: COLOR.ink, fontFamily: FONT_BODY }}
            >
              Ramesh Kaka
            </p>
            <p
              className="text-xs mt-0.5"
              style={{ color: COLOR.muted, fontFamily: FONT_MONO }}
            >
              {done ? "Call ended · " : "In call · "}
              {timer}
            </p>
            <div className="mt-3 px-4">
              <StageRow activeIndex={activeStage} />
            </div>
          </div>

          <div
            ref={scrollRef}
            className="relative px-4 py-4 space-y-2.5 overflow-y-auto"
            style={{ height: 210 }}
          >
            {visibleLines.map((l, i) => (
              <div
                key={i}
                className={`flex ${l.who === "agent" ? "justify-start" : "justify-end"}`}
              >
                <div
                  className="max-w-[82%] px-3.5 py-2 text-xs leading-relaxed"
                  style={{
                    background:
                      l.who === "agent" ? COLOR.hairlineSoft : COLOR.ink,
                    color: l.who === "agent" ? COLOR.ink : COLOR.canvas,
                    fontFamily: FONT_BODY,
                    borderRadius: RADIUS.lg,
                    borderBottomLeftRadius: l.who === "agent" ? 4 : RADIUS.lg,
                    borderBottomRightRadius: l.who === "agent" ? RADIUS.lg : 4,
                  }}
                >
                  {l.text}
                </div>
              </div>
            ))}
          </div>

          <div
            className="px-4 pb-5 pt-3"
            style={{ borderTop: `1px solid ${COLOR.hairline}` }}
          >
            {done ? (
              <div className="flex items-center justify-between">
                <span
                  className="inline-flex items-center gap-1.5 text-xs font-medium"
                  style={{ color: COLOR.ink, fontFamily: FONT_BODY }}
                >
                  <Check size={14} color={COLOR.success} strokeWidth={2.5} />
                  Medicine taken · high confidence
                </span>
                <button
                  onClick={replay}
                  className="text-xs font-medium underline underline-offset-2"
                  style={{ color: COLOR.muted, fontFamily: FONT_BODY }}
                >
                  Replay
                </button>
              </div>
            ) : (
              <div className="flex items-center justify-center gap-6">
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center"
                  style={{
                    background: COLOR.hairlineSoft,
                    border: `1px solid ${COLOR.hairline}`,
                  }}
                >
                  <Mic size={14} color={COLOR.ink} />
                </div>
                <div
                  className="w-11 h-11 rounded-full flex items-center justify-center"
                  style={{ background: COLOR.error }}
                >
                  <PhoneOff size={16} color={COLOR.onPrimary} />
                </div>
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center"
                  style={{
                    background: COLOR.hairlineSoft,
                    border: `1px solid ${COLOR.hairline}`,
                  }}
                >
                  <Volume2 size={14} color={COLOR.ink} />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex justify-center pt-4">
        {["hi", "en"].map((l) => (
          <button
            key={l}
            onClick={() => setLang(l)}
            className="px-3.5 py-1.5 text-xs font-medium mx-1 transition-colors"
            style={{
              borderRadius: RADIUS.md,
              fontFamily: FONT_BODY,
              background: lang === l ? COLOR.primary : "transparent",
              color: lang === l ? COLOR.onPrimary : COLOR.body,
              border: lang === l ? "none" : `1px solid ${COLOR.hairlineStrong}`,
            }}
          >
            {l === "hi" ? "हिंदी" : "English"}
          </button>
        ))}
      </div>
    </div>
  );
}

function Nav() {
  return (
    <header
      className="sticky top-0 z-30"
      style={{
        background: COLOR.canvas,
        borderBottom: `1px solid ${COLOR.hairline}`,
      }}
    >
      <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
        <span
          className="font-medium tracking-tight text-lg"
          style={{
            fontFamily: FONT_DISPLAY,
            color: COLOR.ink,
            letterSpacing: "-0.02em",
          }}
        ></span>
        <nav
          className="hidden sm:flex items-center gap-8 text-sm"
          style={{ color: COLOR.body, fontFamily: FONT_BODY, fontWeight: 500 }}
        >
          <a
            href="/register"
            className="relative -navlink hover:opacity-90 transition-opacity"
          >
            How it works
          </a>
          <a
            href="/login"
            className="relative -navlink hover:opacity-90 transition-opacity"
          >
            See it in action
          </a>
        </nav>
        <a
          href="/register"
          className="text-sm font-medium px-4 py-2 transition-colors hover:brightness-95"
          style={{
            background: COLOR.primary,
            color: COLOR.onPrimary,
            borderRadius: RADIUS.md,
            fontFamily: FONT_BODY,
          }}
        >
          Try It Free
        </a>
      </div>
    </header>
  );
}

export default function Landing() {
  return (
    <div
      style={{
        background: COLOR.canvas,
        color: COLOR.ink,
        fontFamily: FONT_BODY,
        minHeight: "100vh",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');

        @keyframes -ring {
          0% { transform: scale(0.7); opacity: 0.5; }
          100% { transform: scale(1.5); opacity: 0; }
        }
        @keyframes -pulse-dot {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.4; transform: scale(0.8); }
        }

        .-navlink::after {
          content: '';
          position: absolute;
          left: 0; right: 0; bottom: -6px;
          height: 1.5px;
          background: ${COLOR.primary};
          transform: scaleX(0);
          transform-origin: left;
          transition: transform 0.25s ease;
        }
        .-navlink:hover::after { transform: scaleX(1); }

        .-card {
          transition: border-color 0.25s ease, transform 0.25s ease;
        }
        .-card:hover {
          border-color: ${COLOR.primary} !important;
        }

        a:focus-visible, button:focus-visible {
          outline: 2px solid ${COLOR.primary};
          outline-offset: 3px;
          border-radius: 4px;
        }

        @media (prefers-reduced-motion: reduce) {
          * { animation-duration: 0.001ms !important; animation-iteration-count: 1 !important; transition-duration: 0.001ms !important; }
        }
      `}</style>

      <Nav />

      {/* ---------------- HERO ---------------- */}
      <section className="relative">
        <div
          className="relative max-w-5xl mx-auto px-6"
          style={{
            paddingTop: SPACING_SECTION,
            paddingBottom: SPACING_SECTION,
          }}
        >
          <div className="grid md:grid-cols-[1.3fr,0.7fr] gap-14 items-center">
            <div>
              <Reveal>
                <p
                  className="text-xs font-medium tracking-wide uppercase mb-5"
                  style={{
                    color: COLOR.muted,
                    fontFamily: FONT_BODY,
                    letterSpacing: "0.06em",
                  }}
                >
                  A daily call, in Hindi, right on time
                </p>
              </Reveal>
              <Reveal delay={80}>
                <h1
                  className="font-normal"
                  style={{
                    fontFamily: FONT_DISPLAY,
                    fontSize: "clamp(2.3rem, 5vw, 3.8rem)",
                    lineHeight: 1.1,
                    letterSpacing: "-0.03em",
                    fontWeight: 400,
                  }}
                >
                  Know your parent took their medicine —{" "}
                  <span className="relative inline-block">
                    <span style={{ color: COLOR.primary }}>
                      without calling twice a day.
                    </span>
                    <svg
                      aria-hidden
                      viewBox="0 0 300 14"
                      className="absolute left-0 -bottom-2 w-full"
                      style={{ height: 12 }}
                    >
                      <path
                        d="M2 9 C 60 2, 120 12, 180 6 S 260 2, 298 8"
                        fill="none"
                        stroke={COLOR.primary}
                        strokeWidth="2"
                        strokeLinecap="round"
                        opacity="0.5"
                      />
                    </svg>
                  </span>
                </h1>
              </Reveal>
              <Reveal delay={160}>
                <p
                  className="mt-6 max-w-lg text-lg leading-relaxed"
                  style={{ color: COLOR.body, fontFamily: FONT_BODY }}
                >
                  calls like a caring person would — checks if the medicine was
                  really taken, not just assumed — and tells you the truth the
                  same day.
                </p>
              </Reveal>
              <Reveal delay={220}>
                <div className="mt-6 flex flex-wrap gap-2.5">
                  <Chip icon={Phone}>Real phone call, not an app</Chip>
                  <Chip icon={Sparkles}>Hindi, not translated</Chip>
                  <Chip icon={Ear}>Listens for uncertainty</Chip>
                </div>
              </Reveal>
              <Reveal delay={280}>
                <div className="mt-9 flex flex-wrap items-center gap-4">
                  <a
                    href="#cta"
                    className="group inline-flex items-center gap-2 px-6 py-3.5 font-medium transition-colors hover:brightness-95"
                    style={{
                      background: COLOR.primary,
                      color: COLOR.onPrimary,
                      borderRadius: RADIUS.md,
                      fontFamily: FONT_BODY,
                    }}
                  >
                    Try It Free
                    <ArrowRight
                      size={16}
                      className="transition-transform group-hover:translate-x-0.5"
                    />
                  </a>
                  <a
                    href="#how"
                    className="inline-flex items-center gap-2 px-6 py-3.5 font-medium border transition-colors hover:bg-white"
                    style={{
                      borderColor: COLOR.hairlineStrong,
                      color: COLOR.ink,
                      borderRadius: RADIUS.md,
                      fontFamily: FONT_BODY,
                    }}
                  >
                    See how it works
                  </a>
                </div>
              </Reveal>
              <Reveal delay={340}>
                <p
                  className="mt-8 text-xs"
                  style={{ color: COLOR.mutedSoft, fontFamily: FONT_BODY }}
                >
                  Powered by Sarvam AI · Built for Hindi speakers · Calls
                  secured via Twilio
                </p>
              </Reveal>
            </div>

            <Reveal delay={200} className="flex justify-center">
              <CallRing size={180} />
            </Reveal>
          </div>
        </div>
      </section>

      {/* ---------------- PROBLEM -> SOLUTION ---------------- */}
      <section
        className="max-w-5xl mx-auto px-6"
        style={{
          paddingTop: SPACING_SECTION,
          paddingBottom: SPACING_SECTION,
          borderTop: `1px solid ${COLOR.hairline}`,
        }}
      >
        <div className="grid md:grid-cols-2 gap-12 items-start">
          <Reveal>
            <h2
              className="font-normal"
              style={{
                fontFamily: FONT_DISPLAY,
                fontSize: "clamp(1.6rem, 3vw, 2.1rem)",
                lineHeight: 1.25,
                letterSpacing: "-0.01em",
              }}
            >
              You can't be there every day.
              <br />
              <span style={{ color: COLOR.muted }}>The worry still is.</span>
            </h2>
          </Reveal>
          <Reveal delay={100}>
            <div>
              <p
                className="text-base leading-relaxed"
                style={{ color: COLOR.body, fontFamily: FONT_BODY }}
              >
                Elderly parents forget doses, mix up pills, or say
              </p>
              <div
                className="my-4 inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium"
                style={{
                  background: COLOR.hairlineSoft,
                  color: COLOR.ink,
                  borderRadius: RADIUS.lg,
                  borderBottomLeftRadius: 4,
                  fontFamily: FONT_BODY,
                }}
              >
                "हां, ले ली।" — out of habit, not truth.
              </div>
              <p
                className="text-base leading-relaxed"
                style={{ color: COLOR.body, fontFamily: FONT_BODY }}
              >
                calls in a natural Hindi voice, listens for answers that sound
                unsure, and tells you what actually happened — not what was
                assumed.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ---------------- HOW IT WORKS ---------------- */}
      <section
        id="how"
        style={{
          background: COLOR.canvasSoft,
          paddingTop: SPACING_SECTION,
          paddingBottom: SPACING_SECTION,
        }}
      >
        <div className="max-w-5xl mx-auto px-6">
          <Reveal>
            <p
              className="text-xs font-medium tracking-wide uppercase mb-3"
              style={{
                color: COLOR.muted,
                fontFamily: FONT_BODY,
                letterSpacing: "0.06em",
              }}
            >
              How it works
            </p>
          </Reveal>
          <Reveal delay={60}>
            <h2
              className="font-normal mb-14"
              style={{
                fontFamily: FONT_DISPLAY,
                fontSize: "clamp(1.8rem, 3.2vw, 2.4rem)",
                letterSpacing: "-0.015em",
              }}
            >
              Four steps. Zero effort from you.
            </h2>
          </Reveal>

          <div className="relative grid md:grid-cols-4 gap-6">
            <div
              className="hidden md:block absolute top-11 left-0 right-0"
              style={{ height: 1, background: COLOR.hairline }}
            />
            {[
              {
                n: "01",
                title: "Set the schedule",
                body: "Add your parent's medicines once — appearance, dose, and time.",
                Icon: CalendarCheck2,
              },
              {
                n: "02",
                title: " calls, on time",
                body: "A real phone call, in warm Hindi, right at the medicine hour.",
                Icon: Phone,
              },
              {
                n: "03",
                title: "It listens, not just asks",
                body: "An unsure or too-quick answer gets a gentle follow-up question.",
                Icon: Ear,
              },
              {
                n: "04",
                title: "You get the truth today",
                body: "Taken, missed, or uncertain — logged the moment the call ends.",
                Icon: ClipboardCheck,
              },
            ].map((step, i) => (
              <Reveal key={step.n} delay={i * 90}>
                <div
                  className="-card relative h-full p-5 border"
                  style={{
                    background: COLOR.surfaceCard,
                    borderColor: COLOR.hairline,
                    borderRadius: RADIUS.lg,
                  }}
                >
                  <div
                    className="w-9 h-9 flex items-center justify-center mb-4"
                    style={{
                      background: COLOR.hairlineSoft,
                      borderRadius: RADIUS.md,
                    }}
                  >
                    <step.Icon
                      size={16}
                      color={COLOR.primary}
                      strokeWidth={2.2}
                    />
                  </div>
                  <span
                    className="text-xs font-semibold tracking-wide"
                    style={{ color: COLOR.primary, fontFamily: FONT_MONO }}
                  >
                    {step.n}
                  </span>
                  <h3
                    className="mt-2 font-semibold text-base"
                    style={{ fontFamily: FONT_BODY }}
                  >
                    {step.title}
                  </h3>
                  <p
                    className="mt-2 text-sm leading-relaxed"
                    style={{ color: COLOR.body, fontFamily: FONT_BODY }}
                  >
                    {step.body}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- SEE IT IN ACTION ---------------- */}
      <section
        id="demo"
        className="max-w-5xl mx-auto px-6"
        style={{ paddingTop: SPACING_SECTION, paddingBottom: SPACING_SECTION }}
      >
        <div className="grid md:grid-cols-[0.9fr,1.1fr] gap-14 items-center">
          <Reveal>
            <div>
              <p
                className="text-xs font-medium tracking-wide uppercase mb-3"
                style={{
                  color: COLOR.muted,
                  fontFamily: FONT_BODY,
                  letterSpacing: "0.06em",
                }}
              >
                See it in action
              </p>
              <h2
                className="font-normal mb-5"
                style={{
                  fontFamily: FONT_DISPLAY,
                  fontSize: "clamp(1.7rem, 3vw, 2.2rem)",
                  lineHeight: 1.2,
                  letterSpacing: "-0.015em",
                }}
              >
                A real call, not a script read aloud.
              </h2>
              <p
                className="text-base leading-relaxed"
                style={{ color: COLOR.body, fontFamily: FONT_BODY }}
              >
                Watch double-check a quick "haan, le liya" instead of taking it
                at face value. Switch between Hindi and English to see both.
              </p>
              <div
                className="mt-8 flex items-center gap-2.5 text-sm"
                style={{ color: COLOR.body, fontFamily: FONT_BODY }}
              >
                <Volume2 size={16} color={COLOR.primary} />
                Natural Hindi voice via Sarvam AI — not a call-center accent
              </div>
            </div>
          </Reveal>
          <Reveal delay={120}>
            <PhoneCallDemo />
          </Reveal>
        </div>
      </section>

      {/* ---------------- FINAL CTA ---------------- */}
      <section
        id="cta"
        className="relative"
        style={{
          background: COLOR.ink,
          paddingTop: SPACING_SECTION + 16,
          paddingBottom: SPACING_SECTION + 16,
        }}
      >
        <div className="relative max-w-2xl mx-auto px-6 text-center">
          <Reveal>
            <div className="flex justify-center mb-8">
              <CallRing size={100} />
            </div>
          </Reveal>
          <Reveal delay={80}>
            <h2
              className="font-normal"
              style={{
                fontFamily: FONT_DISPLAY,
                fontSize: "clamp(1.8rem, 4vw, 2.8rem)",
                color: COLOR.canvas,
                lineHeight: 1.15,
                letterSpacing: "-0.02em",
              }}
            >
              Peace of mind, one phone call a day.
            </h2>
          </Reveal>
          <Reveal delay={160}>
            <p
              className="mt-5 text-lg"
              style={{ color: "rgba(247,247,244,0.65)", fontFamily: FONT_BODY }}
            >
              Set it up in five minutes. takes it from there.
            </p>
          </Reveal>
          <Reveal delay={240}>
            <a
              href="#"
              className="mt-9 inline-flex items-center gap-2 px-7 py-4 font-medium transition-colors hover:brightness-95"
              style={{
                background: COLOR.primary,
                color: COLOR.onPrimary,
                borderRadius: RADIUS.md,
                fontFamily: FONT_BODY,
              }}
            >
              Try It Free
              <ArrowRight size={16} />
            </a>
          </Reveal>
          <Reveal delay={300}>
            <p
              className="mt-6 text-xs"
              style={{ color: "rgba(247,247,244,0.45)", fontFamily: FONT_BODY }}
            >
              Free during the hackathon preview · No card required
            </p>
          </Reveal>
        </div>
      </section>

      <footer
        className="py-8 text-center text-xs"
        style={{
          color: "rgba(247,247,244,0.45)",
          background: COLOR.ink,
          fontFamily: FONT_BODY,
        }}
      >
        · Built for families, powered by Sarvam AI, Groq, Deepgram, Twilio &amp;
        Vapi
      </footer>
    </div>
  );
}
