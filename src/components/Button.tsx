import * as React from 'react';
import { cn } from '@/src/lib/utils';

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  glow?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', glow = false, ...props }, ref) => {
    const variants = {
      primary: 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm',
      secondary: 'bg-zinc-800 text-zinc-100 hover:bg-zinc-700 shadow-sm',
      outline: 'border border-zinc-700 bg-transparent text-zinc-100 hover:bg-zinc-800',
      ghost: 'bg-transparent text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100',
      danger: 'bg-rose-600 text-white hover:bg-rose-700 shadow-sm',
    };

    const glowStyles = {
      primary: 'shadow-[0_0_20px_rgba(16,185,129,0.2)] hover:shadow-[0_0_25px_rgba(16,185,129,0.3)]',
      secondary: 'shadow-[0_0_20px_rgba(39,39,42,0.2)]',
      outline: '',
      ghost: '',
      danger: 'shadow-[0_0_20px_rgba(225,29,72,0.2)] hover:shadow-[0_0_25px_rgba(225,29,72,0.3)]',
    };

    const sizes = {
      sm: 'h-8 px-3 text-xs',
      md: 'h-10 px-4 py-2 text-sm',
      lg: 'h-12 px-8 text-base',
      icon: 'h-10 w-10',
    };

    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center rounded-lg font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 disabled:pointer-events-none disabled:opacity-50 active:scale-95',
          variants[variant],
          glow && glowStyles[variant],
          sizes[size],
          className
        )}
        {...props}
      />
    );
  }
);

Button.displayName = 'Button';

export { Button };
