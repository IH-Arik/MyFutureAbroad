import { Link } from "react-router-dom";
import type { Resource } from "@/lib/types";

export default function HomeGuides({ translatedGuides }: { translatedGuides: Resource[] }) {
  return (
    <section className="mx-auto mt-24 w-full max-w-[80vw] sm:px-4 lg:px-6">
      <div className="mb-10 flex items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-semibold text-foreground sm:text-4xl">Guides</h2>
          <p className="mt-2 text-muted-foreground">Useful guides and resources</p>
        </div>
        <Link to="/resources" className="mt-2 text-xs sm:text-sm text-muted-foreground hover:text-foreground transition-colors whitespace-nowrap">View all</Link>
      </div>
      {translatedGuides.length === 0 ? (
        <p className="text-sm text-muted-foreground">No guides available</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {translatedGuides.map((guide) => {
            const displayTag = guide.tags?.[0] ?? guide.type;
            return (
              <Link
                key={guide.id}
                to={`/resources/${guide.id}`}
                className="group rounded-[1.5rem] border border-slate-200 dark:border-white/10 bg-white dark:bg-[#1f1f1f] p-6 transition hover:-translate-y-1 hover:shadow-lg block"
              >
                <span className="inline-block rounded-full px-3 py-1 text-xs font-medium text-[#8B6949] mb-4" style={{ background: "linear-gradient(to right, rgba(139,105,73,0.15), rgba(212,193,161,0.15))" }}>
                  {displayTag}
                </span>
                <h3 className="text-base font-semibold text-foreground leading-snug mb-2">{guide.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed mb-4 line-clamp-3">{guide.excerpt}</p>
                <p className="text-xs text-muted-foreground">{guide.reading_time_minutes} min read</p>
              </Link>
            );
          })}
        </div>
      )}
    </section>
  );
}
