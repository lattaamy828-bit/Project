import { useEffect, type RefObject } from 'react';
import { useMotionPrefs } from './useMotionPrefs';

/**
 * Pointer/scroll parallax, written straight onto the layers that move.
 *
 * Two approaches were measured here. Driving the layers from a CSS custom
 * property set on the section looks tidy, but changing a custom property
 * invalidates style for every descendant that could inherit it — and this hero
 * holds several thousand SVG nodes, which cost ~700ms of style recalculation
 * per second of scrolling. Writing `transform` directly to the handful of
 * animated elements invalidates only those elements, and costs nothing
 * measurable.
 *
 * Layers opt in declaratively:
 *   data-parallax="0.35"            depth; larger moves further and faster
 *   data-parallax-base="translate(-50%,-50%)"   optional transform prefix
 *   data-parallax-z="-180"          optional constant Z, in px
 */
export function useParallax(host: RefObject<HTMLElement>, damping = 0.08) {
  const { reduced, lite } = useMotionPrefs();

  useEffect(() => {
    const root = host.current;
    if (!root) return;

    const layers = Array.from(root.querySelectorAll<HTMLElement>('[data-parallax]')).map((el) => ({
      el,
      depth: Number(el.dataset.parallax) || 0,
      base: el.dataset.parallaxBase ?? '',
      z: Number(el.dataset.parallaxZ) || 0,
    }));
    if (layers.length === 0) return;

    if (reduced) {
      for (const l of layers) l.el.style.transform = `${l.base} translate3d(0,0,${l.z}px)`.trim();
      return;
    }

    let targetX = 0;
    let targetY = 0;
    let curX = 0;
    let curY = 0;
    let scroll = window.scrollY;
    let frame = 0;
    let running = true;

    const onMove = (e: PointerEvent) => {
      targetX = (e.clientX / window.innerWidth) * 2 - 1;
      targetY = (e.clientY / window.innerHeight) * 2 - 1;
    };
    const onScroll = () => {
      scroll = Math.min(900, window.scrollY);
    };

    const tick = () => {
      if (!running) return;
      curX += (targetX - curX) * damping;
      curY += (targetY - curY) * damping;
      for (const l of layers) {
        const dx = -curX * l.depth * 26;
        const dy = -curY * l.depth * 20 - scroll * l.depth * 0.11;
        l.el.style.transform = `${l.base} translate3d(${dx.toFixed(2)}px, ${dy.toFixed(2)}px, ${l.z}px)`.trim();
      }
      frame = requestAnimationFrame(tick);
    };

    if (!lite) window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    frame = requestAnimationFrame(tick);

    /* Never burn frames on a backgrounded tab. */
    const onVis = () => {
      if (document.hidden) {
        running = false;
        cancelAnimationFrame(frame);
      } else if (!running) {
        running = true;
        frame = requestAnimationFrame(tick);
      }
    };
    document.addEventListener('visibilitychange', onVis);

    return () => {
      running = false;
      cancelAnimationFrame(frame);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('scroll', onScroll);
      document.removeEventListener('visibilitychange', onVis);
    };
  }, [host, damping, reduced, lite]);
}

/**
 * Scroll velocity as a subtle skew, written directly to the matched elements
 * for the same reason as above.
 */
export function useScrollSkew(host: RefObject<HTMLElement>, selector = '[data-skew]') {
  const { reduced } = useMotionPrefs();

  useEffect(() => {
    const root = host.current;
    if (!root || reduced) return;
    const els = Array.from(root.querySelectorAll<HTMLElement>(selector));
    if (els.length === 0) return;

    let last = window.scrollY;
    let raw = window.scrollY;
    let v = 0;
    let frame = 0;
    let running = true;
    let settled = false;

    const onScroll = () => {
      raw = window.scrollY;
    };
    const tick = () => {
      if (!running) return;
      const d = raw - last;
      last = raw;
      v += (Math.max(-60, Math.min(60, d)) - v) * 0.18;
      if (Math.abs(v) < 0.05) v = 0;
      // Skip the write entirely once the value has settled at rest.
      if (v !== 0 || !settled) {
        const t = `skewY(${(v * 0.012).toFixed(3)}deg) translateY(${(v * 0.06).toFixed(2)}px)`;
        for (const el of els) el.style.transform = t;
        settled = v === 0;
      }
      frame = requestAnimationFrame(tick);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    frame = requestAnimationFrame(tick);
    const onVis = () => {
      if (document.hidden) {
        running = false;
        cancelAnimationFrame(frame);
      } else if (!running) {
        running = true;
        frame = requestAnimationFrame(tick);
      }
    };
    document.addEventListener('visibilitychange', onVis);

    return () => {
      running = false;
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', onScroll);
      document.removeEventListener('visibilitychange', onVis);
    };
  }, [host, selector, reduced]);
}
