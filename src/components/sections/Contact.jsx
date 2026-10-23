import { useState } from "react";
import { hasDirectContactMode, buildMailtoLink, sendContactMessage } from "../../lib/contact";
import { profile } from "../../data";
import { Section, SectionTitle } from "../ui/Section";
import Reveal from "../ui/Reveal";
import { Copy, Check, Mail, GitHub, LinkedIn, MapPin, ArrowRight } from "../ui/Icons";

const initialForm = { name: "", email: "", message: "", website: "" };
const MAX_LENGTHS = { name: 100, email: 200, message: 2000 };

export default function Contact() {
  const [form, setForm] = useState(initialForm);
  const [status, setStatus] = useState("idle");
  const [copied, setCopied] = useState(false);

  const updateField = (field) => (event) =>
    setForm((current) => ({ ...current, [field]: event.target.value }));

  const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim());

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  };

  const openMailto = () => {
    const link = buildMailtoLink({
      name: form.name,
      email: form.email,
      message: form.message,
      to: profile.email,
    });
    window.location.href = link;
    setStatus("opening-mail");
  };

  const submit = async (event) => {
    event.preventDefault();

    // Simple bot trap: a real visitor never fills this hidden field.
    if (form.website) {
      setStatus("sent");
      return;
    }

    if (!form.name.trim() || !isValidEmail || !form.message.trim()) {
      setStatus("invalid");
      return;
    }

    if (!hasDirectContactMode) {
      openMailto();
      return;
    }

    setStatus("sending");
    try {
      await sendContactMessage({
        name: form.name,
        email: form.email,
        message: form.message,
      });
      setStatus("sent");
      setForm(initialForm);
    } catch {
      setStatus("error");
    }
  };

  return (
    <Section id="contact" labelledBy="contact-title" className="bg-slate-100/50 dark:bg-white/[0.015]">
      <div className="grid gap-12 lg:grid-cols-[0.95fr_1.05fr] lg:gap-16">
        <div>
          <SectionTitle
            id="contact-title"
            eyebrow="Contact"
            title="Let's talk"
            description="Whether it's a software role, support position, automation project, or client work, I'd be happy to hear about it."
          />

          <div className="space-y-3">
            <p className="text-base leading-relaxed text-slate-600 dark:text-slate-400">
              The fastest way to reach me is by email. I read it regularly and reply to relevant
              messages.
            </p>

            <a
              href={`mailto:${profile.email}`}
              className="surface surface-hover flex items-center gap-4 p-4"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-500/10 text-brand-600 dark:text-brand-400">
                <Mail />
              </span>
              <span className="flex-1">
                <span className="block text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Email
                </span>
                <span className="block text-sm font-semibold text-slate-950 dark:text-white">
                  {profile.email}
                </span>
              </span>
              <button
                type="button"
                onClick={(event) => {
                  event.preventDefault();
                  copyEmail();
                }}
                className="icon-button h-9 w-9"
                aria-label="Copy email address"
                aria-live="polite"
              >
                {copied ? <Check className="text-emerald-500" /> : <Copy />}
              </button>
            </a>

            <a
              href={profile.github}
              target="_blank"
              rel="noopener noreferrer"
              className="surface surface-hover flex items-center gap-4 p-4"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100 text-slate-700 dark:bg-white/5 dark:text-slate-200">
                <GitHub />
              </span>
              <span className="flex-1">
                <span className="block text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  GitHub
                </span>
                <span className="block text-sm font-semibold text-slate-950 dark:text-white">
                  github.com/exdoorx
                </span>
              </span>
            </a>

            <a
              href={profile.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="surface surface-hover flex items-center gap-4 p-4"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-sky-500/10 text-sky-600 dark:text-sky-400">
                <LinkedIn />
              </span>
              <span className="flex-1">
                <span className="block text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  LinkedIn
                </span>
                <span className="block text-sm font-semibold text-slate-950 dark:text-white">
                  linkedin.com/in/areyesph
                </span>
              </span>
            </a>

            <div className="surface flex items-center gap-4 p-4">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100 text-slate-600 dark:bg-white/5 dark:text-slate-300">
                <MapPin />
              </span>
              <span className="flex-1">
                <span className="block text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Location
                </span>
                <span className="block text-sm font-semibold text-slate-950 dark:text-white">
                  {profile.location} · open to remote work
                </span>
              </span>
            </div>
          </div>
        </div>

        <Reveal delay={120}>
          <form onSubmit={submit} className="surface h-full p-6 sm:p-8" noValidate>
            {hasDirectContactMode ? (
              <h3 className="font-display text-xl font-semibold text-slate-950 dark:text-white">
                Send a message
              </h3>
            ) : (
              <h3 className="font-display text-xl font-semibold text-slate-950 dark:text-white">
                Send an email from your app
              </h3>
            )}
            <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
              {hasDirectContactMode
                ? "Fill in the details and your message goes straight to my inbox."
                : "This form composes a ready-to-send message in your email app. Your email client stays in control of sending."}
            </p>

            <div className="mt-6 space-y-4">
              <div>
                <label htmlFor="contact-name" className="field-label">
                  Your name
                </label>
                <input
                  id="contact-name"
                  value={form.name}
                  onChange={updateField("name")}
                  className="input-field"
                  placeholder="Juan Dela Cruz"
                  autoComplete="name"
                  maxLength={MAX_LENGTHS.name}
                  required
                />
              </div>

              <div>
                <label htmlFor="contact-email" className="field-label">
                  Your email
                </label>
                <input
                  id="contact-email"
                  type="email"
                  value={form.email}
                  onChange={updateField("email")}
                  className="input-field"
                  placeholder="you@example.com"
                  autoComplete="email"
                  maxLength={MAX_LENGTHS.email}
                  required
                  aria-invalid={form.email.length > 0 && !isValidEmail}
                />
              </div>

              <div>
                <label htmlFor="contact-message" className="field-label">
                  Message
                </label>
                <textarea
                  id="contact-message"
                  value={form.message}
                  onChange={updateField("message")}
                  className="input-field min-h-[140px] resize-y"
                  placeholder="Hi Andy, I saw your portfolio and…"
                  rows={6}
                  maxLength={MAX_LENGTHS.message}
                  required
                />
              </div>

              <div className="hidden" aria-hidden="true">
                <label htmlFor="contact-website-key" className="field-label">
                  Website
                </label>
                <input
                  id="contact-website-key"
                  value={form.website}
                  onChange={updateField("website")}
                  className="input-field"
                  tabIndex={-1}
                  autoComplete="off"
                />
              </div>

              <button
                type="submit"
                disabled={status === "sending"}
                className="btn btn-primary w-full"
                aria-busy={status === "sending"}
              >
                {status === "sending" ? "Sending…" : "Send message"}
                {status !== "sending" && <ArrowRight />}
              </button>

              <div aria-live="polite">
                {status === "sent" && (
                  <p className="flex items-start gap-2 rounded-xl border border-emerald-500/20 bg-emerald-500/[0.06] p-3 text-sm text-emerald-700 dark:text-emerald-300">
                    <Check className="mt-0.5 h-4 w-4 shrink-0" />
                    Your message was sent. Thank you!
                  </p>
                )}
                {status === "opening-mail" && (
                  <p className="rounded-xl border border-brand-500/20 bg-brand-500/[0.06] p-3 text-sm text-brand-700 dark:text-brand-300">
                    Your email app should open with the message ready. If nothing happens, use the
                    email button on the left.
                  </p>
                )}
                {status === "invalid" && (
                  <p role="alert" className="rounded-xl border border-amber-500/20 bg-amber-500/10 p-3 text-sm text-amber-700 dark:text-amber-300">
                    Please complete all fields and use a valid email address.
                  </p>
                )}
                {status === "error" && (
                  <p role="alert" className="rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-600 dark:text-red-400">
                    Something went wrong. Please try again or email me directly.
                  </p>
                )}
              </div>
            </div>
          </form>
        </Reveal>
      </div>
    </Section>
  );
}
