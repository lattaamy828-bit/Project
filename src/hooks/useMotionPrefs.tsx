import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';

interface MotionApi {
  /** True when animation should be suppressed (OS setting or the in-page switch). */
  reduced: boolean;
  /** The user's explicit in-page choice, independent of the OS setting. */
  userOff: boolean;
  setUserOff(v: boolean): void;
  /** Coarse pointer / small viewport — heavy effects step down. */
  lite: boolean;
}

const Ctx = createContext<MotionApi>({ reduced: false, userOff: false, setUserOff: () => {}, lite: false });

function readPref(): boolean {
  try {
    return localStorage.getItem('ae.motion') === 'off';
  } catch {
    return false;
  }
}

export function MotionProvider({ children }: { children: ReactNode }) {
  const [osReduced, setOsReduced] = useState(
    () => typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches,
  );
  const [userOff, setUserOffState] = useState(readPref);
  const [lite, setLite] = useState(false);

  useEffect(() => {
    const mq = matchMedia('(prefers-reduced-motion: reduce)');
    const onChange = () => setOsReduced(mq.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  /**
   * "Lite" is not about taste — it is about budget. Phones and coarse pointers
   * get fewer particles, no pointer-tracked lighting and shorter flows.
   */
  useEffect(() => {
    const mq = matchMedia('(max-width: 900px), (pointer: coarse)');
    const onChange = () => setLite(mq.matches);
    onChange();
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  const setUserOff = (v: boolean) => {
    setUserOffState(v);
    try {
      localStorage.setItem('ae.motion', v ? 'off' : 'on');
    } catch {
      /* ignore */
    }
  };

  const reduced = osReduced || userOff;

  useEffect(() => {
    document.documentElement.dataset.motion = reduced ? 'off' : 'on';
  }, [reduced]);

  const value = useMemo(() => ({ reduced, userOff, setUserOff, lite }), [reduced, userOff, lite]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export const useMotionPrefs = () => useContext(Ctx);
