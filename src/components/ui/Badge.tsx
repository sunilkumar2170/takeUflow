import { cn } from '../../utils/cn';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'easy' | 'medium' | 'hard' | 'default';
  className?: string;
}

export function Badge({ children, variant = 'default', className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-semibold font-mono',
        variant === 'easy' && 'diff-easy',
        variant === 'medium' && 'diff-medium',
        variant === 'hard' && 'diff-hard',
        variant === 'default' && 'bg-bg-elevated text-text-secondary border border-border-default',
        className
      )}
    >
      {children}
    </span>
  );
}
