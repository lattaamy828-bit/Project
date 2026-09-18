import { useRef, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { useMotionPrefs } from '../hooks/useMotionPrefs';

interface Props {
  children: ReactNode;
  className?: string;
  onClick?: (e: React.MouseEvent<HTMLElement>) => void;
  to?: string;
  href?: string;
  type?: 'button' | 'submit';
  strength?: number;
  ariaLabel?: string;
  disabled?: boolean;
}

/**
 * A control that leans toward the cursor as it approaches, then springs back.
 *
 * Renders as a Link, an anchor or a button depending on what it is given, so
 * the magnetism never costs correct semantics.
 */
export default function MagneticButton({
  children,
  className,
  onClick,
  to,
  href,
  type = 'button',
  strength = 0.34,
  ariaLabel,
  disabled,
}: Props) {
  const ref = useRef<HTMLElement | null>(null);
  const { reduced, lite } = useMotionPrefs();
  const magnetic = !reduced && !lite;

  const onMove = (e: React.PointerEvent<HTMLElement>) => {
    if (!magnetic) return;
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const dx = e.clientX - (r.left + r.width / 2);
    const dy = e.clientY - (r.top + r.height / 2);
    el.style.transform = `translate3d(${(dx * strength).toFixed(1)}px, ${(dy * strength).toFixed(1)}px, 0)`;
  };

  const onLeave = () => {
    const el = ref.current;
    if (el) el.style.transform = 'translate3d(0,0,0)';
  };

  const shared = {
    ref: ref as never,
    className,
    onPointerMove: onMove,
    onPointerLeave: onLeave,
    onClick,
    'aria-label': ariaLabel,
    style: { transition: 'transform 520ms cubic-bezier(.22,1,.36,1)' },
  };

  if (to) return <Link to={to} {...shared}>{children}</Link>;
  if (href) return <a href={href} target="_blank" rel="noreferrer" {...shared}>{children}</a>;
  return <button type={type} disabled={disabled} {...shared}>{children}</button>;
}
