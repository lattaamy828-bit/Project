import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { PRODUCTS, getProduct, type Product } from '../data/products';

export interface CartLine {
  id: string;
  variant: string;
  qty: number;
}

export interface Toast {
  key: number;
  title: string;
  body: string;
  tone: 'cart' | 'wish' | 'info';
}

/** One in-flight "product flies to the cart" animation. */
export interface Flight {
  key: number;
  from: { x: number; y: number };
  color: string;
  painting: string;
}

interface ShopApi {
  cart: CartLine[];
  wishlist: string[];
  compare: string[];
  cartCount: number;
  subtotal: number;
  shipping: number;
  total: number;
  cartOpen: boolean;
  searchOpen: boolean;
  wishOpen: boolean;
  toasts: Toast[];
  flights: Flight[];
  lastAdded: string | null;
  add(product: Product, variant?: string, qty?: number, origin?: DOMRect | null): void;
  remove(id: string, variant: string): void;
  setQty(id: string, variant: string, qty: number): void;
  clearCart(): void;
  toggleWish(id: string): void;
  inWish(id: string): boolean;
  toggleCompare(id: string): void;
  inCompare(id: string): boolean;
  clearCompare(): void;
  setCartOpen(v: boolean): void;
  setSearchOpen(v: boolean): void;
  setWishOpen(v: boolean): void;
  notify(t: Omit<Toast, 'key'>): void;
  dismissToast(key: number): void;
  endFlight(key: number): void;
  cartTarget: React.MutableRefObject<HTMLElement | null>;
}

const ShopCtx = createContext<ShopApi | null>(null);

const FREE_SHIPPING_AT = 150;
const SHIPPING_FEE = 12;

/** localStorage is a convenience here, never a requirement — every read is guarded. */
function readStore<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function writeStore(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* private mode, blocked storage — the session simply does not persist */
  }
}

let seq = 0;

export function ShopProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartLine[]>(() => readStore<CartLine[]>('ae.cart', []));
  const [wishlist, setWishlist] = useState<string[]>(() => readStore<string[]>('ae.wish', []));
  const [compare, setCompare] = useState<string[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [wishOpen, setWishOpen] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [flights, setFlights] = useState<Flight[]>([]);
  const [lastAdded, setLastAdded] = useState<string | null>(null);
  const cartTarget = useRef<HTMLElement | null>(null);

  useEffect(() => writeStore('ae.cart', cart), [cart]);
  useEffect(() => writeStore('ae.wish', wishlist), [wishlist]);

  const dismissToast = useCallback((key: number) => {
    setToasts((t) => t.filter((x) => x.key !== key));
  }, []);

  const notify = useCallback(
    (t: Omit<Toast, 'key'>) => {
      const key = ++seq;
      setToasts((prev) => [...prev.slice(-2), { ...t, key }]);
      window.setTimeout(() => dismissToast(key), 3800);
    },
    [dismissToast],
  );

  const endFlight = useCallback((key: number) => {
    setFlights((f) => f.filter((x) => x.key !== key));
  }, []);

  const add = useCallback<ShopApi['add']>(
    (product, variant, qty = 1, origin) => {
      if (product.stock === 0) {
        notify({ title: 'Sold out', body: `${product.name} is currently out of stock.`, tone: 'info' });
        return;
      }
      const v = variant ?? product.variants[0]?.name ?? 'Default';
      setCart((prev) => {
        const i = prev.findIndex((l) => l.id === product.id && l.variant === v);
        if (i === -1) return [...prev, { id: product.id, variant: v, qty }];
        const next = [...prev];
        next[i] = { ...next[i], qty: Math.min(99, next[i].qty + qty) };
        return next;
      });
      setLastAdded(product.id);
      window.setTimeout(() => setLastAdded(null), 900);

      if (origin) {
        const key = ++seq;
        setFlights((f) => [
          ...f,
          {
            key,
            from: { x: origin.left + origin.width / 2, y: origin.top + origin.height / 2 },
            color: product.hue[0],
            painting: product.painting,
          },
        ]);
      }
      notify({
        title: 'Added to the cart',
        body: `${product.name} · ${v}`,
        tone: 'cart',
      });
    },
    [notify],
  );

  const remove = useCallback((id: string, variant: string) => {
    setCart((prev) => prev.filter((l) => !(l.id === id && l.variant === variant)));
  }, []);

  const setQty = useCallback(
    (id: string, variant: string, qty: number) => {
      if (qty <= 0) return remove(id, variant);
      setCart((prev) => prev.map((l) => (l.id === id && l.variant === variant ? { ...l, qty: Math.min(99, qty) } : l)));
    },
    [remove],
  );

  const clearCart = useCallback(() => setCart([]), []);

  const toggleWish = useCallback(
    (id: string) => {
      setWishlist((prev) => {
        const has = prev.includes(id);
        const p = getProduct(id);
        notify({
          title: has ? 'Removed from the wishlist' : 'Saved to the wishlist',
          body: p ? p.name : id,
          tone: 'wish',
        });
        return has ? prev.filter((x) => x !== id) : [...prev, id];
      });
    },
    [notify],
  );

  const toggleCompare = useCallback(
    (id: string) => {
      setCompare((prev) => {
        if (prev.includes(id)) return prev.filter((x) => x !== id);
        if (prev.length >= 3) {
          notify({ title: 'Comparison is full', body: 'Three pieces at a time — remove one to add another.', tone: 'info' });
          return prev;
        }
        return [...prev, id];
      });
    },
    [notify],
  );

  const subtotal = useMemo(
    () =>
      cart.reduce((sum, l) => {
        const p = getProduct(l.id);
        return sum + (p ? p.price * l.qty : 0);
      }, 0),
    [cart],
  );

  const cartCount = useMemo(() => cart.reduce((n, l) => n + l.qty, 0), [cart]);
  const shipping = subtotal === 0 || subtotal >= FREE_SHIPPING_AT ? 0 : SHIPPING_FEE;

  const value = useMemo<ShopApi>(
    () => ({
      cart,
      wishlist,
      compare,
      cartCount,
      subtotal,
      shipping,
      total: subtotal + shipping,
      cartOpen,
      searchOpen,
      wishOpen,
      toasts,
      flights,
      lastAdded,
      add,
      remove,
      setQty,
      clearCart,
      toggleWish,
      inWish: (id) => wishlist.includes(id),
      toggleCompare,
      inCompare: (id) => compare.includes(id),
      clearCompare: () => setCompare([]),
      setCartOpen,
      setSearchOpen,
      setWishOpen,
      notify,
      dismissToast,
      endFlight,
      cartTarget,
    }),
    [
      cart, wishlist, compare, cartCount, subtotal, shipping, cartOpen, searchOpen, wishOpen,
      toasts, flights, lastAdded, add, remove, setQty, clearCart, toggleWish, toggleCompare,
      notify, dismissToast, endFlight,
    ],
  );

  return <ShopCtx.Provider value={value}>{children}</ShopCtx.Provider>;
}

export function useShop(): ShopApi {
  const ctx = useContext(ShopCtx);
  if (!ctx) throw new Error('useShop must be used inside <ShopProvider>');
  return ctx;
}

export { FREE_SHIPPING_AT, PRODUCTS };
