import { Link } from 'react-router-dom';
import { Painting } from '../art/Painting';
import Reveal, { RevealText } from '../components/Reveal';
import { JOURNAL } from '../data/journal';

export default function JournalStrip() {
  return (
    <section className="defer-paint relative py-24 sm:py-32" aria-labelledby="journal-title">
      <div className="shell">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <Reveal variant="fade">
              <p className="eyebrow mb-4 flex items-center gap-3">
                <span className="inline-block h-px w-10 bg-gold/60" />
                Salle V · The Reading Room
              </p>
            </Reveal>
            <RevealText as="h2" id="journal-title" text="From the Journal" className="block font-display text-[clamp(2.2rem,6vw,4.4rem)] font-light leading-[0.95] text-cream" />
          </div>
          <Link to="/journal" className="btn-ghost">All entries</Link>
        </div>

        <ul className="mt-12 grid gap-5 md:grid-cols-3">
          {JOURNAL.slice(0, 3).map((e, i) => (
            <li key={e.slug}>
              <Reveal variant="up" delay={i * 110}>
                <Link
                  to={`/journal/${e.slug}`}
                  className="group relative block h-full overflow-hidden rounded-[14px] card-oil transition-shadow duration-600 hover:shadow-[0_44px_80px_-40px_rgba(0,0,0,.95)]"
                >
                  <div className="relative aspect-[16/10] overflow-hidden">
                    <Painting id={e.painting} decorative className="h-full w-full transition-transform duration-[1.3s] ease-silk group-hover:scale-110" style={{ opacity: 0.72 }} />
                    <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, rgba(7,10,24,.15), rgba(7,10,24,.9))' }} />
                    <span className="absolute left-4 top-4 rounded-full border border-cream/22 bg-midnight-900/65 px-3 py-1 font-sans text-[9px] uppercase tracking-widest2 text-cream/80 backdrop-blur">
                      {e.category}
                    </span>
                  </div>
                  <div className="p-5">
                    <p className="font-sans text-[10px] uppercase tracking-widest2 text-cream/35">
                      {new Date(e.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })} · {e.read}
                    </p>
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
    </section>
  );
}
