import { useState } from 'react';
import { Scale, X } from 'lucide-react';
import { useShop } from '../store/shop';
import { getProduct, discountOf } from '../data/products';
import Vessel from './Vessel';

const ROWS: Array<{ label: string; get(id: string): string }> = [
  { label: 'Price', get: (id) => `€${getProduct(id)?.price ?? 0}` },
  { label: 'Was', get: (id) => `€${getProduct(id)?.originalPrice ?? 0}` },
  { label: 'Saving', get: (id) => { const p = getProduct(id); return p && discountOf(p) ? `−${discountOf(p)}%` : '—'; } },
  { label: 'Rating', get: (id) => `${getProduct(id)?.rating.toFixed(1)} / 5` },
  { label: 'Reviews', get: (id) => (getProduct(id)?.reviewCount ?? 0).toLocaleString() },
  { label: 'Size', get: (id) => getProduct(id)?.size ?? '—' },
  { label: 'Category', get: (id) => getProduct(id)?.category ?? '—' },
  { label: 'Collection', get: (id) => getProduct(id)?.collection ?? '—' },
  { label: 'Shades', get: (id) => String(getProduct(id)?.variants.length ?? 0) },
  { label: 'Stock', get: (id) => (getProduct(id)?.stock ? `${getProduct(id)!.stock} on hand` : 'Sold out') },
];

/** A docked tray that expands into a side-by-side comparison of up to three pieces. */
export default function CompareBar() {
  const { compare, toggleCompare, clearCompare, add } = useShop();
  const [open, setOpen] = useState(false);
  if (compare.length === 0) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-[75] px-4 pb-4">
      <div className="glass mx-auto max-w-[1000px] overflow-hidden rounded-2xl shadow-[0_40px_90px_-40px_rgba(0,0,0,1)]">
        <div className="flex items-center gap-3 px-4 py-3">
          <Scale className="h-4 w-4 shrink-0 text-gold-200" strokeWidth={1.4} />
          <p className="font-sans text-[11px] uppercase tracking-widest2 text-cream/70">
            Comparing {compare.length} of 3
          </p>
          <div className="ml-2 flex min-w-0 flex-1 gap-2 overflow-x-auto no-scrollbar">
            {compare.map((id) => {
              const p = getProduct(id);
              if (!p) return null;
              return (
                <span key={id} className="flex shrink-0 items-center gap-1.5 rounded-full border border-cream/15 py-1 pl-1 pr-2">
                  <span className="h-6 w-6 overflow-hidden rounded-full bg-midnight-800">
                    <Vessel kind={p.vessel} hue={p.hue} className="h-full w-full" shadow={false} />
                  </span>
                  <span className="max-w-[110px] truncate font-sans text-[11px] text-cream/80">{p.name}</span>
                  <button type="button" onClick={() => toggleCompare(id)} className="text-cream/40 transition hover:text-cream" aria-label={`Remove ${p.name} from comparison`}>
                    <X className="h-3 w-3" />
                  </button>
                </span>
              );
            })}
          </div>
          <button type="button" onClick={() => setOpen((v) => !v)} className="btn-quiet shrink-0" aria-expanded={open}>
            {open ? 'Hide' : 'Compare'}
          </button>
          <button type="button" onClick={clearCompare} className="shrink-0 font-sans text-[10px] uppercase tracking-widest2 text-cream/40 transition hover:text-cream">
            Clear
          </button>
        </div>

        <div className="overflow-hidden" style={{ maxHeight: open ? 520 : 0, transition: 'max-height .6s cubic-bezier(.22,1,.36,1)' }}>
          <div className="overflow-x-auto border-t border-cream/10 px-4 py-4">
            <table className="w-full min-w-[520px] border-collapse">
              <caption className="sr-only">Side-by-side comparison of selected products</caption>
              <thead>
                <tr>
                  <th scope="col" className="w-28 pb-3 text-left font-sans text-[10px] uppercase tracking-widest2 text-cream/35">Attribute</th>
                  {compare.map((id) => {
                    const p = getProduct(id);
                    return (
                      <th key={id} scope="col" className="pb-3 text-left">
                        <span className="block font-display text-lg text-cream">{p?.name}</span>
                        <span className="block font-sans text-[10px] text-cream/40">{p?.subtitle}</span>
                      </th>
                    );
                  })}
                </tr>
              </thead>
              <tbody>
                {ROWS.map((r) => (
                  <tr key={r.label} className="border-t border-cream/6">
                    <th scope="row" className="py-2 text-left font-sans text-[10px] uppercase tracking-widest2 text-cream/35">{r.label}</th>
                    {compare.map((id) => (
                      <td key={id} className="py-2 font-sans text-[13px] text-cream/75">{r.get(id)}</td>
                    ))}
                  </tr>
                ))}
                <tr className="border-t border-cream/6">
                  <td />
                  {compare.map((id) => {
                    const p = getProduct(id);
                    return (
                      <td key={id} className="pt-3">
                        {p && (
                          <button type="button" onClick={(e) => add(p, undefined, 1, (e.currentTarget as HTMLElement).getBoundingClientRect())} className="btn-quiet">
                            Add to cart
                          </button>
                        )}
                      </td>
                    );
                  })}
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
