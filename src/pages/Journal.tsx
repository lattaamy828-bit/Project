import { useEffect } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { JOURNAL, getEntry } from '../data/journal';
import { Painting } from '../art/Painting';
import Reveal, { RevealText } from '../components/Reveal';
import { GiltRule } from '../components/Divider';

const fmt = (d: string) => new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });

export function JournalIndex() {
  useEffect(() => window.scrollTo({ top: 0 }), []);

  const [lead, ...rest] = JOURNAL;

  return (
    <>
      <header className="relative overflow-hidden pb-12 pt-[calc(var(--nav-h)+4rem)]">
        <div className="absolute inset-0 -z-10 opacity-25">
          <Painting id="bedroom" decorative className="h-full w-full" />
        </div>
        <div className="absolute inset-0 -z-10" style={{ background: 'linear-gradient(180deg, rgba(5,6,13,.82), #070a18 88%)' }} />
        <div className="shell">
          <p className="eyebrow mb-4 flex items-center gap-3">
            <span className="inline-block h-px w-10 bg-gold/60" />
            The Reading Room · {JOURNAL.length} entries
          </p>
          <RevealText as="h1" text="The Journal" className="block font-display text-[clamp(2.6rem,8vw,5.4rem)] font-light leading-[0.92] text-cream" />
          <p className="mt-5 max-w-[52ch] font-sans text-[15px] leading-relaxed text-cream/55">
            Notes on method, materials and the arguments behind them. Fiction, written for this demo.
          </p>
        </div>
      </header>

      <div className="shell pb-28">
        <Reveal variant="up">
          <Link to={`/journal/${lead.slug}`} className="group relative mb-6 grid overflow-hidden rounded-2xl border border-cream/12 md:grid-cols-2">
            <div className="relative min-h-[260px] overflow-hidden">
              <Painting id={lead.painting} decorative className="absolute inset-0 h-full w-full transition-transform duration-[1.4s] ease-silk group-hover:scale-110" />
              <div className="absolute inset-0" style={{ background: 'linear-gradient(110deg, rgba(7,10,24,.2), rgba(7,10,24,.8))' }} />
            </div>
            <div className="flex flex-col justify-center p-7 sm:p-10">
              <p className="eyebrow">{lead.category} · {fmt(lead.date)} · {lead.read}</p>
              <h2 className="mt-4 font-display text-[clamp(1.9rem,4.4vw,3rem)] font-light leading-tight text-cream transition-colors group-hover:text-gold-200">
                {lead.title}
              </h2>
              <p className="mt-4 max-w-[46ch] font-sans text-[15px] leading-relaxed text-cream/55">{lead.dek}</p>
              <span className="mt-7 font-sans text-[10px] uppercase tracking-widest2 text-gold-200/80">Read the entry →</span>
            </div>
          </Link>
        </Reveal>

        <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {rest.map((e, i) => (
            <li key={e.slug}>
              <Reveal variant="up" delay={i * 90}>
                <Link to={`/journal/${e.slug}`} className="group relative block h-full overflow-hidden rounded-[14px] card-oil">
                  <div className="relative aspect-[16/10] overflow-hidden">
                    <Painting id={e.painting} decorative className="h-full w-full transition-transform duration-[1.3s] ease-silk group-hover:scale-110" style={{ opacity: 0.72 }} />
                    <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, rgba(7,10,24,.12), rgba(7,10,24,.9))' }} />
                    <span className="absolute left-4 top-4 rounded-full border border-cream/22 bg-midnight-900/65 px-3 py-1 font-sans text-[9px] uppercase tracking-widest2 text-cream/80 backdrop-blur">{e.category}</span>
                  </div>
                  <div className="p-5">
                    <p className="font-sans text-[10px] uppercase tracking-widest2 text-cream/35">{fmt(e.date)} · {e.read}</p>
                    <h3 className="mt-2 font-display text-2xl leading-tight text-cream transition-colors group-hover:text-gold-200">{e.title}</h3>
                    <p className="mt-2 font-sans text-[13px] leading-relaxed text-cream/50">{e.dek}</p>
                  </div>
                  <span className="absolute inset-x-0 bottom-0 h-px origin-left scale-x-0 bg-gradient-to-r from-gold to-transparent transition-transform duration-700 ease-silk group-hover:scale-x-100" />
                </Link>
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

export function JournalEntry() {
  const { slug = '' } = useParams();
  const entry = getEntry(slug);

  useEffect(() => window.scrollTo({ top: 0 }), [slug]);

  if (!entry) return <Navigate to="/journal" replace />;
  const more = JOURNAL.filter((e) => e.slug !== entry.slug).slice(0, 3);

  return (
    <>
      <header className="relative flex min-h-[58svh] items-end overflow-hidden pb-12 pt-[calc(var(--nav-h)+4rem)]">
        <div className="absolute inset-0 -z-10">
          <Painting id={entry.painting} decorative className="h-full w-full" style={{ opacity: 0.55 }} />
        </div>
        <div className="absolute inset-0 -z-10" style={{ background: 'linear-gradient(180deg, rgba(5,6,13,.62), rgba(7,10,24,.72) 50%, #070a18 96%)' }} />
        <div className="shell">
          <Link to="/journal" className="mb-7 inline-flex items-center gap-2 font-sans text-[10px] uppercase tracking-widest2 text-cream/50 transition hover:text-gold-200">
            <ArrowLeft className="h-3 w-3" strokeWidth={1.8} /> All entries
          </Link>
          <p className="eyebrow mb-4">{entry.category} · {fmt(entry.date)} · {entry.read}</p>
          <RevealText as="h1" text={entry.title} className="block max-w-[18ch] font-display text-[clamp(2.2rem,6.4vw,4.4rem)] font-light leading-[0.95] text-cream" />
          <p className="mt-5 max-w-[50ch] font-script text-[clamp(1.1rem,2.6vw,1.6rem)] text-gold-200/85">{entry.dek}</p>
        </div>
      </header>

      <article className="shell max-w-[720px] py-16">
        {entry.body.map((para, i) => (
          <Reveal key={i} variant="up" delay={i * 80}>
            <p
              className="mb-6 font-sans text-[16px] leading-[1.85] text-cream/65"
              style={i === 0 ? { fontSize: '19px', color: 'rgba(244,234,215,.82)' } : undefined}
            >
              {para}
            </p>
          </Reveal>
        ))}
        <GiltRule className="my-12" />
        <p className="font-sans text-[11px] leading-relaxed text-cream/30">
          Written for this demo. Atelier Étoile is a fictional house and nothing described here refers to a real product or company.
        </p>
      </article>

      <section className="shell pb-28" aria-label="More entries">
        <p className="eyebrow mb-6">Continue reading</p>
        <ul className="grid gap-5 sm:grid-cols-3">
          {more.map((e, i) => (
            <li key={e.slug}>
              <Reveal variant="up" delay={i * 90}>
                <Link to={`/journal/${e.slug}`} className="group block overflow-hidden rounded-[14px] card-oil">
                  <div className="relative aspect-[16/10] overflow-hidden">
                    <Painting id={e.painting} decorative className="h-full w-full transition-transform duration-[1.3s] ease-silk group-hover:scale-110" style={{ opacity: 0.7 }} />
                    <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, transparent, rgba(7,10,24,.9))' }} />
                  </div>
                  <div className="p-5">
                    <p className="font-sans text-[10px] uppercase tracking-widest2 text-cream/35">{e.category}</p>
                    <h3 className="mt-2 font-display text-xl leading-tight text-cream transition-colors group-hover:text-gold-200">{e.title}</h3>
                  </div>
                </Link>
              </Reveal>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
