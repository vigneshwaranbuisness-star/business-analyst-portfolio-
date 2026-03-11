import * as React from 'react';
import { cn } from '@/src/lib/utils';

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'success' | 'danger' | 'warning' | 'info';
}

const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(
  ({ className, variant = 'default', ...props }, ref) => {
    const variants = {
      default: 'bg-zinc-800 text-zinc-400 border border-zinc-700',
      success: 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20',
      danger: 'bg-rose-500/10 text-rose-500 border border-rose-500/20',
      warning: 'bg-amber-500/10 text-amber-500 border border-amber-500/20',
      info: 'bg-sky-500/10 text-sky-500 border border-sky-500/20',
    };

    return (
      <div
        ref={ref}
        className={cn(
          'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors',
          variants[variant],
          className
        )}
        {...props}
      />
    );
  }
);

Badge.displayName = 'Badge';

export { Badge };
