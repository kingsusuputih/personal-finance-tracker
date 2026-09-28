import { Link } from "react-router-dom";
import { useI18n } from "../i18n/LanguageProvider.jsx";
import { LangToggle } from "../components/ui/LangToggle.jsx";
import { Badge } from "../components/ui/Badge.jsx";
import { changelogEntries } from "../constants/changelog.js";
import { CONTACT_EMAIL } from "../constants/legalContent.js";

const sectionTone = {
  added: "success",
  changed: "accent",
  fixed: "warning",
  security: "danger",
};

export default function ChangelogPage() {
  const { lang, t } = useI18n();

  return (
    <main className="flex min-h-dvh flex-col items-center p-4">
      <div className="w-full max-w-2xl">
        <header className="mb-8 flex items-start justify-between">
          <Link to="/" className="group" title={t("legal.back")}>
            <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-btn bg-accent font-brand text-lg font-bold text-accent-ink shadow-sm">
              F
            </div>
            <p className="kbd text-[10px] text-ink-3 transition-colors group-hover:text-accent">
              ← {t("app.name")}
            </p>
          </Link>
          <LangToggle />
        </header>

        <h1 className="mb-2 text-[clamp(1.75rem,5vw,2.5rem)] font-bold text-ink font-display">
          {t("changelog.title")}
        </h1>
        <p className="kbd mb-10 text-[11px] text-ink-3">
          {t("changelog.subtitle")}
        </p>

        <div className="rounded-card border border-rule bg-paper shadow-sm overflow-hidden divide-y divide-rule">
          {changelogEntries.map((entry) => {
            const data = entry[lang] || entry.en;
            return (
              <article key={entry.version} className="p-5 sm:p-6 hover:bg-paper-2/20 transition-colors">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-rule pb-3">
                  <div className="flex items-center gap-2">
                    <span className="kbd rounded bg-accent-soft px-2 py-0.5 text-xs font-semibold text-accent">
                      {entry.version}
                    </span>
                    <h2 className="text-base font-bold text-ink">
                      {data.title}
                    </h2>
                  </div>
                  <time dateTime={entry.date} className="kbd text-xs text-ink-3">
                    {entry.date}
                  </time>
                </div>

                {data.sections && data.sections.length > 0 ? (
                  <div className="mt-4 space-y-4">
                    {data.sections.map((sec, secIdx) => (
                      <div key={secIdx} className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Badge tone={sectionTone[sec.type] || "neutral"}>
                            {sec.label || sec.type}
                          </Badge>
                        </div>
                        <ul className="space-y-1.5 pl-1 text-sm leading-relaxed text-ink-2">
                          {sec.items.map((item, idx) => (
                            <li key={idx} className="flex items-start gap-2">
                              <span className="text-accent">•</span>
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                ) : (
                  <ul className="mt-3 space-y-2 text-sm leading-relaxed text-ink-2">
                    {(data.items || []).map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-accent">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </article>
            );
          })}
        </div>

        <footer className="mt-12 border-t border-rule pt-6 text-center">
          <p className="kbd text-[10px] text-ink-3">{CONTACT_EMAIL}</p>
        </footer>
      </div>
    </main>
  );
}
