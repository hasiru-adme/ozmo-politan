import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export type LegalBlock =
  | { type: "p"; text: string }
  | { type: "ul"; items: string[] };

export type LegalSection = {
  heading: string;
  blocks: LegalBlock[];
};

export default function LegalLayout({
  title,
  updated,
  intro,
  sections,
}: {
  title: string;
  updated: string;
  intro: string;
  sections: LegalSection[];
}) {
  return (
    <>
      <header className="border-b border-line bg-bg">
        <div className="mx-auto flex h-[72px] max-w-[900px] items-center justify-between px-5 md:px-8">
          <Link
            href="/"
            className="flex items-center gap-2.5 text-lg font-bold tracking-tight text-ink"
          >
            <span className="block h-2.5 w-2.5 rounded-full bg-accent shadow-[0_0_0_5px_rgba(243,181,27,0.2)]" />
            OZMO
          </Link>
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-muted transition hover:text-ink"
          >
            <ArrowLeft size={15} />
            Back to home
          </Link>
        </div>
      </header>

      <main className="bg-surface">
        <article className="mx-auto max-w-[900px] px-5 py-14 md:px-8 md:py-20">
          <h1 className="text-[clamp(34px,5vw,56px)] font-normal leading-[1.05] tracking-[-0.035em] text-ink">
            {title}
          </h1>
          <p className="mt-3 text-sm text-muted">Last updated: {updated}</p>
          <p className="mt-8 text-base leading-[1.75] text-muted md:text-lg">
            {intro}
          </p>

          {/* table of contents */}
          <nav
            aria-label="On this page"
            className="mt-10 rounded-2xl border border-line bg-bg p-6"
          >
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.13em] text-muted">
              On this page
            </p>
            <ol className="grid gap-x-8 gap-y-2 text-sm sm:grid-cols-2">
              {sections.map((s, i) => (
                <li key={s.heading}>
                  <a
                    href={`#s${i + 1}`}
                    className="text-ink transition hover:text-accent-deep"
                  >
                    {i + 1}. {s.heading}
                  </a>
                </li>
              ))}
            </ol>
          </nav>

          <div className="mt-12 space-y-12">
            {sections.map((s, i) => (
              <section key={s.heading} id={`s${i + 1}`} className="scroll-mt-24">
                <h2 className="text-2xl font-semibold tracking-[-0.02em] text-ink">
                  {i + 1}. {s.heading}
                </h2>
                <div className="mt-4 space-y-4">
                  {s.blocks.map((b, j) =>
                    b.type === "p" ? (
                      <p
                        key={j}
                        className="text-base leading-[1.75] text-muted"
                      >
                        {b.text}
                      </p>
                    ) : (
                      <ul
                        key={j}
                        className="list-disc space-y-2 pl-6 text-base leading-[1.7] text-muted marker:text-accent-deep"
                      >
                        {b.items.map((it) => (
                          <li key={it}>{it}</li>
                        ))}
                      </ul>
                    )
                  )}
                </div>
              </section>
            ))}
          </div>
        </article>
      </main>
    </>
  );
}