import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Painting } from '../art/Painting';
import { GiltRule } from './Divider';
import { useMotionPrefs } from '../hooks/useMotionPrefs';
import { CATEGORIES } from '../data/products';

const COLUMNS: Array<{ title: string; links: Array<[string, string]> }> = [
  {
    title: 'The Boutique',
    links: [
      ['All pieces', '/shop'],
      ['Collections', '/collections'],
      ['Gift sets', '/shop?category=Gift%20Sets'],
      ['New arrivals', '/shop?sort=new'],
    ],
  },
  {
    title: 'The Museum',
    links: [
      ['Art Gallery', '/gallery'],
      ['The Masters', '/gallery'],
      ['Journal', '/journal'],
      ['About the house', '/about'],
    ],
  },
];

export default function Footer({ onReplayIntro }: { onReplayIntro(): void }) {
  const { userOff, setUserOff } = useMotionPrefs();
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  return (
    <footer className="relative mt-24 overflow-hidden border-t border-cream/10 bg-ink/70">
      <div className="absolute inset-0 -z-10 opacity-[0.12]">
        <Painting id="wheatfield" decorative className="h-full w-full" />
      </div>
      <div className="absolute inset-0 -z-10" style={{ background: 'linear-gradient(180deg, #070a18, rgba(5,6,13,.94))' }} />

      {/* Newsletter */}
      <div className="shell border-b border-cream/10 py-16 text-center">
        <p className="eyebrow mb-4">The Private View</p>
        <h2 className="mx-auto max-w-[16ch] font-display text-[clamp(1.8rem,5vw,3.2rem)] font-light leading-tight text-cream">
          First sight of every new canvas
        </h2>
        <p className="mx-auto mt-4 max-w-[46ch] font-sans text-sm leading-relaxed text-cream/50">
          One letter a season: what we are formulating, what we abandoned, and which painting is
          currently on the wall. A fictional list, for a fictional house.
        </p>
        <form
          className="mx-auto mt-7 flex w-full max-w-[460px] flex-col gap-3 sm:flex-row"
          onSubmit={(e) => {
            e.preventDefault();
            setSent(true);
            setEmail('');
            window.setTimeout(() => setSent(false), 4200);
          }}
        >
          <label htmlFor="newsletter" className="sr-only-focusable">Email address</label>
          <input
            id="newsletter"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="field flex-1 text-center sm:text-left"
          />
          <button type="submit" className="btn-gold shrink-0">{sent ? 'Welcome in' : 'Request an invitation'}</button>
        </form>
        <p className="mt-3 font-sans text-[10px] uppercase tracking-widest2 text-cream/25" aria-live="polite">
          {sent ? 'Nothing was actually sent — this is a demo.' : 'No real emails are collected.'}
        </p>
      </div>

      <div className="shell grid gap-10 py-14 md:grid-cols-[minmax(0,1.4fr)_repeat(3,minmax(0,1fr))]">
        <div>
          <Link to="/" className="inline-flex items-center gap-3" aria-label="Atelier Étoile — home">
            <svg viewBox="0 0 40 40" className="h-10 w-10" aria-hidden="true">
              <circle cx="20" cy="20" r="18" fill="none" stroke="#e3b23c" strokeOpacity="0.35" />
              <path d="M9,26 C15,14 26,12 32,19" fill="none" stroke="#e3b23c" strokeWidth="1.8" strokeLinecap="round" />
              <path d="M11,30 C18,22 26,21 32,25" fill="none" stroke="#2a5fd7" strokeWidth="1.6" strokeLinecap="round" />
              <circle cx="27" cy="13" r="4" fill="none" stroke="#f2c14e" strokeWidth="1.4" />
              <circle cx="27" cy="13" r="1.4" fill="#f2c14e" />
            </svg>
            <span>
              <span className="block font-display text-xl tracking-[0.2em] text-cream">ATELIER</span>
              <span className="block font-script text-base leading-4 text-gold-200">Étoile</span>
            </span>
          </Link>
          <p className="mt-5 max-w-[42ch] font-sans text-[13px] leading-relaxed text-cream/45">
            A fictional maison de beauté invented for this demo. Every product, price, review,
            statistic and ingredient list on this site is imagined, and every canvas is generated
            in code as an interpretation — never a reproduction — of the work it is named after.
          </p>
          <GiltRule className="mt-6 max-w-[220px]" />
        </div>

        {COLUMNS.map((col) => (
          <nav key={col.title} aria-label={col.title}>
            <p className="eyebrow mb-4">{col.title}</p>
            <ul className="space-y-2.5">
              {col.links.map(([label, to]) => (
                <li key={label}>
                  <Link to={to} className="font-sans text-[13px] text-cream/55 transition-colors hover:text-gold-200">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}

        <nav aria-label="Rooms">
          <p className="eyebrow mb-4">Rooms</p>
          <ul className="space-y-2.5">
            {CATEGORIES.slice(0, 6).map((c) => (
              <li key={c}>
                <Link to={`/shop?category=${encodeURIComponent(c)}`} className="font-sans text-[13px] text-cream/55 transition-colors hover:text-gold-200">
                  {c}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <div className="shell flex flex-col items-center justify-between gap-4 border-t border-cream/10 py-6 sm:flex-row">
        <p className="font-sans text-[10px] uppercase tracking-widest2 text-cream/30">
          © MMXXVI Atelier Étoile — a fictional demo. Not a real company.
        </p>
        <div className="flex flex-wrap items-center gap-4">
          <button type="button" onClick={onReplayIntro} className="font-sans text-[10px] uppercase tracking-widest2 text-cream/40 transition hover:text-gold-200">
            Replay the overture
          </button>
          <button
            type="button"
            onClick={() => setUserOff(!userOff)}
            className="flex items-center gap-2 font-sans text-[10px] uppercase tracking-widest2 text-cream/40 transition hover:text-gold-200"
            aria-pressed={userOff}
          >
            <span className="relative block h-4 w-8 rounded-full border border-cream/25">
              <span
                className="absolute top-[2px] h-[10px] w-[10px] rounded-full bg-gold transition-all duration-400"
                style={{ left: userOff ? 2 : 16 }}
              />
            </span>
            Motion {userOff ? 'off' : 'on'}
          </button>
        </div>
      </div>
    </footer>
  );
}
