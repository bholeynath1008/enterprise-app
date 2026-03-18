import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { cva, type VariantProps } from 'class-variance-authority';
import dayjs from 'dayjs';
import relativeTimePlugin from 'dayjs/plugin/relativeTime';
import type { TaskPriority } from '@/types';

dayjs.extend(relativeTimePlugin);

/** Tailwind merge + clsx combined */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Currency formatting using Intl */
export function fmt(n: number, currency = 'USD', locale = 'en-US'): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(n);
}

/** Compact number: 1200000 → $1.2M */
export function fmtCompact(n: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(n);
}

/** Percentage */
export function fmtPct(n: number, decimals = 1): string {
  return `${n.toFixed(decimals)}%`;
}

/** Localized date: 2025-05-01 → May 1, 2025 */
export function fmtDate(d: string | Date | null | undefined, format = 'MMM D, YYYY'): string {
  if (!d) return '—';
  return dayjs(d).format(format);
}

/** Relative time: "3 hours ago" */
export function relativeTime(iso: string): string {
  return dayjs(iso).fromNow();
}

/** Get initials from full name */
export function getInitials(name: string): string {
  return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
}

/** Human-readable status label */
export function labelStatus(s: string): string {
  const map: Record<string, string> = {
    in_progress: 'In Progress',
    super_admin: 'Super Admin',
    franchisor_staff: 'HQ Staff',
    franchisee_owner: 'Franchisee Owner',
    location_manager: 'Location Manager',
  };
  return map[s] ?? s.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
}

// ---- CVA variant helpers ----

export const badgeVariants = cva(
  'inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold tracking-wide border',
  {
    variants: {
      variant: {
        default: 'bg-muted text-muted-foreground border-border',
        success: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20',
        warning: 'bg-amber-500/15 text-amber-400 border-amber-500/20',
        danger: 'bg-red-500/15 text-red-400 border-red-500/20',
        info: 'bg-blue-500/15 text-blue-400 border-blue-500/20',
        purple: 'bg-purple-500/15 text-purple-400 border-purple-500/20',
      },
    },
    defaultVariants: { variant: 'default' },
  }
);

export type BadgeVariants = VariantProps<typeof badgeVariants>;

/** Map status string → badge variant */
export function statusVariant(s: string): BadgeVariants['variant'] {
  const map: Record<string, BadgeVariants['variant']> = {
    active: 'success', paid: 'success', resolved: 'success',
    completed: 'success', approved: 'success',
    pending: 'warning', warning: 'warning', submitted: 'info',
    in_progress: 'info', open: 'danger', overdue: 'danger',
    suspended: 'danger', rejected: 'danger', high: 'danger',
    medium: 'warning', low: 'default',
    premium: 'purple', enterprise: 'info',
  };
  return map[s?.toLowerCase()] ?? 'default';
}

export const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 rounded-lg text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50 disabled:pointer-events-none',
  {
    variants: {
      variant: {
        primary: 'bg-blue-600 text-white hover:bg-blue-500 active:scale-95',
        secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
        ghost: 'bg-transparent border border-border text-muted-foreground hover:bg-accent hover:text-foreground',
        danger: 'bg-red-500/15 text-red-400 border border-red-500/20 hover:bg-red-500/25',
        success: 'bg-emerald-600 text-white hover:bg-emerald-500',
      },
      size: {
        sm: 'px-2.5 py-1.5 text-xs',
        md: 'px-4 py-2',
        lg: 'px-6 py-3 text-base',
        icon: 'p-2',
      },
    },
    defaultVariants: { variant: 'primary', size: 'md' },
  }
);
