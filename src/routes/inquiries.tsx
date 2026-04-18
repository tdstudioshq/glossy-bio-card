import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createFileRoute("/inquiries")({
  head: () => ({
    meta: [
      { title: "Design Inquiries — TD STUDIOS" },
      { name: "description", content: "Submit a design inquiry to TD Studios — share your project details and we'll be in touch." },
      { property: "og:title", content: "Design Inquiries — TD STUDIOS" },
      { property: "og:description", content: "Submit a design inquiry to TD Studios — share your project details and we'll be in touch." },
    ],
    links: [
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap" },
    ],
  }),
  component: Inquiries,
});

function Inquiries() {
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState<string>("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");
    setErrorMsg("");
    const form = e.currentTarget;
    const data = new FormData(form);
    try {
      const res = await fetch("https://formspree.io/f/movkvrpz", {
        method: "POST",
        body: data,
        headers: { Accept: "application/json" },
      });
      if (res.ok) {
        setStatus("success");
        form.reset();
      } else {
        const json = await res.json().catch(() => null);
        setErrorMsg(json?.errors?.[0]?.message ?? "Something went wrong. Please try again.");
        setStatus("error");
      }
    } catch {
      setErrorMsg("Network error. Please try again.");
      setStatus("error");
    }
  }

  return (
    <main className="bg-aurora relative min-h-screen w-full px-5 py-10 sm:px-8 sm:py-14 flex items-start sm:items-center justify-center">
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 -z-0 h-[520px] w-[520px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl animate-pulse-glow"
        style={{
          background:
            "radial-gradient(circle, oklch(0.55 0.18 25 / 0.35), transparent 65%)",
        }}
      />

      <section
        className="glass-card animate-fade-up relative z-10 w-full max-w-md rounded-3xl px-6 py-9 sm:px-8 sm:py-10"
        style={{ animationDelay: "100ms" }}
      >
        <Link
          to="/"
          className="mb-6 inline-block text-[11px] tracking-[0.3em] uppercase text-muted-foreground hover:text-foreground transition-colors"
        >
          ← Back
        </Link>

        <h1 className="font-display text-4xl sm:text-5xl text-foreground text-center">
          Design Inquiries
        </h1>
        <p className="mt-2 mb-7 text-center text-xs sm:text-sm text-muted-foreground tracking-[0.2em] uppercase">
          Tell us about your project
        </p>

        {status === "success" ? (
          <div className="text-center py-6">
            <p className="font-display text-2xl text-foreground mb-3">Thank you.</p>
            <p className="text-sm text-muted-foreground mb-6">
              Your inquiry has been received. We'll be in touch shortly.
            </p>
            <button
              onClick={() => setStatus("idle")}
              className="glass-button rounded-2xl px-6 py-3 text-foreground font-display text-lg"
            >
              Submit Another
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <Field label="Name" name="name" type="text" autoComplete="name" />
            <Field label="Phone Number *" name="phone" type="tel" required autoComplete="tel" />
            <Field label="Email" name="email" type="email" autoComplete="email" />
            <Field label="Instagram *" name="instagram" type="text" placeholder="@yourhandle" required />

            <div className="flex flex-col gap-2">
              <label htmlFor="notes" className="text-[11px] tracking-[0.25em] uppercase text-muted-foreground">
                Notes *
              </label>
              <textarea
                id="notes"
                name="notes"
                required
                rows={4}
                maxLength={2000}
                className="w-full rounded-xl bg-white/5 border border-white/15 px-4 py-3 text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-white/35 focus:bg-white/[0.07] transition-colors resize-none"
                placeholder="Please provide details about the designs you're inquiring about"
              />
            </div>

            {status === "error" && (
              <p className="text-xs text-destructive text-center">{errorMsg}</p>
            )}

            <button
              type="submit"
              disabled={status === "submitting"}
              className="glass-button mt-2 rounded-2xl px-6 py-4 text-foreground font-display text-xl sm:text-2xl disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {status === "submitting" ? "Sending..." : "Submit Inquiry"}
            </button>
          </form>
        )}

        <p className="mt-8 text-center text-[11px] tracking-[0.3em] uppercase text-muted-foreground/70">
          © TD Studios
        </p>
      </section>
    </main>
  );
}

function Field({
  label,
  name,
  type,
  required,
  placeholder,
  autoComplete,
}: {
  label: string;
  name: string;
  type: string;
  required?: boolean;
  placeholder?: string;
  autoComplete?: string;
}) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={name} className="text-[11px] tracking-[0.25em] uppercase text-muted-foreground">
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
        autoComplete={autoComplete}
        maxLength={200}
        className="w-full rounded-xl bg-white/5 border border-white/15 px-4 py-3 text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-white/35 focus:bg-white/[0.07] transition-colors"
      />
    </div>
  );
}
