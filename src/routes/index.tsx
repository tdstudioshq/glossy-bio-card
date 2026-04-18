import { createFileRoute } from "@tanstack/react-router";
import { Instagram, MessageCircle, Send, Mail, Sparkles } from "lucide-react";
import logo from "@/assets/td-studios-logo.png";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "TD STUDIOS — Links" },
      { name: "description", content: "TD STUDIOS — premium creative studio. Connect with us across all platforms." },
      { property: "og:title", content: "TD STUDIOS — Links" },
      { property: "og:description", content: "TD STUDIOS — premium creative studio. Connect with us across all platforms." },
    ],
    links: [
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap" },
    ],
  }),
  component: Index,
});

type LinkItem = {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
};

const links: LinkItem[] = [
  { label: "Instagram", href: "https://www.instagram.com/tdstudiosco/", icon: Instagram },
  { label: "WhatsApp", href: "https://wa.me/19297528373", icon: MessageCircle },
  { label: "Telegram", href: "https://t.me/+19297528373", icon: Send },
  { label: "Email", href: "mailto:tyler@tdstudiosny.com", icon: Mail },
  { label: "DESIGN INQUIRIES", href: "/inquiries", icon: Sparkles },
];

function Index() {
  return (
    <main className="bg-aurora relative min-h-screen w-full overflow-hidden flex items-center justify-center px-5 py-10">
      {/* Ambient glow behind card */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 -z-0 h-[520px] w-[520px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl animate-pulse-glow"
        style={{
          background:
            "radial-gradient(circle, oklch(0.55 0.18 25 / 0.35), transparent 65%)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-32 -right-20 -z-0 h-[400px] w-[400px] rounded-full blur-3xl"
        style={{
          background:
            "radial-gradient(circle, oklch(0.5 0.18 280 / 0.25), transparent 70%)",
        }}
      />

      <section
        className="glass-card animate-fade-up relative z-10 w-full max-w-md rounded-3xl px-6 py-9 sm:px-8 sm:py-10"
        style={{ animationDelay: "100ms" }}
      >
        {/* Logo */}
        <div
          className="animate-fade-in-slow flex flex-col items-center"
          style={{ animationDelay: "250ms" }}
        >
          <img
            src={logo}
            alt="TD Studios — TNT Printing, New York City"
            className="animate-spin-slow h-32 w-32 sm:h-36 sm:w-36 object-contain drop-shadow-[0_8px_24px_rgba(0,0,0,0.5)]"
          />
        </div>

        {/* Handle */}
        <div
          className="animate-fade-up mt-5 mb-8 text-center"
          style={{ animationDelay: "450ms" }}
        >
          <a
            href="https://www.instagram.com/tdstudiosco/"
            target="_blank"
            rel="noopener noreferrer"
            className="font-display inline-block text-3xl sm:text-4xl text-foreground tracking-[0.08em] transition-colors hover:text-foreground/70"
          >
            @TDSTUDIOSCO
          </a>
          <p className="mt-1 text-xs sm:text-sm text-muted-foreground tracking-[0.25em] uppercase">
            New York City
          </p>
        </div>

        {/* Buttons */}
        <nav className="flex flex-col gap-3.5">
          {links.map((link, i) => {
            const Icon = link.icon;
            return (
              <a
                key={link.label}
                href={link.href}
                className="glass-button animate-fade-up group flex items-center justify-center gap-3 rounded-2xl px-6 py-4 text-foreground"
                style={{ animationDelay: `${600 + i * 90}ms` }}
              >
                <Icon className="h-5 w-5 opacity-90 transition-transform duration-300 group-hover:scale-110" />
                <span className="font-display text-xl sm:text-2xl">
                  {link.label}
                </span>
              </a>
            );
          })}
        </nav>

        {/* Footer */}
        <p
          className="animate-fade-in-slow mt-8 text-center text-[11px] tracking-[0.3em] uppercase text-muted-foreground/70"
          style={{ animationDelay: "1200ms" }}
        >
          © TD Studios
        </p>
      </section>
    </main>
  );
}
