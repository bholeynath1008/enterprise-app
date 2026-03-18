import React, { useMemo } from 'react';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/atoms';
import { Search } from 'lucide-react';

// ---- Card ----
export const Card = React.memo(({ children, className }: { children: React.ReactNode; className?: string }) => (
  <div className={cn('bg-card border border-border rounded-xl', className)}>{children}</div>
));
Card.displayName = 'Card';

export const CardHeader = React.memo(({ children, className }: { children: React.ReactNode; className?: string }) => (
  <div className={cn('flex items-center justify-between p-5 border-b border-border', className)}>{children}</div>
));
CardHeader.displayName = 'CardHeader';

export const CardTitle = React.memo(({ children, className }: { children: React.ReactNode; className?: string }) => (
  <h3 className={cn('text-sm font-semibold text-foreground', className)}>{children}</h3>
));
CardTitle.displayName = 'CardTitle';

export const CardContent = React.memo(({ children, className }: { children: React.ReactNode; className?: string }) => (
  <div className={cn('p-5', className)}>{children}</div>
));
CardContent.displayName = 'CardContent';

// ---- StatCard ----
interface StatCardProps {
  label: string;
  value: string | number;
  change?: string;
  changeType?: 'up' | 'down' | 'flat';
  icon?: React.ReactNode;
  accent?: 'blue' | 'emerald' | 'amber' | 'red' | 'purple';
  loading?: boolean;
}

const accentStyles: Record<string, string> = {
  blue: 'from-blue-500/10 to-transparent border-blue-500/20',
  emerald: 'from-emerald-500/10 to-transparent border-emerald-500/20',
  amber: 'from-amber-500/10 to-transparent border-amber-500/20',
  red: 'from-red-500/10 to-transparent border-red-500/20',
  purple: 'from-purple-500/10 to-transparent border-purple-500/20',
};

export const StatCard = React.memo(({ label, value, change, changeType = 'flat', icon, accent = 'blue', loading }: StatCardProps) => {
  const changeClass = changeType === 'up' ? 'text-emerald-400' : changeType === 'down' ? 'text-red-400' : 'text-muted-foreground';
  const changeIcon = changeType === 'up' ? '▲' : changeType === 'down' ? '▼' : '→';

  if (loading) {
    return (
      <div className="bg-card border border-border rounded-xl p-5">
        <Skeleton className="h-3 w-24 mb-3" />
        <Skeleton className="h-8 w-32 mb-2" />
        <Skeleton className="h-3 w-20" />
      </div>
    );
  }

  return (
    <div className={cn('bg-gradient-to-br border rounded-xl p-5 relative overflow-hidden', accentStyles[accent])}>
      {icon && <div className="absolute top-4 right-4 opacity-30 text-2xl">{icon}</div>}
      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-2">{label}</p>
      <p className="text-3xl font-bold text-foreground leading-none mb-2">{value}</p>
      {change && (
        <p className={cn('text-xs flex items-center gap-1', changeClass)}>
          <span>{changeIcon}</span><span>{change}</span>
        </p>
      )}
    </div>
  );
});
StatCard.displayName = 'StatCard';

// ---- SearchBar ----
interface SearchBarProps {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  className?: string;
}

export const SearchBar = React.memo(({ value, onChange, placeholder = 'Search...', className }: SearchBarProps) => (
  <div className={cn('relative', className)}>
    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" aria-hidden />
    <input
      type="search"
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      className="form-input pl-9"
      aria-label={placeholder}
    />
  </div>
));
SearchBar.displayName = 'SearchBar';

// ---- EmptyState ----
interface EmptyStateProps { icon?: React.ReactNode; title: string; description?: string; action?: React.ReactNode }
export const EmptyState = React.memo(({ icon, title, description, action }: EmptyStateProps) => (
  <div className="flex flex-col items-center justify-center py-16 text-center px-4">
    {icon && <div className="text-4xl mb-4 opacity-30" aria-hidden>{icon}</div>}
    <p className="font-semibold text-foreground mb-1">{title}</p>
    {description && <p className="text-sm text-muted-foreground mb-4 max-w-sm">{description}</p>}
    {action}
  </div>
));
EmptyState.displayName = 'EmptyState';

// ---- FilterBar ----
interface FilterOption { value: string; label: string }
interface FilterBarProps {
  filters: { key: string; label: string; options: FilterOption[]; value: string }[];
  onFilterChange: (key: string, value: string) => void;
  rightContent?: React.ReactNode;
  searchValue?: string;
  onSearchChange?: (v: string) => void;
  searchPlaceholder?: string;
}

export const FilterBar = React.memo(({ filters, onFilterChange, rightContent, searchValue, onSearchChange, searchPlaceholder }: FilterBarProps) => (
  <div className="flex flex-wrap items-center gap-3 mb-4" role="search" aria-label="Filters">
    {onSearchChange !== undefined && (
      <SearchBar value={searchValue ?? ''} onChange={onSearchChange} placeholder={searchPlaceholder} className="flex-1 min-w-[200px]" />
    )}
    {filters.map(f => (
      <select
        key={f.key}
        value={f.value}
        onChange={e => onFilterChange(f.key, e.target.value)}
        className="form-input w-auto cursor-pointer"
        aria-label={f.label}
      >
        {f.options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    ))}
    {rightContent && <div className="ml-auto flex items-center gap-2">{rightContent}</div>}
  </div>
));
FilterBar.displayName = 'FilterBar';

// ---- TableSkeleton ----
export const TableSkeleton = React.memo(({ rows = 6, cols = 5 }: { rows?: number; cols?: number }) => (
  <div className="space-y-0" aria-busy="true" aria-label="Loading table">
    {Array.from({ length: rows }).map((_, i) => (
      <div key={i} className="flex gap-4 px-5 py-3.5 border-b border-border">
        {Array.from({ length: cols }).map((_, j) => (
          <Skeleton key={j} className={cn('h-4 flex-1', j === 0 && 'flex-[2]')} />
        ))}
      </div>
    ))}
  </div>
));
TableSkeleton.displayName = 'TableSkeleton';
