import { cn } from '../../utils/cn';

interface FilterChipProps {
  label: string;
  active?: boolean;
  onClick: () => void;
  color?: 'default' | 'easy' | 'medium' | 'hard';
  count?: number;
}

const colorMap = {
  default: { active: 'chip-active', inactive: 'chip-default' },
  easy: { active: 'chip bg-easy/10 border-easy/30 text-easy', inactive: 'chip-default' },
  medium: { active: 'chip bg-medium/10 border-medium/30 text-medium', inactive: 'chip-default' },
  hard: { active: 'chip bg-hard/10 border-hard/30 text-hard', inactive: 'chip-default' },
};

export function FilterChip({ label, active, onClick, color = 'default', count }: FilterChipProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        active ? colorMap[color].active : colorMap[color].inactive,
        'active:scale-95'
      )}
    >
      {label}
      {count !== undefined && (
        <span className={cn('ml-1.5 font-mono text-[10px]', active ? 'opacity-80' : 'opacity-50')}>
          {count}
        </span>
      )}
    </button>
  );
}
