import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/gallery")({
  head: () => ({
    meta: [
      { title: "Premade Designs — TD STUDIOS" },
      { name: "description", content: "Browse premade designs from TD Studios — a curated gallery of premium creative work." },
      { property: "og:title", content: "Premade Designs — TD STUDIOS" },
      { property: "og:description", content: "Browse premade designs from TD Studios — a curated gallery of premium creative work." },
    ],
    links: [
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap" },
    ],
  }),
  component: Gallery,
});

// Placeholder slots — replace src with real images later
const placeholders = Array.from({ length: 9 }, (_, i) => ({ id: i + 1 }));

function Gallery() {
  return (
    <main className="bg-aurora relative min-h-screen w-full px-5 py-10 sm:px-8 sm:py-14">
      <div className="relative z-10 mx-auto max-w-6xl">
        <header className="mb-10 flex flex-col items-center text-center sm:mb-14">
          <Link
            to="/"
            className="mb-6 text-[11px] tracking-[0.3em] uppercase text-muted-foreground hover:text-foreground transition-colors"
          >
            ← Back
          </Link>
          <h1 className="font-display text-5xl sm:text-6xl text-foreground">
            Premade Designs
          </h1>
          <p className="mt-3 max-w-md text-sm text-muted-foreground tracking-wide">
            A curated gallery of ready-to-go designs from TD Studios.
          </p>
        </header>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-5">
          {placeholders.map((item, i) => (
            <div
              key={item.id}
              className="glass-card animate-fade-up group relative aspect-square overflow-hidden rounded-2xl"
              style={{ animationDelay: `${100 + i * 60}ms` }}
            >
              <div className="absolute inset-0 flex items-center justify-center text-muted-foreground/50 text-xs tracking-[0.25em] uppercase">
                Coming Soon
              </div>
            </div>
          ))}
        </div>

        <p className="mt-12 text-center text-[11px] tracking-[0.3em] uppercase text-muted-foreground/70">
          © TD Studios
        </p>
      </div>
    </main>
  );
}
