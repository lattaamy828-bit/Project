import { Link } from 'react-router-dom';
import { Painting } from '../art/Painting';
import { GiltRule } from '../components/Divider';

export default function NotFound() {
  return (
    <div className="shell flex min-h-[86svh] flex-col items-center justify-center py-24 text-center">
      <div className="relative mb-10 w-full max-w-[420px] overflow-hidden rounded-sm gilt-lux" style={{ aspectRatio: '4 / 3' }}>
        <Painting id="bedroom" decorative className="h-full w-full" style={{ opacity: 0.35 }} />
        <div className="absolute inset-0 grid place-items-center">
          <span className="font-display text-[clamp(4rem,14vw,7rem)] font-light leading-none text-gilt">404</span>
        </div>
      </div>
      <h1 className="max-w-[18ch] font-display text-[clamp(1.8rem,5vw,3.2rem)] font-light leading-tight text-cream">
        This wall is bare
      </h1>
      <p className="mt-4 max-w-[44ch] font-sans text-[15px] leading-relaxed text-cream/50">
        Whatever hung here has been taken down, or perhaps never arrived. The rest of the museum is open.
      </p>
      <GiltRule className="mx-auto mt-10 max-w-[240px]" />
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link to="/" className="btn-gold">Back to the entrance</Link>
        <Link to="/gallery" className="btn-ghost">Visit the gallery</Link>
      </div>
    </div>
  );
}
