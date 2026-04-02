import { cn } from '../../utils/cn';

interface ProgressBarProps {
  value: number;
  max?: number;
  color?: string;
  size?: 'sm' | 'md';
  className?: string;
  showLabel?: boolean;
}

export function ProgressBar({ value, max = 100, color = '#3b82f6', size = 'sm', className, showLabel }: ProgressBarProps) {
  const pct = Math.min(100, Math.round((value / max) * 100));
  return (
    <div className={cn('w-full', className)}>
      {showLabel && (
        <div className="flex justify-between text-xs text-text-muted mb-1 font-mono">
          <span>{value}/{max}</span>
          <span>{pct}%</span>
        </div>
      )}
      <div className={cn('w-full bg-bg-hover rounded-full overflow-hidden', size === 'sm' ? 'h-1.5' : 'h-2')}>
        <div
          className="h-full rounded-full transition-all duration-700 ease-out"
          style={{ width: `${pct}%`, background: color, minWidth: pct > 0 ? 4 : 0 }}
        />
      </div>
    </div>
  );
}
