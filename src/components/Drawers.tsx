import { useEffect, useRef, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Minus, Plus, ShoppingBag, Trash2, X } from 'lucide-react';
import { useShop } from '../store/shop';
import { getProduct, PRODUCTS } from '../data/products';
import Vessel from './Vessel';
import { FREE_SHIPPING_AT } from '../store/shop';

/**
 * Shared side-panel shell: focus is trapped while open, Escape closes, and the
 * page behind it is locked so the drawer never scrolls the document with it.
 */
function Drawer({
  open,
  onClose,
  title,
  children,
  footer,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  footer?: ReactNode;
}) {
  const panelRef = useRef<HTMLDivElement | null>(null);
  const restoreTo = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!open) return;
    restoreTo.current = document.activeElement as HTMLElement;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') return onClose();
      if (e.key !== 'Tab') return;
      const nodes = panelRef.current?.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])',
      );
      if (!nodes || nodes.length === 0) return;
      const first = nodes[0];
      const last = nodes[nodes.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener('keydown', onKey);
    const t = window.setTimeout(() => panelRef.current?.querySelector<HTMLElement>('button, a')?.focus(), 240);

    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener('keydown', onKey);
      window.clearTimeout(t);
      restoreTo.current?.focus?.();
    };
  }, [open, onClose]);

  return (
    <div
      className="fixed inset-0 z-[70]"
      aria-hidden={!open}
      style={{
        pointerEvents: open ? 'auto' : 'none',
        // `visibility` also removes the panel's controls from the tab order,
        // which `aria-hidden` alone does not do.
        visibility: open ? 'visible' : 'hidden',
        transition: open ? 'visibility 0s' : 'visibility 0s linear .62s',
      }}
    >
      <div
        className="absolute inset-0 bg-ink/78 backdrop-blur-sm"
        style={{ opacity: open ? 1 : 0, transition: 'opacity .55s cubic-bezier(.22,1,.36,1)' }}
        onClick={onClose}
      />
      <aside
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className="absolute inset-y-0 right-0 flex w-full max-w-[440px] flex-col border-l border-cream/12 bg-midnight-900/97 shadow-[0_0_120px_rgba(0,0,0,.9)]"
        style={{
          transform: open ? 'translateX(0)' : 'translateX(102%)',
          transition: 'transform .62s cubic-bezier(.22,1,.36,1)',
        }}
      >
        <div className="flex items-center justify-between border-b border-cream/10 px-6 py-5">
          <div>
            <p className="eyebrow">Atelier Étoile</p>
            <h2 className="mt-1 font-display text-2xl text-cream">{title}</h2>
          </div>
          <button type="button" onClick={onClose} className="grid h-10 w-10 place-items-center rounded-full border border-cream/15 text-cream/70 transition hover:border-gold/60 hover:text-gold-200" aria-label={`Close ${title}`}>
            <X className="h-4 w-4" strokeWidth={1.5} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto overscroll-contain px-6 py-5">{children}</div>
        {footer && <div className="border-t border-cream/10 px-6 py-5">{footer}</div>}
      </aside>
    </div>
  );
}

const money = (n: number) => `€${n.toFixed(2)}`;

export function CartDrawer() {
  const { cart, cartOpen, setCartOpen, setQty, remove, subtotal, shipping, total, clearCart } = useShop();
  const toFree = Math.max(0, FREE_SHIPPING_AT - subtotal);

  return (
    <Drawer open={cartOpen} onClose={() => setCartOpen(false)} title="Your Cart"
      footer={
        cart.length > 0 ? (
          <>
            <dl className="space-y-2 font-sans text-sm">
              <div className="flex justify-between text-cream/70"><dt>Subtotal</dt><dd>{money(subtotal)}</dd></div>
              <div className="flex justify-between text-cream/70">
                <dt>Shipping</dt>
                <dd>{shipping === 0 ? <span className="text-gold-200">Complimentary</span> : money(shipping)}</dd>
              </div>
              <div className="rule my-3" />
              <div className="flex justify-between font-display text-2xl text-cream"><dt>Total</dt><dd>{money(total)}</dd></div>
            </dl>
            <Link to="/checkout" onClick={() => setCartOpen(false)} className="btn-gold mt-5 w-full">
              Proceed to checkout
            </Link>
            <button type="button" onClick={clearCart} className="mt-3 w-full font-sans text-[10px] uppercase tracking-widest2 text-cream/40 transition hover:text-cream/80">
              Empty the cart
            </button>
          </>
        ) : null
      }
    >
      {cart.length === 0 ? (
        <div className="grid h-full place-items-center text-center">
          <div>
            <ShoppingBag className="mx-auto h-10 w-10 text-cream/20" strokeWidth={1} />
            <p className="mt-5 font-display text-2xl text-cream/85">The cart is an empty frame</p>
            <p className="mt-2 max-w-[28ch] font-sans text-sm text-cream/45">Nothing hung here yet. The galleries are through the door.</p>
            <Link to="/shop" onClick={() => setCartOpen(false)} className="btn-ghost mt-6">Enter the boutique</Link>
          </div>
        </div>
      ) : (
        <>
          {toFree > 0 && (
            <div className="mb-5 rounded-xl border border-gold/25 bg-gold/5 px-4 py-3">
              <p className="font-sans text-[11px] text-gold-200">
                {money(toFree)} more for complimentary shipping
              </p>
              <div className="mt-2 h-[3px] w-full overflow-hidden rounded-full bg-cream/10">
                <div className="h-full rounded-full bg-gradient-to-r from-cobalt to-gold transition-[width] duration-700 ease-silk" style={{ width: `${Math.min(100, (subtotal / FREE_SHIPPING_AT) * 100)}%` }} />
              </div>
            </div>
          )}
          <ul className="space-y-4">
            {cart.map((line) => {
              const p = getProduct(line.id);
              if (!p) return null;
              return (
                <li key={`${line.id}-${line.variant}`} className="card-oil flex gap-4 rounded-xl p-3">
                  <Link to={`/product/${p.id}`} onClick={() => setCartOpen(false)} className="relative w-[72px] shrink-0 overflow-hidden rounded-lg bg-midnight-800">
                    <Vessel kind={p.vessel} hue={p.hue} painting={p.painting} art={false} className="h-full w-full" shadow={false} />
                  </Link>
                  <div className="min-w-0 flex-1">
                    <Link to={`/product/${p.id}`} onClick={() => setCartOpen(false)} className="block truncate font-display text-lg text-cream transition hover:text-gold-200">
                      {p.name}
                    </Link>
                    <p className="truncate font-sans text-[11px] text-cream/45">{line.variant} · {p.size}</p>
                    <div className="mt-2.5 flex items-center justify-between gap-2">
                      <div className="flex items-center rounded-full border border-cream/15">
                        <button type="button" onClick={() => setQty(line.id, line.variant, line.qty - 1)} className="grid h-7 w-7 place-items-center text-cream/70 transition hover:text-gold-200" aria-label={`Decrease quantity of ${p.name}`}>
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="min-w-6 text-center font-sans text-xs tabular-nums text-cream">{line.qty}</span>
                        <button type="button" onClick={() => setQty(line.id, line.variant, line.qty + 1)} className="grid h-7 w-7 place-items-center text-cream/70 transition hover:text-gold-200" aria-label={`Increase quantity of ${p.name}`}>
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>
                      <span className="font-sans text-sm tabular-nums text-gold-200">{money(p.price * line.qty)}</span>
                      <button type="button" onClick={() => remove(line.id, line.variant)} className="grid h-7 w-7 place-items-center rounded-full text-cream/35 transition hover:text-[#c9523f]" aria-label={`Remove ${p.name} from cart`}>
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </>
      )}
    </Drawer>
  );
}

export function WishlistDrawer() {
  const { wishlist, wishOpen, setWishOpen, toggleWish, add } = useShop();
  const items = wishlist.map(getProduct).filter(Boolean);

  return (
    <Drawer open={wishOpen} onClose={() => setWishOpen(false)} title="Your Wishlist">
      {items.length === 0 ? (
        <div className="grid h-full place-items-center text-center">
          <div>
            <Heart className="mx-auto h-10 w-10 text-cream/20" strokeWidth={1} />
            <p className="mt-5 font-display text-2xl text-cream/85">Nothing set aside</p>
            <p className="mt-2 max-w-[30ch] font-sans text-sm text-cream/45">Save a piece and it waits here, like a reserved seat in the gallery.</p>
            <Link to="/shop" onClick={() => setWishOpen(false)} className="btn-ghost mt-6">Browse the collection</Link>
          </div>
        </div>
      ) : (
        <ul className="space-y-4">
          {items.map((p) => p && (
            <li key={p.id} className="card-oil flex gap-4 rounded-xl p-3">
              <Link to={`/product/${p.id}`} onClick={() => setWishOpen(false)} className="w-[72px] shrink-0 overflow-hidden rounded-lg bg-midnight-800">
                <Vessel kind={p.vessel} hue={p.hue} painting={p.painting} art={false} className="h-full w-full" shadow={false} />
              </Link>
              <div className="min-w-0 flex-1">
                <Link to={`/product/${p.id}`} onClick={() => setWishOpen(false)} className="block truncate font-display text-lg text-cream transition hover:text-gold-200">{p.name}</Link>
                <p className="truncate font-sans text-[11px] text-cream/45">{p.subtitle}</p>
                <div className="mt-2.5 flex items-center gap-2">
                  <button type="button" onClick={(e) => add(p, undefined, 1, (e.currentTarget as HTMLElement).getBoundingClientRect())} className="btn-quiet !text-[9px]">
                    Add to cart
                  </button>
                  <span className="font-sans text-sm text-gold-200">{money(p.price)}</span>
                  <button type="button" onClick={() => toggleWish(p.id)} className="ml-auto grid h-7 w-7 place-items-center rounded-full text-cream/35 transition hover:text-[#c9523f]" aria-label={`Remove ${p.name} from wishlist`}>
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </Drawer>
  );
}

export { money, PRODUCTS };
