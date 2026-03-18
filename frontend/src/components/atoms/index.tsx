import React from 'react';
import { cn, buttonVariants, badgeVariants, statusVariant, labelStatus, getInitials } from '@/lib/utils';
import type { VariantProps } from 'class-variance-authority';
import { Loader2 } from 'lucide-react';

// ---- Button ----
export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button = React.memo(
  React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant, size, loading, leftIcon, rightIcon, children, disabled, ...props }, ref) => (
      <button
        ref={ref}
        className={cn(buttonVariants({ variant, size }), className)}
        disabled={disabled || loading}
        aria-busy={loading}
        {...props}
      >
        {loading ? <Loader2 size={14} className="animate-spin" /> : leftIcon}
        {children}
        {!loading && rightIcon}
      </button>
    )
  )
);
Button.displayName = 'Button';

// ---- Badge ----
export interface BadgeProps extends VariantProps<typeof badgeVariants> {
  children: React.ReactNode;
  className?: string;
}

export const Badge = React.memo(({ children, variant, className }: BadgeProps) => (
  <span className={cn(badgeVariants({ variant }), className)}>{children}</span>
));
Badge.displayName = 'Badge';

export const StatusBadge = React.memo(({ status }: { status: string }) => (
  <Badge variant={statusVariant(status)}>{labelStatus(status)}</Badge>
));
StatusBadge.displayName = 'StatusBadge';

export const PriorityBadge = React.memo(({ priority }: { priority: string }) => (
  <Badge variant={statusVariant(priority)}>{priority.charAt(0).toUpperCase() + priority.slice(1)}</Badge>
));
PriorityBadge.displayName = 'PriorityBadge';

// ---- Spinner ----
export const Spinner = React.memo(({ size = 16, className }: { size?: number; className?: string }) => (
  <Loader2 size={size} className={cn('animate-spin text-primary', className)} aria-label="Loading" />
));
Spinner.displayName = 'Spinner';

// ---- Input ----
export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export const Input = React.memo(
  React.forwardRef<HTMLInputElement, InputProps>(({ label, error, hint, className, id, ...props }, ref) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-');
    return (
      <div className="space-y-1.5">
        {label && (
          <label htmlFor={inputId} className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={cn(
            'form-input',
            error && 'border-red-500/50 focus:ring-red-500/30 focus:border-red-500',
            className
          )}
          aria-invalid={!!error}
          aria-describedby={error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined}
          {...props}
        />
        {error && <p id={`${inputId}-error`} className="text-xs text-red-400 flex items-center gap-1">⚠ {error}</p>}
        {hint && !error && <p id={`${inputId}-hint`} className="text-xs text-muted-foreground">{hint}</p>}
      </div>
    );
  })
);
Input.displayName = 'Input';

// ---- Select ----
export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: { value: string; label: string }[];
}

export const Select = React.memo(
  React.forwardRef<HTMLSelectElement, SelectProps>(({ label, error, options, className, id, ...props }, ref) => {
    const selId = id ?? label?.toLowerCase().replace(/\s+/g, '-');
    return (
      <div className="space-y-1.5">
        {label && (
          <label htmlFor={selId} className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            {label}
          </label>
        )}
        <select
          ref={ref}
          id={selId}
          className={cn('form-input cursor-pointer', error && 'border-red-500/50', className)}
          {...props}
        >
          {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
        {error && <p className="text-xs text-red-400">⚠ {error}</p>}
      </div>
    );
  })
);
Select.displayName = 'Select';

// ---- Avatar ----
interface AvatarProps { name: string; color?: string; size?: 'sm' | 'md' | 'lg' }
const sizeMap = { sm: 'w-7 h-7 text-xs', md: 'w-9 h-9 text-sm', lg: 'w-11 h-11 text-base' };
const colorMap: Record<string, string> = {
  blue: 'bg-blue-500/20 text-blue-300', emerald: 'bg-emerald-500/20 text-emerald-300',
  amber: 'bg-amber-500/20 text-amber-300', purple: 'bg-purple-500/20 text-purple-300',
  cyan: 'bg-cyan-500/20 text-cyan-300',
};

export const Avatar = React.memo(({ name, color = 'blue', size = 'md' }: AvatarProps) => (
  <div
    className={cn('rounded-full flex items-center justify-center font-semibold flex-shrink-0', sizeMap[size], colorMap[color] ?? colorMap.blue)}
    aria-label={name}
    role="img"
  >
    {getInitials(name)}
  </div>
));
Avatar.displayName = 'Avatar';

// ---- ProgressBar ----
interface ProgressBarProps { value: number; max?: number; color?: 'blue' | 'emerald' | 'amber' | 'red' | 'auto' }
export const ProgressBar = React.memo(({ value, max = 100, color = 'blue' }: ProgressBarProps) => {
  const pct = Math.min(100, Math.round((value / max) * 100));
  const fill = color === 'auto'
    ? pct >= 80 ? 'bg-emerald-500' : pct >= 60 ? 'bg-amber-500' : 'bg-red-500'
    : { blue: 'bg-blue-500', emerald: 'bg-emerald-500', amber: 'bg-amber-500', red: 'bg-red-500' }[color];
  return (
    <div className="h-1.5 bg-muted rounded-full overflow-hidden" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100}>
      <div className={cn('h-full rounded-full transition-all duration-500', fill)} style={{ width: `${pct}%` }} />
    </div>
  );
});
ProgressBar.displayName = 'ProgressBar';

// ---- Skeleton ----
export const Skeleton = ({ className }: { className?: string }) => (
  <div className={cn('animate-pulse rounded-md bg-muted/60', className)} aria-hidden="true" />
);
