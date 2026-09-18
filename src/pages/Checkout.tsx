import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Check, Lock } from 'lucide-react';
import { useShop } from '../store/shop';
import { getProduct } from '../data/products';
import { Painting } from '../art/Painting';
import Vessel from '../components/Vessel';
import { GiltRule } from '../components/Divider';
import { mulberry32 } from '../art/rng';
import { droplets, splash } from '../art/strokes';
import { useMotionPrefs } from '../hooks/useMotionPrefs';

const money = (n: number) => `€${n.toFixed(2)}`;

/** The confirmation seal: a paint splash that blooms behind a gilded check. */
function OrderConfirmed({ orderNo, onReset }: { orderNo: string; onReset(): void }) {
  const { reduced } = useMotionPrefs();
  const [bloom, setBloom] = useState(reduced);
  const splashes = useMemo(() => {
    const rand = mulberry32(31337);
    return [
      { d: splash(100, 100, 72, rand, 30), fill: '#1b3a8c', op: 0.55, delay: 0 },
      { d: droplets(100, 100, 72, rand, 9), fill: '#2a5fd7', op: 0.5, delay: 90 },
      { d: splash(100, 100, 54, rand, 26), fill: '#2a5fd7', op: 0.7, delay: 150 },
      { d: splash(100, 100, 38, rand, 22), fill: '#e3b23c', op: 0.96, delay: 280 },
      { d: droplets(100, 100, 44, rand, 6), fill: '#f2c14e', op: 0.85, delay: 360 },
    ];
  }, []);

  useEffect(() => {
    const t = window.setTimeout(() => setBloom(true), 80);
    return () => window.clearTimeout(t);
  }, []);

  return (
    <div className="shell flex min-h-[80svh] flex-col items-center justify-center py-24 text-center">
      <div className="relative h-52 w-52">
        <svg viewBox="0 0 200 200" className="absolute inset-0 h-full w-full" aria-hidden="true">
          {splashes.map((s, i) => (
            <path
              key={i}
              d={s.d}
              fill={s.fill}
              style={{
                transformOrigin: '100px 100px',
                transform: bloom ? 'scale(1) rotate(0deg)' : 'scale(0) rotate(-40deg)',
                opacity: bloom ? s.op : 0,
                transition: `transform .95s cubic-bezier(.22,1,.36,1) ${s.delay}ms, opacity .7s ease ${s.delay}ms`,
              }}
            />
          ))}
        </svg>
        <div
          className="absolute inset-0 grid place-items-center"
          style={{
            opacity: bloom ? 1 : 0,
            transform: bloom ? 'scale(1)' : 'scale(.6)',
            transition: 'opacity .6s ease .5s, transform .8s cubic-bezier(.22,1,.36,1) .5s',
          }}
        >
          <Check className="h-12 w-12 text-midnight" strokeWidth={2.8} />
        </div>
      </div>

      <p className="eyebrow mt-8">Order {orderNo}</p>
      <h1 className="mt-4 max-w-[16ch] font-display text-[clamp(2.2rem,6vw,4rem)] font-light leading-[0.95] text-cream">
        The frame is on its way
      </h1>
      <p className="mx-auto mt-5 max-w-[46ch] font-sans text-[15px] leading-relaxed text-cream/55">
        Nothing was charged and nothing will ship — this is a demonstration. In the fiction, your
        pieces are being wrapped in linen at the atelier as we speak.
      </p>
      <GiltRule className="mx-auto mt-10 max-w-[280px]" />
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link to="/shop" className="btn-gold" onClick={onReset}>Continue through the boutique</Link>
        <Link to="/gallery" className="btn-ghost" onClick={onReset}>Return to the gallery</Link>
      </div>
    </div>
  );
}

export default function Checkout() {
  const { cart, subtotal, shipping, total, clearCart } = useShop();
  const [step, setStep] = useState(0);
  const [done, setDone] = useState<string | null>(null);
  const [form, setForm] = useState({ name: '', email: '', address: '', city: '', postcode: '', country: 'France' });

  useEffect(() => window.scrollTo({ top: 0 }), [step, done]);

  const lines = cart.map((l) => ({ line: l, p: getProduct(l.id) })).filter((x) => x.p);

  if (done) return <OrderConfirmed orderNo={done} onReset={() => setDone(null)} />;

  if (cart.length === 0) {
    return (
      <div className="shell flex min-h-[70svh] flex-col items-center justify-center py-24 text-center">
        <div className="mb-8 h-32 w-40 overflow-hidden rounded-sm gilt opacity-70">
          <Painting id="bedroom" decorative className="h-full w-full" />
        </div>
        <h1 className="font-display text-[clamp(2rem,5vw,3.2rem)] font-light text-cream">Nothing to wrap</h1>
        <p className="mt-4 max-w-[40ch] font-sans text-sm text-cream/50">
          The cart is empty. Choose something from the boutique and it will appear here.
        </p>
        <Link to="/shop" className="btn-gold mt-8">Enter the boutique</Link>
      </div>
    );
  }

  const steps = ['Details', 'Delivery', 'Confirmation'];
  const canAdvance =
    step === 0 ? form.name.trim().length > 1 && /\S+@\S+\.\S+/.test(form.email) : step === 1 ? form.address.trim().length > 3 && form.city.trim().length > 1 : true;

  const field = (key: keyof typeof form, label: string, type = 'text', autoComplete?: string) => (
    <div>
      <label htmlFor={key} className="eyebrow mb-2 block">{label}</label>
      <input
        id={key}
        type={type}
        autoComplete={autoComplete}
        value={form[key]}
        onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
        className="field"
        required
      />
    </div>
  );

  return (
    <div className="shell pb-28 pt-[calc(var(--nav-h)+3rem)]">
      <Link to="/shop" className="mb-8 inline-flex items-center gap-2 font-sans text-[10px] uppercase tracking-widest2 text-cream/45 transition hover:text-gold-200">
        <ArrowLeft className="h-3 w-3" strokeWidth={1.8} /> Keep looking
      </Link>

      <h1 className="font-display text-[clamp(2.2rem,6vw,4rem)] font-light leading-none text-cream">Checkout</h1>
      <p className="mt-3 font-sans text-[12px] uppercase tracking-widest2 text-gold-200/70">
        Demonstration only — no payment is processed
      </p>

      {/* Step rail */}
      <ol className="mt-10 flex flex-wrap items-center gap-x-4 gap-y-2">
        {steps.map((s, i) => (
          <li key={s} className="flex items-center gap-3">
            <span
              className="grid h-8 w-8 place-items-center rounded-full border font-sans text-[11px] transition-all duration-500"
              style={{
                borderColor: i <= step ? 'rgba(227,178,60,.8)' : 'rgba(244,234,215,.18)',
                background: i < step ? '#e3b23c' : 'transparent',
                color: i < step ? '#070a18' : i === step ? '#f7dd9b' : 'rgba(244,234,215,.4)',
              }}
            >
              {i < step ? <Check className="h-3.5 w-3.5" strokeWidth={3} /> : i + 1}
            </span>
            <span className="font-sans text-[10px] uppercase tracking-widest2" style={{ color: i === step ? '#f4ead7' : 'rgba(244,234,215,.4)' }}>{s}</span>
            {i < steps.length - 1 && <span className="hidden h-px w-10 bg-cream/15 sm:block" />}
          </li>
        ))}
      </ol>

      <div className="mt-10 grid gap-10 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
        <div>
          {step === 0 && (
            <div className="space-y-5" style={{ animation: 'stepIn .5s cubic-bezier(.22,1,.36,1) both' }}>
              <h2 className="font-display text-2xl text-cream">Who is this for?</h2>
              {field('name', 'Full name', 'text', 'name')}
              {field('email', 'Email address', 'email', 'email')}
              <p className="font-sans text-[11px] leading-relaxed text-cream/30">
                Nothing entered here is transmitted or stored anywhere. It stays in this browser tab.
              </p>
            </div>
          )}
          {step === 1 && (
            <div className="space-y-5" style={{ animation: 'stepIn .5s cubic-bezier(.22,1,.36,1) both' }}>
              <h2 className="font-display text-2xl text-cream">Where should it hang?</h2>
              {field('address', 'Street address', 'text', 'street-address')}
              <div className="grid gap-5 sm:grid-cols-2">
                {field('city', 'City', 'text', 'address-level2')}
                {field('postcode', 'Postcode', 'text', 'postal-code')}
              </div>
              {field('country', 'Country', 'text', 'country-name')}
            </div>
          )}
          {step === 2 && (
            <div className="space-y-5" style={{ animation: 'stepIn .5s cubic-bezier(.22,1,.36,1) both' }}>
              <h2 className="font-display text-2xl text-cream">Confirm</h2>
              <dl className="card-oil space-y-3 rounded-xl p-5 font-sans text-sm">
                <div className="flex justify-between gap-4"><dt className="text-cream/40">Name</dt><dd className="text-cream/80">{form.name || '—'}</dd></div>
                <div className="flex justify-between gap-4"><dt className="text-cream/40">Email</dt><dd className="truncate text-cream/80">{form.email || '—'}</dd></div>
                <div className="flex justify-between gap-4"><dt className="text-cream/40">Address</dt><dd className="text-right text-cream/80">{[form.address, form.city, form.postcode, form.country].filter(Boolean).join(', ') || '—'}</dd></div>
              </dl>
              <div className="flex items-center gap-3 rounded-xl border border-gold/25 bg-gold/5 px-4 py-3">
                <Lock className="h-4 w-4 shrink-0 text-gold-200" strokeWidth={1.5} />
                <p className="font-sans text-[12px] leading-relaxed text-gold-200/90">
                  No card details are requested and no payment is taken. Placing this order only plays an animation.
                </p>
              </div>
            </div>
          )}

          <div className="mt-8 flex gap-3">
            {step > 0 && (
              <button type="button" onClick={() => setStep((s) => s - 1)} className="btn-ghost">Back</button>
            )}
            {step < 2 ? (
              <button type="button" disabled={!canAdvance} onClick={() => setStep((s) => s + 1)} className="btn-gold flex-1 disabled:cursor-not-allowed disabled:opacity-40">
                Continue
              </button>
            ) : (
              <button
                type="button"
                onClick={() => {
                  setDone(`AÉ-${String(Math.floor(1000 + Math.random() * 8999))}`);
                  clearCart();
                }}
                className="btn-gold flex-1"
              >
                Place the order
              </button>
            )}
          </div>
        </div>

        {/* Summary */}
        <aside className="lg:sticky lg:top-[calc(var(--nav-h)+1.5rem)] lg:self-start">
          <div className="card-oil rounded-2xl p-5">
            <p className="eyebrow mb-4">Your selection</p>
            <ul className="space-y-3">
              {lines.map(({ line, p }) =>
                p ? (
                  <li key={`${line.id}-${line.variant}`} className="flex items-center gap-3">
                    <span className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-midnight-800">
                      <Vessel kind={p.vessel} hue={p.hue} painting={p.painting} art={false} className="h-full w-full" shadow={false} />
                      <span className="absolute -right-0 -top-0 grid h-5 w-5 place-items-center rounded-full bg-gold text-[10px] font-semibold text-midnight">{line.qty}</span>
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate font-display text-base text-cream">{p.name}</span>
                      <span className="block truncate font-sans text-[10px] text-cream/40">{line.variant}</span>
                    </span>
                    <span className="shrink-0 font-sans text-sm tabular-nums text-gold-200">{money(p.price * line.qty)}</span>
                  </li>
                ) : null,
              )}
            </ul>
            <div className="rule my-5" />
            <dl className="space-y-2 font-sans text-sm">
              <div className="flex justify-between text-cream/60"><dt>Subtotal</dt><dd>{money(subtotal)}</dd></div>
              <div className="flex justify-between text-cream/60">
                <dt>Shipping</dt>
                <dd>{shipping === 0 ? <span className="text-gold-200">Complimentary</span> : money(shipping)}</dd>
              </div>
              <div className="flex justify-between pt-3 font-display text-2xl text-cream"><dt>Total</dt><dd>{money(total)}</dd></div>
            </dl>
          </div>
        </aside>
      </div>
      <style>{`@keyframes stepIn{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:none}}`}</style>
    </div>
  );
}
